from config import append_app_data_path


LOG_FILE = "logs"
APP_DB = "app.db"
DATASET_DB_PATH = "dataset.db"
TEMP_EXTRACTED_FILES = "temp_extracted_files"


class Messages:
    UPLOAD_FILES = "MESSAGE_UPLOAD_FILES:{FILES_DONE}/{FILES_MAX}"
    FILE_UPLOAD_FINISH = "MESSAGE_FILE_UPLOAD_FINISH"


class DomEventChannels:
    REFETCH_COMPONENT = "refetch_component"
    UPLOAD_FILE = "upload_file"


class AppConstants:
    DB_DATASETS = append_app_data_path(DATASET_DB_PATH)


SIZE_1KB = 1024
SIZE_1GB = SIZE_1KB * SIZE_1KB * SIZE_1KB


class NumericalFilterTypes:
    EQUALS = "equals"
    DOES_NOT_EQUAL = "notEqual"
    GREATER_THAN = "greaterThan"
    GREATER_THAN_OR_EQUAL_TO = "greaterThanOrEqual"
    LESS_THAN = "lessThan"
    LESS_THAN_OR_EQUAL_TO = "lessThanOrEqual"
    BETWEEN = "inRange"
    BLANK = "blank"
    NOT_BLANK = "notBlank"


class TextFilterTypes:
    CONTAINS = "contains"
    DOES_NOT_CONTAIN = "notContains"
    EQUALS = "equals"
    DOES_NOT_EQUAL = "notEqual"
    BEGINS_WITH = "startsWith"
    ENDS_WITH = "endsWith"
    BLANK = "blank"
    NOT_BLANK = "notBlank"


class DateFilterTypes:
    EQUALS = "equals"
    DOES_NOT_EQUAL = "notEqual"
    BEFORE = "lessThan"
    AFTER = "greaterThan"
    BETWEEN = "inRange"
    BLANK = "blank"
    NOT_BLANK = "not_blank"
