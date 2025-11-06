import { useState } from 'react';
import { Terminal, TerminalData } from './types/terminal';
import { useTerminals } from './hooks/useTerminals';
import { TerminalList } from './components/TerminalList';
import { TerminalForm } from './components/TerminalForm';
import { LogViewer } from './components/LogViewer';

function App() {
  const {
    terminals,
    isLoading,
    error,
    addTerminal,
    updateTerminal,
    deleteTerminal,
    startProcess,
    stopProcess,
  } = useTerminals();

  const [showForm, setShowForm] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<Terminal | null>(null);
  const [viewingLogs, setViewingLogs] = useState<Terminal | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleAddClick = () => {
    setEditingTerminal(null);
    setShowForm(true);
  };

  const handleEditClick = (terminal: Terminal) => {
    setEditingTerminal(terminal);
    setShowForm(true);
  };

  const handleViewLogs = (terminal: Terminal) => {
    setViewingLogs(terminal);
  };

  const handleFormSubmit = async (data: TerminalData) => {
    if (editingTerminal) {
      await updateTerminal(editingTerminal.id, data);
    } else {
      await addTerminal(data);
    }
    setShowForm(false);
    setEditingTerminal(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTerminal(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 text-xl mb-2">Erro ao carregar terminais</p>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                SuperTerminals
              </h1>
              <p className="text-gray-400 text-lg">
                {terminals.length} {terminals.length === 1 ? 'terminal configurado' : 'terminais configurados'}
              </p>
            </div>
            <button
              onClick={handleAddClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-blue-500/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Terminal
            </button>
          </div>

          <div className="flex items-center gap-2 bg-gray-800/50 p-1.5 rounded-xl w-fit border border-gray-700/50">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'grid'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'list'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Lista
            </button>
          </div>
        </header>

        <main>
          <TerminalList
            terminals={terminals}
            onStart={startProcess}
            onStop={stopProcess}
            onEdit={handleEditClick}
            onDelete={deleteTerminal}
            onViewLogs={handleViewLogs}
            viewMode={viewMode}
          />
        </main>
      </div>

      {showForm && (
        <TerminalForm
          terminal={editingTerminal}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {viewingLogs && (
        <LogViewer
          terminalId={viewingLogs.id}
          terminalName={viewingLogs.name}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
}

export default App;
