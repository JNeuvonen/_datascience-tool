import sys
from tests.constants import SERVER_SOURCE_DIR


sys.path.append(SERVER_SOURCE_DIR)
import server as main_helper
from orm import create_tables as ct, drop_tables as dt, db_delete_all_data as ddad
from route_project import RoutePaths as ProjectRoutes
from constants import APP_DB as APP_DB_HELPER, DATASET_DB_PATH as DATASET_DB_PATH_HELPER
from config import append_app_data_path as aadp
from utils import get_path_last_item as gpli
from query_datafile import DatafileQuery as DatafileQueryHelper
from query_project import ProjectQuery as ProjectQueryHelper

APP_DB = APP_DB_HELPER
DATASET_DB_PATH = DATASET_DB_PATH_HELPER
SERVER = main_helper

DatafileQuery = DatafileQueryHelper
ProjectQuery = ProjectQueryHelper


def append_app_data_path(path: str):
    return aadp(path)


def db_delete_all_data():
    ddad()


def get_path_last_item(path: str):
    return gpli(path)


def project_routes():
    return ProjectRoutes


def create_tables():
    ct()


def drop_tables():
    dt()
