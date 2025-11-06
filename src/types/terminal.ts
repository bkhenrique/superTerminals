export interface Terminal {
  id: string;
  name: string;
  path: string;
  command: string;
  status: ProcessStatus;
  created_at: string;
  last_run: string | null;
  running_time: number;
}

export interface TerminalData {
  name: string;
  path: string;
  command: string;
}

export type ProcessStatus = 'running' | 'stopped' | 'error';

export interface ProcessInfo {
  status: ProcessStatus;
  pid?: number;
  runningTime: number;
  startedAt?: string;
}

export interface Config {
  version: string;
  storagePath: string;
  theme: 'light' | 'dark';
  autoSave: boolean;
}

