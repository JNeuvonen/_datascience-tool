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

from sqlalchemy.engine import base
from config import append_app_data_path, is_os_windows, is_testing
from constants import (
    TEMP_EXTRACTED_FILES,
    AppConstants,
    DateFilterTypes,
    Messages,
    NumericalFilterTypes,
    TextFilterTypes,
)

from decorators import LogException, Time
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


def rename_table(db_path, old_name, new_name):
    with LogException():
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(f'ALTER TABLE "{old_name}" RENAME TO "{new_name}"')
            conn.commit()


def get_datafile_table_name(project_name, file_path):
    return project_name + "_" + file_path


def get_distinct_count(table_name: str, column_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'SELECT COUNT(DISTINCT "{column_name}") FROM "{table_name}"')
        distinct_count = cursor.fetchone()[0]
        return distinct_count


def get_table_size_in_bytes(table_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f"PRAGMA page_count;")
        page_count = cursor.fetchone()[0]
        cursor.execute(f"PRAGMA page_size;")
        page_size = cursor.fetchone()[0]
        cursor.execute(f"SELECT count(*) FROM '{table_name}';")
        row_count = cursor.fetchone()[0]
        size = page_count * page_size * row_count
        return size


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


def delete_table(table_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'DROP TABLE IF EXISTS "{table_name}"')


def get_columns(table_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        cursor = conn.cursor()
        cursor.execute(f'PRAGMA table_info("{table_name}")')
        cols = []
        for row in cursor.fetchall():
            cols.append(row[1])
        return cols


def get_datafile_columns(project_name, file_path, datafile_metadata):
    with LogException():
        columns = []
        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            table_name = get_datafile_table_name(project_name, file_path)
            cursor.execute(f'PRAGMA table_info("{table_name}")')
            distinct_counts = (
                json.loads(datafile_metadata.distinct_counts)
                if datafile_metadata.distinct_counts
                else None
            )
            distinct_values = (
                json.loads(datafile_metadata.distinct_values)
                if datafile_metadata.distinct_values
                else None
            )

            first_non_null_values = (
                json.loads(datafile_metadata.first_non_null_values)
                if datafile_metadata.first_non_null_values
                else None
            )

            for row in cursor.fetchall():
                column_name = row[1]
                column_type = row[2]

                distinct_count = (
                    distinct_counts.get(column_name)
                    if distinct_counts is not None
                    else 0
                )
                categorical_values = (
                    distinct_values.get(column_name)
                    if distinct_values is not None
                    else 0
                )

                first_row_value = (
                    first_non_null_values.get(column_name)
                    if first_non_null_values
                    else None
                )

                if distinct_count is not None and distinct_count < 15:
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


def get_datafile_metadata(path: str):
    with LogException():
        table_size_bytes = get_table_size_in_bytes(path)
        distinct_counts = {}
        distinct_values = {}
        first_non_null_values = {}

        for item in get_columns(path):
            count = get_distinct_count(path, item)
            first_non_null_value = get_first_nonnull(path, item)

            first_non_null_values[item] = first_non_null_value
            distinct_counts[item] = count

            if count and count < 15:
                values = get_distinct_values(path, item)
                distinct_values[item] = values
            else:
                distinct_values[item] = None

        return {
            "size_bytes": table_size_bytes,
            "distinct_counts": json.dumps(distinct_counts),
            "distinct_values": json.dumps(distinct_values),
            "first_non_null_values": json.dumps(first_non_null_values),
        }


def get_datafile_init_metadata(path: str, project_id, was_import=True):
    with LogException():
        project = ProjectQuery.retrieve(project_id)
        file_size_bytes = os.path.getsize(path)
        file_name = get_path_last_item(path)
        distinct_counts = {}
        distinct_values = {}
        first_non_null_values = {}
        for item in get_columns(get_datafile_table_name(project.name, file_name)):
            count = get_distinct_count(
                get_datafile_table_name(project.name, file_name), item
            )
            distinct_counts[item] = count
            first_non_null_values[item] = get_first_nonnull(
                get_datafile_table_name(project.name, file_name), item
            )

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
            "first_non_null_values": json.dumps(first_non_null_values),
            "df_table_name": get_datafile_table_name(project.name, file_name),
            "columns": json.dumps(
                get_columns(get_datafile_table_name(project.name, file_name))
            ),
            "row_count": count_rows(project.name, file_name, []),
        }


def get_path_last_item(path: str):
    return os.path.basename(path)


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
                ret.append(
                    {
                        "file_path": file_path,
                        "uncompressed_size": os.path.getsize(file_path),
                    }
                )

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


