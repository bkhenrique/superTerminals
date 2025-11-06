import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Terminal, TerminalData } from '../types/terminal';

export const useTerminals = () => {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTerminals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await invoke<Terminal[]>('get_terminals');
      setTerminals(data);
    } catch (err) {
      setError(err as string);
      console.error('Erro ao carregar terminais:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTerminal = async (data: TerminalData): Promise<void> => {
    try {
      const newTerminal = await invoke<Terminal>('add_terminal', { data });
      setTerminals((prev) => [...prev, newTerminal]);
    } catch (err) {
      throw err;
    }
  };

  const updateTerminal = async (id: string, data: TerminalData): Promise<void> => {
    try {
      const updatedTerminal = await invoke<Terminal>('update_terminal', { id, data });
      setTerminals((prev) =>
        prev.map((t) => (t.id === id ? updatedTerminal : t))
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteTerminal = async (id: string): Promise<void> => {
    try {
      await invoke('delete_terminal', { id });
      setTerminals((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const startProcess = async (id: string): Promise<void> => {
    try {
      await invoke('start_process', { id });
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: 'running' as const } : t
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const stopProcess = async (id: string): Promise<void> => {
    try {
      await invoke('stop_process', { id });
      setTerminals((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: 'stopped' as const } : t
        )
      );
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadTerminals();
  }, []);

  return {
    terminals,
    isLoading,
    error,
    addTerminal,
    updateTerminal,
    deleteTerminal,
    startProcess,
    stopProcess,
    reload: loadTerminals,
  };
};

