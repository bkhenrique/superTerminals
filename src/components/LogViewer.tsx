import { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface LogViewerProps {
  terminalId: string;
  terminalName: string;
  onClose: () => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({ terminalId, terminalName, onClose }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const result = await invoke<string[]>('get_logs', { id: terminalId });
      setLogs(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      setLogs([`Erro ao buscar logs: ${error}`]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 1000);
    return () => clearInterval(interval);
  }, [terminalId]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleScroll = () => {
    if (!logsContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isAtBottom);
  };

  const scrollToBottom = () => {
    setAutoScroll(true);
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-2xl w-full max-w-6xl h-[80vh] flex flex-col border border-gray-700/50 shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
              <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Logs: {terminalName}
            </h2>
            <p className="text-gray-400 text-sm">
              {logs.length} {logs.length === 1 ? 'linha' : 'linhas'} • Atualização automática
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToBottom}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                autoScroll 
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              {autoScroll ? 'Auto-scroll ON' : 'Ir para o fim'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 p-2 rounded-lg transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logs Content */}
        <div 
          ref={logsContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 bg-gray-950 font-mono text-sm"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-400">Carregando logs...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 text-lg">Nenhum log disponível</p>
                <p className="text-gray-500 text-sm mt-2">Inicie o processo para ver os logs</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => {
                const isError = log.startsWith('[ERR]');
                const isOutput = log.startsWith('[OUT]');
                
                return (
                  <div
                    key={index}
                    className={`py-1 px-3 rounded ${
                      isError 
                        ? 'bg-red-900/20 text-red-300 border-l-2 border-red-500' 
                        : isOutput
                        ? 'text-green-300'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className="text-gray-500 select-none mr-3">{index + 1}</span>
                    {log}
                  </div>
                );
              })}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50 bg-gray-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Atualização em tempo real
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded border border-green-500/30">[OUT]</span>
            <span>Saída padrão</span>
            <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded border border-red-500/30 ml-4">[ERR]</span>
            <span>Erros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

