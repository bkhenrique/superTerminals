use crate::models::{ProcessStatus, Terminal, TerminalData};
use crate::process::ProcessManager;
use crate::storage;
use chrono::Utc;
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

pub struct AppState {
    pub process_manager: ProcessManager,
    pub terminals: Mutex<Vec<Terminal>>,
}

#[tauri::command]
pub async fn get_terminals(state: State<'_, AppState>) -> Result<Vec<Terminal>, String> {
    let mut terminals = state.terminals.lock().unwrap();

    let mut changed = false;
    for terminal in terminals.iter_mut() {
        if terminal.status == ProcessStatus::Running {
            if !state.process_manager.is_running(&terminal.id) {
                terminal.status = ProcessStatus::Stopped;
                changed = true;
            }
        }
    }

    if changed {
        let _ = storage::save_terminals(&terminals);
    }

    Ok(terminals.clone())
}

#[tauri::command]
pub async fn add_terminal(
    data: TerminalData,
    state: State<'_, AppState>,
) -> Result<Terminal, String> {
    let mut terminals = state.terminals.lock().unwrap();

    if !std::path::Path::new(&data.path).exists() {
        return Err("Invalid path: directory does not exist".to_string());
    }

    if data.command.trim().is_empty() {
        return Err("Invalid command: command cannot be empty".to_string());
    }

    if terminals.iter().any(|t| t.name == data.name) {
        return Err("Duplicate name: terminal with this name already exists".to_string());
    }

    let terminal = Terminal {
        id: Uuid::new_v4().to_string(),
        name: data.name,
        path: data.path,
        command: data.command,
        status: ProcessStatus::Stopped,
        created_at: Utc::now().to_rfc3339(),
        last_run: None,
        running_time: 0,
    };

    terminals.push(terminal.clone());
    storage::save_terminals(&terminals)?;

    Ok(terminal)
}

#[tauri::command]
pub async fn update_terminal(
    id: String,
    data: TerminalData,
    state: State<'_, AppState>,
) -> Result<Terminal, String> {
    let mut terminals = state.terminals.lock().unwrap();

    let terminal = terminals
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Terminal not found")?;

    if state.process_manager.is_running(&id) {
        return Err("Cannot update running terminal".to_string());
    }

    if !std::path::Path::new(&data.path).exists() {
        return Err("Invalid path: directory does not exist".to_string());
    }

    terminal.name = data.name;
    terminal.path = data.path;
    terminal.command = data.command;

    let updated_terminal = terminal.clone();

    storage::save_terminals(&terminals)?;

    Ok(updated_terminal)
}

#[tauri::command]
pub async fn delete_terminal(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut terminals = state.terminals.lock().unwrap();

    let index = terminals
        .iter()
        .position(|t| t.id == id)
        .ok_or("Terminal not found")?;

    if state.process_manager.is_running(&id) {
        let _ = state.process_manager.kill(&id);
    }

    terminals.remove(index);
    storage::save_terminals(&terminals)?;

    Ok(())
}

#[tauri::command]
pub async fn start_process(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut terminals = state.terminals.lock().unwrap();

    let terminal = terminals
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Terminal not found")?;

    if state.process_manager.is_running(&id) {
        return Err("Process already running".to_string());
    }

    state
        .process_manager
        .spawn(id.clone(), &terminal.path, &terminal.command)?;

    terminal.status = ProcessStatus::Running;
    terminal.last_run = Some(Utc::now().to_rfc3339());

    storage::save_terminals(&terminals)?;

    Ok(())
}

#[tauri::command]
pub async fn stop_process(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let mut terminals = state.terminals.lock().unwrap();

    let terminal = terminals
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or("Terminal not found")?;

    if state.process_manager.is_running(&id) {
        let _ = state.process_manager.kill(&id);
    }

    terminal.status = ProcessStatus::Stopped;
    if let Some(running_time) = state.process_manager.get_running_time(&id) {
        terminal.running_time = running_time;
    }

    storage::save_terminals(&terminals)?;

    Ok(())
}

#[tauri::command]
pub async fn get_process_status(id: String, state: State<'_, AppState>) -> Result<String, String> {
    let terminals = state.terminals.lock().unwrap();

    terminals
        .iter()
        .find(|t| t.id == id)
        .ok_or("Terminal not found")?;

    let is_running = state.process_manager.is_running(&id);
    let status = if is_running {
        "running"
    } else {
        "stopped"
    };

    Ok(status.to_string())
}

#[tauri::command]
pub async fn get_logs(id: String, state: State<'_, AppState>) -> Result<Vec<String>, String> {
    state.process_manager.get_logs(&id)
}
