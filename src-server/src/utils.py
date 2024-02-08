import os

from decorators import LogException


def get_datafile_metadata(path: str, project_id: int):
    with LogException():
        file_size_bytes = os.path.getsize(path)
        file_name = get_path_last_item(path)
        return {
            "size_bytes": file_size_bytes,
            "file_name": file_name,
            "project_id": project_id,
        }


def get_path_last_item(path: str):
    if "/" not in path:
        return path

    parts = path.split("/")

    return parts[len(parts) - 1]
