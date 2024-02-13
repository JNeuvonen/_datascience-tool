import multiprocessing
import pytest
import time
from tests.import_helper import create_tables, db_delete_all_data

from tests.utils import (
    del_db_files,
    init_server,
    kill_process_on_port,
)


@pytest.fixture
def cleanup_db():
    db_delete_all_data()
    yield
    db_delete_all_data()


@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    del_db_files()
    create_tables()
    kill_process_on_port(8000)
    process = multiprocessing.Process(target=init_server)
    process.start()
    time.sleep(3)
    yield
    process.terminate()
    process.join()
    del_db_files()


pytest_plugins = [
    "tests.fixtures.project",
]
