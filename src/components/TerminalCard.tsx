import { useState, useEffect } from 'react';
import { Terminal } from '../types/terminal';
import { StatusIndicator } from './StatusIndicator';

interface TerminalCardProps {
  terminal: Terminal;
  onStart: (id: string) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onEdit: (terminal: Terminal) => void;
  onDelete: (id: string) => Promise<void>;
  onViewLogs: (terminal: Terminal) => void;
}

export const TerminalCard: React.FC<TerminalCardProps> = ({
  terminal,
  onStart,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [runningTime, setRunningTime] = useState(terminal.running_time);

  useEffect(() => {
    let interval: number | undefined;

    if (terminal.status === 'running') {
      interval = setInterval(() => {
        setRunningTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [terminal.status]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await onStart(terminal.id);
      setRunningTime(0);
    } catch (error) {
      console.error('Erro ao iniciar processo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      await onStop(terminal.id);
    } catch (error) {
      console.error('Erro ao parar processo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    const message = terminal.status === 'running'
      ? `"${terminal.name}" está rodando. Deseja parar e deletar?`
      : `Tem certeza que deseja deletar "${terminal.name}"?`;

    if (window.confirm(message)) {
      setIsLoading(true);
      try {
        if (terminal.status === 'running') {
          await onStop(terminal.id);
        }
        await onDelete(terminal.id);
      } catch (error) {
        console.error('Erro ao deletar terminal:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{terminal.name}</h3>
          <StatusIndicator status={terminal.status} />
        </div>

        <div className="flex gap-2">
          {terminal.status === 'running' ? (
            <button
              onClick={handleStop}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="6" y="4" width="8" height="12" />
              </svg>
              Stop
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="text-gray-300 font-mono text-xs truncate">{terminal.path}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-300 font-mono text-xs">{terminal.command}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-gray-300 font-mono text-xs">
            Tempo: {formatTime(runningTime)}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-700">
        <button
          onClick={() => onViewLogs(terminal)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Logs
        </button>
        <button
          onClick={() => onEdit(terminal)}
          disabled={terminal.status === 'running' || isLoading}
          className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 bg-gray-700 hover:bg-red-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Deletar
        </button>
      </div>
    </div>
  );
};

