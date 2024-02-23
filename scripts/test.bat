@echo off
set APP_DATA_PATH=tests
set ENV=PROD
set TEST_SPEED=FAST
set IS_TESTING=1
set DEV_PYTHON_PATH="C:\\Users\\Jarno\\AppData\\Local\\Programs\\Python\\Python311\\python.exe"

pytest tests -m acceptance
