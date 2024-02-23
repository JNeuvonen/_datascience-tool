### Project name is currently a placeholder, and will be changed later

`_datascience-tool` is a tool for simplifying common computing tasks data scientists and ML engineers perform on datasets. These include tasks such as combining datasets, creating row-wise aggregations, visualizing & exploring data, and removing nulls. This is mostly dull-to-write and repetitive code that interfaces with pandas and matplotlib. This routine data manipulation and visualization code is repetitive and tedious to write, and `_datascience-tool` aims to automate these common data manipulation tasks.


### Setup

- Packaging Python runtime and projects Python files and dependencies to a binary using [pyoxidizer](https://github.com/indygreg/PyOxidizer)
- Embedding that Python binary into a [tauri](https://github.com/tauri-apps/tauri) desktop application
- Running the Python binary (FastAPI web server) from within Tauri's rust backend
- Now the frontend client (Chromium based) can call the Python server running locally without being dependent on or interfering with the system's Python.
- This allows for creating a GUI for the common data manipulation and visualization tasks done in the Python ecosystem while making the application easy-to-use and well-contained.

### Currently supported features (project is still being developed)

- Import & export datasets
- Quickly inspect the rows of very large datasets using pagination (tested to be quick on +20m rows)
- Advanced filtering options based on the column type (categorical, date, number etc.)
- Combine datasets, create row-wise aggregations, and other routine data manipulation
- Create new datasets based on the existing ones
- Visualize data

<img width="1722" alt="image" src="https://github.com/JNeuvonen/_datascience-tool/assets/74303261/219e1370-c3bc-4887-8f90-9d62cb23fc7c">

### Dev requirements

- Python
- Rust
- Node (v18 or higher)

### Env vars

`DEV_PYTHON_PATH` Add this to `.env` within the `src-tauri` directory. This should point to the Python runtime that you want to use for development.


### Run locally

- `git clone https://github.com/JNeuvonen/_datascience-tool`
- `cd _datascience-tool`
- `npm install`
- `npm run tauri dev`



 