def create_empty_table(project_name, file_path: str):
    with LogException():
        table_name = get_datafile_table_name(project_name, file_path)
        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = (
                f"CREATE TABLE IF NOT EXISTS '{table_name}' (id INTEGER PRIMARY KEY);"
            )
            cursor.execute(query)


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


def get_df_export(
    table_name: str,
    export_all: bool,
    data_start: int,
    data_limit: int,
    filters: List[str],
):
    with LogException():
        where_conditions = "WHERE " + " AND ".join(filters) if filters else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            if export_all:
                query = f'SELECT * FROM "{table_name}" {where_conditions};'
            else:
                query = f'SELECT * FROM "{table_name}" {where_conditions} LIMIT {data_limit} OFFSET {data_start};'

            df = pd.read_sql_query(query, conn)
            return df


def get_dataset_pagination(
    table_name: str, page: int, page_size: int, filters: List[str]
):
    with LogException():
        offset = (page - 1) * page_size

        where_conditions = "WHERE " + " AND ".join(filters) if len(filters) > 0 else ""

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            cursor = conn.cursor()
            query = f'SELECT * FROM "{table_name}" {where_conditions} LIMIT {page_size} OFFSET {offset};'
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
            get_datafile_init_metadata(file_path, project_id)
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
    project = ProjectQuery.retrieve(project_name, "name")

    if project is None:
        raise HTTPException(status_code=400, detail="Incorrect project name")

    datafiles = DatafileQuery.get_datafiles_by_project(project.id)

    if len(datafiles) < 2:
        return {"common_columns": None, "files_with_no_join": None}

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


def read_dataset_to_mem(dataset_name: str):
    with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
        query = f'SELECT * FROM "{dataset_name}"'
        df = pd.read_sql_query(query, conn)
        return df


def combine_two_datasets(
    base_df, secondary_df, base_join_col, secondary_join_col, join_prefix
):
    secondary_df = secondary_df.drop(
        secondary_df.columns.intersection(base_df.columns).difference(
            [secondary_join_col]
        ),
        axis=1,
    )

    merged_df = pd.merge(
        base_df,
        secondary_df,
        left_on=base_join_col,
        right_on=secondary_join_col,
        how="left",
    )

    return merged_df


async def merge_dataframes(
    base_df_table_name: str, list_of_df_table_names: List[str], join_prefix
):
    async def func_wrapper():
        logger = get_logger()
        logger.log(
            Messages.UPLOAD_FILES.format(
                FILES_DONE="0", FILES_MAX=len(list_of_df_table_names)
            ),
            logging.INFO,
            False,
            False,
        )

        base_df = read_dataset_to_mem(base_df_table_name)

        base_df_metadata = DatafileQuery.retrieve(base_df_table_name, "df_table_name")
        idx = 0

        for item in list_of_df_table_names:
            idx += 1
            df = read_dataset_to_mem(item)

            if base_df.shape[0] == 0:
                base_df = df
                join_df_metadata = DatafileQuery.retrieve(item, "df_table_name")
                DatafileQuery.update_join_column(
                    base_df_metadata.id, join_df_metadata.join_column
                )
                base_df_metadata = DatafileQuery.retrieve(
                    base_df_table_name, "df_table_name"
                )
                continue

            datafile = DatafileQuery.retrieve(item, "df_table_name")
            base_df = combine_two_datasets(
                base_df,
                df,
                base_df_metadata.join_column,
                datafile.join_column,
                join_prefix,
            )

            logger.log(
                Messages.UPLOAD_FILES.format(
                    FILES_DONE=idx, FILES_MAX=len(list_of_df_table_names)
                ),
                logging.INFO,
                False,
                False,
            )

        with sqlite3.connect(AppConstants.DB_DATASETS) as conn:
            base_df.to_sql(
                base_df_metadata.df_table_name,
                conn,
                if_exists="replace",
                index=False,
            )

        if base_df_metadata is None:
            return

        updated_df_metadata = get_datafile_metadata(base_df_metadata.df_table_name)
        DatafileQuery.update_row_metadata(base_df_metadata.id, updated_df_metadata)

        logger.log(
            Messages.FILE_UPLOAD_FINISH,
            logging.INFO,
            False,
            False,
        )

    if is_testing():
        await func_wrapper()
    else:
        executor = ThreadPoolExecutor()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(executor, lambda: asyncio.run(func_wrapper()))


def cleanup_temp_csvs():
    dir = append_app_data_path("")
    for file in os.listdir(dir):
        if file.endswith(".csv"):
            os.remove(os.path.join(dir, file))
