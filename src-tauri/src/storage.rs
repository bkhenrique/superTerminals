use crate::models::{Config, Terminal};
use std::fs;
use std::path::PathBuf;

pub fn get_storage_path() -> Result<PathBuf, String> {
    let home = dirs::home_dir().ok_or("Failed to get home directory")?;
    let config_dir = home.join(".superterminals");
    
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }
    
    Ok(config_dir.join("terminals.json"))
}

pub fn load_terminals() -> Result<Vec<Terminal>, String> {
    let path = get_storage_path()?;
    
    if !path.exists() {
        return Ok(Vec::new());
    }
    
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read config file: {}", e))?;
    
    let config: Config = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse config file: {}", e))?;
    
    Ok(config.terminals)
}

pub fn save_terminals(terminals: &Vec<Terminal>) -> Result<(), String> {
    let path = get_storage_path()?;
    
    let config = Config {
        version: "1.0.0".to_string(),
        terminals: terminals.clone(),
    };
    
    let content = serde_json::to_string_pretty(&config)
        .map_err(|e| format!("Failed to serialize config: {}", e))?;
    
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write config file: {}", e))?;
    
    Ok(())
}

