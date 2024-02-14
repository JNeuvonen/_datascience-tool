import asyncio
import json
import logging
from fastapi import HTTPException
import pandas as pd
import threading
import sqlite3
import datetime
from contextlib import contextmanager
from typing import List
import zipfile
import os
import shutil
from config import append_app_data_path, is_testing
from constants import (
    TEMP_EXTRACTED_FILES,
    AppConstants,
    DateFilterTypes,
    Messages,
    NumericalFilterTypes,
    TextFilterTypes,
)

from decorators import LogException
from log import get_logger
from query_datafile import DatafileQuery
from query_project import ProjectQuery
from request_types import BodyUploadDatasets
from concurrent.futures import ThreadPoolExecutor


def is_sqlite_text_date(column_type, value):
    if column_type.upper() != "TEXT":
        return False

    try:
        datetime.datetime.strptime(value, "%Y-%m-%d")
        return True
    except ValueError:
        pass

    try:
        datetime.datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        return True
    except ValueError:
        pass

    return False


def get_datafile_table_name(project_name: str, file_path: str):
    return project_name + "_" + file_path


def get_distinct_count(table_name: str, column_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'SELECT COUNT(DISTINCT "{column_name}") FROM "{table_name}"')
        distinct_count = cursor.fetchone()[0]
        return distinct_count


def get_distinct_values(table_name: str, column_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'SELECT DISTINCT {column_name} FROM "{table_name}"')
        distinct_values = cursor.fetchall()
        return [value[0] for value in distinct_values]


