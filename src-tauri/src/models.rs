use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Terminal {
    pub id: String,
    pub name: String,
    pub path: String,
    pub command: String,
    pub status: ProcessStatus,
    pub created_at: String,
    pub last_run: Option<String>,
    pub running_time: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TerminalData {
    pub name: String,
    pub path: String,
    pub command: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ProcessStatus {
    Running,
    Stopped,
    Error,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub version: String,
    pub terminals: Vec<Terminal>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            version: "1.0.0".to_string(),
            terminals: Vec::new(),
        }
    }
}

