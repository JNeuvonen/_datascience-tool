import threading
from contextlib import contextmanager
from typing import List
import zipfile
import os
import shutil

from decorators import LogException


def get_datafile_metadata(path: str, project_id):
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
