import { Terminal } from '../types/terminal';
import { TerminalCard } from './TerminalCard';

interface TerminalListProps {
  terminals: Terminal[];
  onStart: (id: string) => Promise<void>;
  onStop: (id: string) => Promise<void>;
  onEdit: (terminal: Terminal) => void;
  onDelete: (id: string) => Promise<void>;
  onViewLogs: (terminal: Terminal) => void;
  viewMode?: 'grid' | 'list';
}

export const TerminalList: React.FC<TerminalListProps> = ({
  terminals,
  onStart,
  onStop,
  onEdit,
  onDelete,
  onViewLogs,
  viewMode = 'grid',
}) => {
  if (terminals.length === 0) {
    return (
      <div className="text-center py-20">

        <p className="text-xl text-gray-400 mb-2">Nenhum terminal configurado</p>
        <p className="text-gray-500">Clique em "+ Novo Terminal" para começar</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {terminals.map((terminal) => (
          <div
            key={terminal.id}
            className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all flex items-center gap-6"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${terminal.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`} />
                <div>
                  <h3 className="font-bold text-lg text-white">{terminal.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{terminal.status === 'running' ? 'Rodando' : 'Parado'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span className="text-gray-300 font-mono text-xs truncate max-w-[200px]">{terminal.path}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300 font-mono text-xs truncate max-w-[200px]">{terminal.command}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-300 font-mono text-xs">
                  {Math.floor(terminal.running_time / 3600).toString().padStart(2, '0')}:
                  {Math.floor((terminal.running_time % 3600) / 60).toString().padStart(2, '0')}:
                  {(terminal.running_time % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onViewLogs(terminal)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all"
                title="Ver Logs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {terminal.status === 'stopped' ? (
                <button
                  onClick={() => onStart(terminal.id)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-all"
                  title="Iniciar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => onStop(terminal.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg transition-all"
                  title="Parar"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                </button>
              )}

              <button
                onClick={() => onEdit(terminal)}
                disabled={terminal.status === 'running'}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-all"
                title="Editar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button
                onClick={() => onDelete(terminal.id)}
                className="bg-gray-700 hover:bg-red-600 text-white p-2.5 rounded-lg transition-all"
                title="Deletar"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {terminals.map((terminal) => (
        <TerminalCard
          key={terminal.id}
          terminal={terminal}
          onStart={onStart}
          onStop={onStop}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewLogs={onViewLogs}
        />
      ))}
    </div>
  );
};

