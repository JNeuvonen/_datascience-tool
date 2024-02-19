# Project name is currently a placeholder, and will be changed later

`_datascience-tool` is a tool for simplifying common computing tasks data scientists and ML engineers perform on datasets. These include tasks such as combining datasets, creating row-wise aggregations, visualizing data, and removing nulls. This is mostly dull-to-write and repetitive code that interfaces with pandas and matplotlib. This routine data manipulation and visualization code is repetitive and tedious to write, and `_datascience-tool` aims to automate these common data manipulation tasks.


# Setup

- Packaging Python runtime and projects Python files ([pyserver](https://github.com/JNeuvonen/backtest-engine/tree/master/pyserver)) and dependencies to a binary using [pyoxidizer](https://github.com/indygreg/PyOxidizer)
- Embedding that Python binary into a [tauri](https://github.com/tauri-apps/tauri) desktop application
- Running the Python binary (FastAPI web server) from within Tauri's rust backend ([main.rs](https://github.com/JNeuvonen/backtest-engine/blob/master/src-tauri/src/main.rs#L64-L69)).
- Now the [frontend](https://github.com/JNeuvonen/backtest-engine/tree/master/client) (Chromium powered) can call the Python server running locally without being dependent on or interfering with the system's Python.
