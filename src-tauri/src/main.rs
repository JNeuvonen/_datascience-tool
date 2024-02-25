use std::{
    fs,
    path::Path,
    process::{Command, Stdio},
};

#[tauri::command]
fn fetch_env(key: String) -> Option<String> {
    std::env::var(key).ok()
}

#[tauri::command]
fn fetch_platform() -> String {
    if cfg!(target_os = "windows") {
        "windows".to_string()
    } else if cfg!(target_os = "macos") {
        "macos".to_string()
    } else if cfg!(target_os = "linux") {
        "linux".to_string()
    } else {
        "unknown".to_string()
    }
}

fn main() {
    dotenv::dotenv().ok();

    tauri::Builder::default()
        .setup(|app| {
            let app_data_path = app
                .path_resolver()
                .app_data_dir()
                .expect("Failed to find app data directory")
                .to_str()
                .expect("Failed to convert app data path to string")
                .to_string();

            if !Path::new(&app_data_path).exists() {
                // Initialize app data dir in production
                fs::create_dir_all(&app_data_path).expect("Failed to create app data directory");
            }

            let current_os = fetch_platform();

            if cfg!(debug_assertions) {
                let python_path =
                    std::env::var("DEV_PYTHON_PATH").unwrap_or_else(|_| "python".to_string());
                Command::new(python_path)
                    .current_dir("../src-server/src")
                    .arg("-m")
                    .arg("uvicorn")
                    .arg("server:app")
                    .arg("--reload")
                    .env("APP_DATA_PATH", &app_data_path)
                    .env("ENV", "DEV")
                    .env("OS", current_os)
                    .spawn()
                    .expect("Failed to start FastAPI server")
            } else {
                // let py_build_path = fetch_env("PROD_PYTHON_BUILD".to_string()).unwrap();

                let binary_path = app
                    .path_resolver()
                    .resource_dir()
                    .unwrap()
                    .join("binaries/build/aarch64-apple-darwin/debug/install/pyserver")
                    .to_str()
                    .unwrap()
                    .to_string();

                Command::new(binary_path)
                    .stdout(Stdio::piped())
                    .env("APP_DATA_PATH", &app_data_path)
                    .env("ENV", "PROD")
                    .env("OS", current_os)
                    .spawn()
                    .expect("Failed to start FastAPI server")
            };
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![fetch_env, fetch_platform])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
