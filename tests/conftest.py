import multiprocessing
import pytest
import time

from tests.utils import create_tables, del_db_files, init_server, kill_process_on_port


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
