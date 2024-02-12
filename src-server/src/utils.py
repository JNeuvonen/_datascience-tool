import threading
from contextlib import contextmanager
from typing import List
import zipfile
import os
import shutil
from constants import DateFilterTypes, NumericalFilterTypes, TextFilterTypes

from decorators import LogException


def get_datafile_metadata(path: str, project_id, was_import=True):
    with LogException():
        file_size_bytes = os.path.getsize(path)
        file_name = get_path_last_item(path)
        return {
            "size_bytes": file_size_bytes,
            "file_name": file_name,
            "project_id": project_id,
            "was_import": was_import,
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
    ret = []
    for file_path in file_paths:
        if file_path.endswith(".zip"):
            try:
                with zipfile.ZipFile(file_path, "r") as zip_ref:
                    total_size = sum(
                        file_info.file_size for file_info in zip_ref.infolist()
                    )
                ret.append({"file_path": file_path, "uncompressed_size": total_size})
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
    filter_type = filters.get("filterType")

    if filter_type == "number":
        return ag_grid_numerical_to_sql(column, filters)

    if filter_type == "text":
        return ag_grid_text_to_sql(column, filters)

    if filter_type == "date":
        print(ag_grid_date_to_sql(column, filters))
        return ag_grid_date_to_sql(column, filters)

    return None
