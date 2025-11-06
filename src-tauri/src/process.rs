use std::collections::HashMap;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::Instant;
use std::io::{BufRead, BufReader};
use std::thread;

#[cfg(unix)]
use std::os::unix::process::CommandExt;

#[cfg(unix)]
extern crate libc;

pub struct ProcessHandle {
    pub child: Child,
    pub started_at: Instant,
    pub logs: Arc<Mutex<Vec<String>>>,
}

pub struct ProcessManager {
    processes: Mutex<HashMap<String, ProcessHandle>>,
}

impl ProcessManager {
    pub fn new() -> Self {
        Self {
            processes: Mutex::new(HashMap::new()),
        }
    }

    pub fn spawn(&self, id: String, path: &str, command: &str) -> Result<u32, String> {
        let mut processes = self.processes.lock().unwrap();

        if processes.contains_key(&id) {
            return Err("Process already running".to_string());
        }

        if command.trim().is_empty() {
            return Err("Invalid command".to_string());
        }

        // Executar através de shell para ter acesso ao PATH completo
        #[cfg(unix)]
        let mut cmd = {
            // Adicionar caminhos comuns ao PATH
            let home = std::env::var("HOME").unwrap_or_else(|_| "/Users/ica".to_string());
            let extra_paths = vec![
                // Gerenciadores de versão (devem vir primeiro!)
                format!("{}/.rbenv/shims", home),       // rbenv (Ruby)
                format!("{}/.rvm/bin", home),           // rvm (Ruby)
                format!("{}/.asdf/shims", home),        // asdf (multi-language)
                format!("{}/.nodenv/shims", home),      // nodenv (Node)
                format!("{}/.pyenv/shims", home),       // pyenv (Python)

                // Ferramentas específicas
                format!("{}/.bun/bin", home),           // Bun
                format!("{}/.cargo/bin", home),         // Rust
                format!("{}/.local/bin", home),         // Python, etc
                format!("{}/Library/pnpm", home),       // pnpm global
                format!("{}/.deno/bin", home),          // Deno

                // Homebrew
                "/opt/homebrew/bin".to_string(),        // Homebrew Apple Silicon (primeiro)
                "/usr/local/bin".to_string(),           // Homebrew Intel
            ];

            let current_path = std::env::var("PATH").unwrap_or_default();
            let new_path = format!("{}:{}", extra_paths.join(":"), current_path);

            // Criar comando com PATH expandido
            let full_command = format!("export PATH=\"{}\"; {}", new_path, command);

            let mut c = Command::new("/bin/zsh");
            c.arg("-l"); // Login shell para carregar .zshrc
            c.arg("-c");
            c.arg(&full_command);
            c
        };

        #[cfg(windows)]
        let mut cmd = {
            let mut c = Command::new("cmd");
            c.arg("/C");
            c.arg(command);
            c
        };

        cmd.current_dir(path)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        #[cfg(unix)]
        unsafe {
            cmd.pre_exec(|| {
                libc::setpgid(0, 0);
                Ok(())
            });
        }

        let mut child = cmd.spawn()
            .map_err(|e| format!("Failed to spawn process: {}", e))?;

        let pid = child.id();

        let logs = Arc::new(Mutex::new(Vec::new()));

        if let Some(stdout) = child.stdout.take() {
            let logs_clone = Arc::clone(&logs);
            thread::spawn(move || {
                let reader = BufReader::new(stdout);
                for line in reader.lines() {
                    if let Ok(line) = line {
                        let mut logs = logs_clone.lock().unwrap();
                        logs.push(format!("[OUT] {}", line));
                        if logs.len() > 1000 {
                            logs.remove(0);
                        }
                    }
                }
            });
        }

        if let Some(stderr) = child.stderr.take() {
            let logs_clone = Arc::clone(&logs);
            thread::spawn(move || {
                let reader = BufReader::new(stderr);
                for line in reader.lines() {
                    if let Ok(line) = line {
                        let mut logs = logs_clone.lock().unwrap();
                        logs.push(format!("[ERR] {}", line));
                        if logs.len() > 1000 {
                            logs.remove(0);
                        }
                    }
                }
            });
        }

        let handle = ProcessHandle {
            child,
            started_at: Instant::now(),
            logs,
        };

        processes.insert(id, handle);

        Ok(pid)
    }

    pub fn kill(&self, id: &str) -> Result<(), String> {
        let mut processes = self.processes.lock().unwrap();

        if let Some(mut handle) = processes.remove(id) {
            let pid = handle.child.id();

            #[cfg(unix)]
            {
                unsafe {
                    let pgid = libc::getpgid(pid as i32);
                    if pgid > 0 {
                        let _ = libc::kill(-pgid, libc::SIGINT);
                        thread::sleep(std::time::Duration::from_millis(300));

                        let _ = libc::kill(-pgid, libc::SIGTERM);
                        thread::sleep(std::time::Duration::from_millis(300));

                        let _ = libc::kill(-pgid, libc::SIGKILL);
                    }
                }
            }

            #[cfg(not(unix))]
            {
                let _ = handle.child.kill();
            }

            let _ = handle.child.wait();

            Ok(())
        } else {
            Ok(())
        }
    }

    pub fn is_running(&self, id: &str) -> bool {
        let processes = self.processes.lock().unwrap();
        processes.contains_key(id)
    }

    pub fn get_running_time(&self, id: &str) -> Option<u64> {
        let processes = self.processes.lock().unwrap();
        processes.get(id).map(|handle| handle.started_at.elapsed().as_secs())
    }

    pub fn get_logs(&self, id: &str) -> Result<Vec<String>, String> {
        let processes = self.processes.lock().unwrap();

        if let Some(handle) = processes.get(id) {
            let logs = handle.logs.lock().unwrap();
            Ok(logs.clone())
        } else {
            Err("Process not found".to_string())
        }
    }
}

impl Default for ProcessManager {
    fn default() -> Self {
        Self::new()
    }
}

