import os

APP_DATA_PATH = os.getenv("APP_DATA_PATH", "")
ENV = os.getenv("ENV", "")
IS_TESTING = os.getenv("IS_TESTING", "")
IS_DEBUG = os.getenv("IS_DEBUG", "")


def is_prod():
    return ENV == "PROD"


def is_dev():
    return ENV == "DEV"


def is_debug():
    return IS_DEBUG == "DEBUG"


def is_testing():
    return IS_TESTING == "1"


def append_app_data_path(appended_path):
    return os.path.join(APP_DATA_PATH, appended_path)
