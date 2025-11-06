mod commands;
mod models;
mod process;
mod storage;

use commands::AppState;
use process::ProcessManager;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let terminals = storage::load_terminals().unwrap_or_default();

    let app_state = AppState {
        process_manager: ProcessManager::new(),
        terminals: Mutex::new(terminals),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            commands::get_terminals,
            commands::add_terminal,
            commands::update_terminal,
            commands::delete_terminal,
            commands::start_process,
            commands::stop_process,
            commands::get_process_status,
            commands::get_logs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
