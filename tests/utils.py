from contextlib import contextmanager
import platform
import os
from typing import Dict
import requests
import subprocess

from tests.constants import Constants
from tests.import_helper import (
    APP_DB,
    DATASET_DB_PATH,
    SERVER,
    append_app_data_path,
    project_routes,
)


def kill_process_on_port(port):
    try:
        if platform.system() == "Windows":
            command = f"netstat -ano | findstr :{port}"
            lines = subprocess.check_output(command, shell=True).decode().splitlines()
            for line in lines:
                pid = line.strip().split()[-1]
                subprocess.call(f"taskkill /F /PID {pid}", shell=True)
        elif platform.system() == "Darwin":
            command = f"lsof -i tcp:{port} | grep LISTEN"
            lines = subprocess.check_output(command, shell=True).decode().splitlines()
            for line in lines:
                pid = line.split()[1]
                os.kill(int(pid), 9)
        else:
            command = f"fuser -k {port}/tcp"
            subprocess.call(command, shell=True)
    except Exception:
        pass


def rm_file(path):
    if os.path.isfile(path):
        os.remove(path)


def del_db_files():
    rm_file(append_app_data_path(APP_DB))
    rm_file(append_app_data_path(DATASET_DB_PATH))
    pass


def init_server():
    os.environ["APP_DATA_PATH"] = Constants.TESTS_FOLDER
    SERVER.run()


def get_abs_path(relative_path):
    return os.path.abspath(relative_path)


@contextmanager
def Req(method, url, **kwargs):
    with requests.request(method, url, **kwargs) as response:
        response.raise_for_status()
        yield response


class URL:
    BASE_URL = "http://localhost:8001"

    @classmethod
    def route_project(cls):
        return cls.BASE_URL + "/project"

    @classmethod
    def route_datafile(cls):
        return cls.BASE_URL + "/datafile"

    @classmethod
    def create_project(cls):
        return cls.route_project() + project_routes().ROOT

    @classmethod
    def upload_datasets(cls, project_name):
        return cls.route_project() + project_routes().DATASETS.format(
            project_name=project_name
        )

    @classmethod
    def get_project(cls, project_name: str):
        return cls.route_project() + project_routes().PROJECT.format(
            project_name=project_name
        )

    @classmethod
    def get_project_file(cls, project_name: str, file_name: str):
        return cls.route_project() + project_routes().FILE_BY_NAME.format(
            project_name=project_name, file_name=file_name
        )

    @classmethod
    def organize(cls, project_name: str):
        return cls.route_project() + project_routes().ORGANIZE.format(
            project_name=project_name
        )

    @classmethod
    def set_join_col(cls, project_name: str, join_col: str):
        return (
            cls.route_project()
            + project_routes().JOIN_COL.format(project_name=project_name)
            + f"?join_col={join_col}"
        )

    @classmethod
    def put_datafile(cls):
        return cls.route_datafile()

    @classmethod
    def get_datafile(cls, id: int):
        return cls.route_datafile() + f"/{id}"

    @classmethod
    def post_datafile(cls):
        return cls.route_datafile()


class RestAPI:
    @staticmethod
    def create_project(body):
        with Req("post", URL.create_project(), json=body) as res:
            return res.json()

    @staticmethod
    def upload_datasets(project_name, body):
        with Req("post", URL.upload_datasets(project_name), json=body) as res:
            return res

    @staticmethod
    def get_project(project_name: str):
        with Req("get", URL.get_project(project_name)) as res:
            return res.json()["data"]

    @staticmethod
    def get_project_file(project_name: str, file_name: str):
        with Req("get", URL.get_project_file(project_name, file_name)) as res:
            return res.json()["data"]

    @staticmethod
    def organize(project_name: str):
        with Req("get", URL.organize(project_name)) as res:
            return res.json()["data"]

    @staticmethod
    def set_join_col(project_name: str, join_col: str):
        with Req("put", URL.set_join_col(project_name, join_col)) as res:
            return res

    @staticmethod
    def put_datafile(datafile):
        with Req("put", URL.put_datafile(), json=datafile) as res:
            return res

    @staticmethod
    def get_datafile(id: int):
        with Req("get", URL.get_datafile(id)) as res:
            return res.json()["data"]

    @staticmethod
    def create_empty_datafile(body: Dict):
        with Req("post", URL.post_datafile(), json=body) as res:
            return res
