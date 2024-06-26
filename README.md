### Project name is currently a placeholder, and will be changed later

`_datascience-tool` is a tool for simplifying common computing tasks data scientists and ML engineers perform on datasets. These include tasks such as combining datasets, creating row-wise aggregations, visualizing & exploring data, and removing nulls. This is mostly dull-to-write and repetitive code that interfaces with pandas and matplotlib. This routine data manipulation and visualization code is repetitive and tedious to write, and `_datascience-tool` aims to automate these common data manipulation tasks.

So to summarize the project in one sentence: automation to routine data visualization, combining, aggeration, and column creation tasks using Pandas and Matplotlib, all managed through a sophisticated user interface.


### Setup

- Packaging Python runtime and projects Python files and dependencies to a binary using [pyoxidizer](https://github.com/indygreg/PyOxidizer)
- Embedding that Python binary into a [tauri](https://github.com/tauri-apps/tauri) desktop application
- Running the Python binary (FastAPI web server) from within Tauri's rust backend
- Now the frontend client (Chromium based) can call the Python server running locally without being dependent on or interfering with the system's Python.
- This allows for creating a GUI for the common data manipulation and visualization tasks done in the Python ecosystem while making the application easy-to-use and well-contained.

### Currently supported features (project is still being developed)

- Import & export datasets
- Quickly inspect the rows of very large datasets using pagination (tested to be quick on +20m rows)
- Fine-grained filtering options based on the column type (categorical, date, number etc.)
- Combine datasets, create row-wise aggregations, and other routine data manipulation
- Create new datasets based on the existing ones
- Cross platform (tested to work on Mac and Windows, Linux will come soon)
- Visualize data

<img width="1722" alt="image" src="https://github.com/JNeuvonen/_datascience-tool/assets/74303261/219e1370-c3bc-4887-8f90-9d62cb23fc7c">

### Dev requirements

- Python
- Rust
- Node (v18 or higher)

### Env vars

`DEV_PYTHON_PATH` Add this to `.env` within the `src-tauri` directory. This should point to the Python runtime that you want to use for development.

### Run locally

Before running the following steps, you should make sure that the Python runtime has the required dependencies. The full list of dependencies can be found at: `src-server/requirements.txt`.

- `git clone https://github.com/JNeuvonen/_datascience-tool`
- `cd _datascience-tool`
- `pip install -r src-server/requirements.txt`
- `python scripts/build.py`
- `npm install`
- `npm run tauri dev`

### Building for prod

There's an additional requirement of installing pyoxidizer for packaging the python runtime into a binary. 

- Run `python scripts/build.py`. This creates the python runtime binary that is used in production.
- Set `PROD_PYTHON__BUILD` env var within `src-tauri` to point to the `pyserver` executable that the previous step created, here's an example:
  `PROD_PYTHON_BUILD="/Users/Jarno/Documents/_datascience-tool/src-tauri/binaries/build/x86_64-pc-windows-msvc/debug/install/pyserver"`
- Run `npm run tauri build`
- Artifacts will be found from `src-tauri/target`






 