def get_first_nonnull(table_name: str, column_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(
            f'SELECT {column_name} FROM "{table_name}" WHERE {column_name} IS NOT NULL LIMIT 1'
        )
        first_row_value = cursor.fetchone()
        return first_row_value


def get_columns(table_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'PRAGMA table_info("{table_name}")')
        cols = []
        for row in cursor.fetchall():
            cols.append(row[1])
        return cols


def get_datafile_columns(project_name, file_path, datafile_metadata):
    columns = []
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        table_name = get_datafile_table_name(project_name, file_path)
        cursor.execute(f'PRAGMA table_info("{table_name}")')
        distinct_counts = json.loads(datafile_metadata.distinct_counts)
        distinct_values = json.loads(datafile_metadata.distinct_values)
        for row in cursor.fetchall():
            column_name = row[1]
            column_type = row[2]

            distinct_count = distinct_counts.get(column_name)
            categorical_values = distinct_values.get(column_name)
            first_row_value = get_first_nonnull(table_name, column_name)

            if distinct_count < 15:
                columns.append(
                    {
                        "name": column_name,
                        "type": "CATEGORY",
                        "categorical_values": categorical_values,
                    }
                )
            elif first_row_value and is_sqlite_text_date(
                column_type, first_row_value[0]
            ):
                columns.append(
                    {
                        "name": column_name,
                        "type": "DATE",
                        "categorical_values": None,
                    }
                )
            else:
                columns.append(
                    {
                        "name": column_name,
                        "type": column_type,
                        "categorical_values": None,
                    }
                )
    return columns


def get_datafile_metadata(path: str, project_id, was_import=True):
    with LogException():
        project = ProjectQuery.retrieve_project(project_id)
        file_size_bytes = os.path.getsize(path)
        file_name = get_path_last_item(path)
        distinct_counts = {}
        distinct_values = {}
        for item in get_columns(get_datafile_table_name(project.name, file_name)):
            count = get_distinct_count(
                get_datafile_table_name(project.name, file_name), item
            )
            distinct_counts[item] = count

            if count < 15:
                values = get_distinct_values(
                    get_datafile_table_name(project.name, file_name), item
                )
                distinct_values[item] = values
            else:
                distinct_values[item] = None

        return {
            "size_bytes": file_size_bytes,
            "file_name": file_name,
            "project_id": project_id,
            "was_import": was_import,
            "distinct_counts": json.dumps(distinct_counts),
            "distinct_values": json.dumps(distinct_values),
        }


def get_path_last_item(path: str):
    if "/" not in path:
        return path

    parts = path.split("/")

    return parts[len(parts) - 1]


@contextmanager
def unzip_file(zip_path, extract_to):
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(extract_to)
    yield extract_to
    shutil.rmtree(extract_to)


def run_in_thread(fn, *args, **kwargs):
    thread = threading.Thread(target=fn, args=args, kwargs=kwargs)
    thread.start()
    return thread


def get_sizes_of_files(file_paths: List[str]):
    with LogException():
        ret = []
        for file_path in file_paths:
            if file_path.endswith(".zip"):
                try:
                    with zipfile.ZipFile(file_path, "r") as zip_ref:
                        total_size = sum(
                            file_info.file_size for file_info in zip_ref.infolist()
                        )
                    ret.append(
                        {"file_path": file_path, "uncompressed_size": total_size}
                    )
                except zipfile.BadZipFile as e:
                    raise e
            else:
                pass

        return ret


def generate_numerical_filter_sql(column, filters):
    filter_type = filters.get("type")
    filter_value = filters.get("filter")
    filter_to = filters.get("filterTo")
    if filter_type == NumericalFilterTypes.LESS_THAN:
        return f"{column} < {filter_value}"
    elif filter_type == NumericalFilterTypes.GREATER_THAN:
        return f"{column} > {filter_value}"
    elif filter_type == NumericalFilterTypes.EQUALS:
        return f"{column} = {filter_value}"
    elif filter_type == NumericalFilterTypes.DOES_NOT_EQUAL:
        return f"{column} != {filter_value}"
    elif filter_type == NumericalFilterTypes.GREATER_THAN_OR_EQUAL_TO:
        return f"{column} >= {filter_value}"
    elif filter_type == NumericalFilterTypes.LESS_THAN_OR_EQUAL_TO:
        return f"{column} <= {filter_value}"
    elif filter_type == NumericalFilterTypes.BETWEEN:
        return f"{column} BETWEEN {filter_value} AND {filter_to}"
    elif filter_type == NumericalFilterTypes.BLANK:
        return f"{column} IS NULL"
    elif filter_type == NumericalFilterTypes.NOT_BLANK:
        return f"{column} IS NOT NULL"
    else:
        raise ValueError("Invalid filter type")


def generate_text_filter_sql(column, filters):
    filter_type = filters.get("type")
    filter_value = filters.get("filter")

    if filter_type == TextFilterTypes.CONTAINS:
        return f"{column} LIKE '%{filter_value}%'"
    elif filter_type == TextFilterTypes.DOES_NOT_CONTAIN:
        return f"{column} NOT LIKE '%{filter_value}%'"
    elif filter_type == TextFilterTypes.EQUALS:
        return f"{column} = '{filter_value}'"
    elif filter_type == TextFilterTypes.DOES_NOT_EQUAL:
        return f"{column} != '{filter_value}'"
    elif filter_type == TextFilterTypes.BEGINS_WITH:
        return f"{column} LIKE '{filter_value}%'"
    elif filter_type == TextFilterTypes.ENDS_WITH:
        return f"{column} LIKE '%{filter_value}'"
    elif filter_type == TextFilterTypes.BLANK:
        return f"({column} IS NULL OR {column} = '')"
    elif filter_type == TextFilterTypes.NOT_BLANK:
        return f"({column} IS NOT NULL AND {column} != '')"
    else:
        raise ValueError("Invalid filter type")


def generate_date_filter_sql(column, filters):
    filter_type = filters.get("type")
    date_from = filters.get("dateFrom")
    date_to = filters.get("dateTo")

    # In SQLite, to compare dates stored as TEXT you should use the DATE() function for conversion.
    if filter_type == DateFilterTypes.EQUALS:
        return f"DATE({column}) = DATE('{date_from}')"
    elif filter_type == DateFilterTypes.DOES_NOT_EQUAL:
        return f"DATE({column}) != DATE('{date_from}')"
    elif filter_type == DateFilterTypes.BEFORE:
        return f"DATE({column}) < DATE('{date_from}')"
    elif filter_type == DateFilterTypes.AFTER:
        return f"DATE({column}) > DATE('{date_from}')"
    elif filter_type == DateFilterTypes.BETWEEN:
        return f"DATE({column}) BETWEEN DATE('{date_from}') AND DATE('{date_to}')"
    elif filter_type == DateFilterTypes.BLANK:
        return f"({column} IS NULL OR {column} = '')"
    elif filter_type == DateFilterTypes.NOT_BLANK:
        return f"({column} IS NOT NULL AND {column} != '')"
    else:
        raise ValueError("Invalid filter type")


def ag_grid_numerical_to_sql(column, filters):
    operator = filters.get("operator")
    if operator is None:
        return generate_numerical_filter_sql(column, filters)
    else:
        condition_1 = filters.get("condition1")
        condition_2 = filters.get("condition2")
        return f"({generate_numerical_filter_sql(column, condition_1)} {operator} {generate_numerical_filter_sql(column, condition_2)})"


def ag_grid_category_to_sql(column, filters):
    conditions = []

    for item in filters["filter"]:
        if item == "" or item is None:
            condition = f"{column} IS NULL"
        else:
            condition = f"{column} LIKE '%{item}%'"
        conditions.append(condition)

    ret = " OR ".join(conditions)

    if len(ret) > 0:
        return f"({ret})"
    return ret


def ag_grid_text_to_sql(column, filters):
    operator = filters.get("operator")
    if operator is None:
        return generate_text_filter_sql(column, filters)
    else:
        condition_1 = filters.get("condition1")
        condition_2 = filters.get("condition2")
        return f"({generate_text_filter_sql(column, condition_1)} {operator} {generate_text_filter_sql(column, condition_2)})"


def ag_grid_date_to_sql(column, filters):
    operator = filters.get("operator")
    if operator is None:
        return generate_date_filter_sql(column, filters)
    else:
        condition_1 = filters.get("condition1")
        condition_2 = filters.get("condition2")
        operator_sql = "AND" if operator == "AND" else "OR"
        return f"({generate_date_filter_sql(column, condition_1)} {operator_sql} {generate_date_filter_sql(column, condition_2)})"


def ag_grid_filters_struct_to_sql(column, filters):
    with LogException():
        filter_type = filters.get("filterType")

        if filter_type == "number":
            return ag_grid_numerical_to_sql(column, filters)

        if filter_type == "text":
            return ag_grid_text_to_sql(column, filters)

        if filter_type == "category":
            return ag_grid_category_to_sql(column, filters)

        if filter_type == "date":
            return ag_grid_date_to_sql(column, filters)

        return None


def look_for_common_column(project, datafiles):
    cols_by_file = []
    for item in datafiles:
        table_name = get_datafile_table_name(project.name, item.file_name)
        cols = get_columns(table_name)
        cols_by_file.append({"table_name": table_name, "cols": cols})

    if not cols_by_file:
        return None

    common_cols = set(cols_by_file[0]["cols"])

    for file in cols_by_file[1:]:
        common_cols.intersection_update(file["cols"])

    return list(common_cols)


def update_join_col(project, datafiles, join_col):
    files_with_no_join = [item.file_name for item in datafiles]
    ids_pending_update = []

    for item in datafiles:
        table_name = get_datafile_table_name(project.name, item.file_name)
        cols = get_columns(table_name)

        if join_col in cols:
            if item.join_column is None:
                ids_pending_update.append(item.id)
            files_with_no_join.remove(item.file_name)

    return files_with_no_join, ids_pending_update


def count_rows(project_name: str, file_path: str, filters: List[str]):
    with LogException():
        where_conditions = "WHERE " + " AND ".join(filters) if filters else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = f'SELECT COUNT(*) FROM "{get_datafile_table_name(project_name, file_path)}" {where_conditions};'
            cursor.execute(query)
            return cursor.fetchone()[0]


def get_dataset_pagination(
    project_name: str, file_path: str, page: int, page_size: int, filters: List[str]
):
    with LogException():
        offset = (page - 1) * page_size

        where_conditions = "WHERE " + " AND ".join(filters) if len(filters) > 0 else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = f'SELECT * FROM "{get_datafile_table_name(project_name, file_path)}" {where_conditions} LIMIT {page_size} OFFSET {offset};'
            cursor.execute(query)
            return cursor.fetchall()


def datafile_to_sql(project_name, project_id, file_path: str):
    with LogException():
        if file_path.endswith(".zip"):
            with unzip_file(file_path, append_app_data_path(TEMP_EXTRACTED_FILES)):
                for filename in os.listdir(append_app_data_path(TEMP_EXTRACTED_FILES)):
                    process_file(
                        project_name,
                        project_id,
                        os.path.join(
                            append_app_data_path(TEMP_EXTRACTED_FILES), filename
                        ),
                    )
        else:
            process_file(project_name, project_id, file_path)


def process_file(project_name, project_id, file_path):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        first_chunk = True
        for chunk in pd.read_csv(file_path, chunksize=300000, header=0):
            try:
                chunk.to_sql(
                    get_datafile_table_name(
                        project_name, get_path_last_item(file_path)
                    ),
                    conn,
                    if_exists="replace" if first_chunk else "append",
                    index=False,
                )
            except Exception as _:
                pass
            if first_chunk:
                first_chunk = False

        DatafileQuery.create_datafile_entry(
            get_datafile_metadata(file_path, project_id)
        )


async def upload_datasets(project, body: BodyUploadDatasets):
    async def func_wrapper():
        try:
            logger = get_logger()
            logger.log(
                Messages.UPLOAD_FILES.format(
                    FILES_DONE="0", FILES_MAX=len(body.dataset_paths)
                ),
                logging.INFO,
                False,
                False,
            )
            for idx, item in enumerate(body.dataset_paths):
                datafile_to_sql(project.name, project.id, item)
                logger.log(
                    Messages.UPLOAD_FILES.format(
                        FILES_DONE=str(idx + 1), FILES_MAX=len(body.dataset_paths)
                    ),
                    logging.INFO,
                    False,
                    False,
                )

            logger = get_logger()
            logger.log(
                Messages.FILE_UPLOAD_FINISH,
                logging.INFO,
                False,
                False,
            )
        except Exception as e:
            logger = get_logger()
            logger.log(
                Messages.FILE_UPLOAD_FINISH,
                logging.INFO,
                False,
                False,
            )
            raise e

    if is_testing():
        await func_wrapper()
    else:
        executor = ThreadPoolExecutor()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, lambda: asyncio.run(func_wrapper()))


def get_join_col_actions(project_name):
    project = ProjectQuery.retrieve_project(project_name, "name")

    if project is None:
        raise HTTPException(status_code=400, detail="Incorrect project name")

    datafiles = DatafileQuery.get_datafiles_by_project(project.id)

    common_columns = None
    files_with_no_join = "N/A"
    if project.join_column is None:
        common_columns = look_for_common_column(project, datafiles)
    else:
        files_with_no_join, file_ids_pending_update = update_join_col(
            project, datafiles, project.join_column
        )
        for item in file_ids_pending_update:
            DatafileQuery.update_join_column(item, project.join_column)

    ret = {
        "common_columns": common_columns,
        "files_with_no_join": files_with_no_join,
    }
    return ret
