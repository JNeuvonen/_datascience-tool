import platform
import sys
import os
import subprocess

from tests.constants import SERVER_SOURCE_DIR, Constants


sys.path.append(SERVER_SOURCE_DIR)
import main
from orm import create_tables as ct, drop_tables as dt


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


def del_db_files():
    pass


def init_server():
    os.environ["APP_DATA_PATH"] = Constants.TESTS_FOLDER
    main.run()


def create_tables():
    ct()


def drop_tables():
    dt()
