import { useState, lazy, Suspense } from 'react'
import { SearchHeader } from './components/SearchHeader'
import { SearchBar } from './components/SearchBar'
import { ResultsPanel } from './components/ResultsPanel'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useSearch } from './hooks/useSearch'

const KnowledgeGraph = lazy(() =>
  import('./components/KnowledgeGraph').then(m => ({ default: m.KnowledgeGraph }))
)

function App() {
  const [activeTab, setActiveTab] = useState<'results' | 'graph'>('results')
  const { data, isPending: isLoading, error, mutate } = useSearch()

  const handleSearch = (query: string) => {
    mutate(query)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <SearchHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {isLoading && (
          <div className="flex justify-center items-center min-h-[24rem]">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500/30 animate-fade-up">
            <h3 className="text-base font-semibold text-red-400 mb-1">Something went wrong</h3>
            <p className="text-sm text-red-300/80">{error.message}</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="animate-fade-up">
            <div className="flex gap-1 mb-6 p-1 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'results'
                    ? 'bg-[var(--accent-dim)] text-[var(--accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Summary & Papers
              </button>
              <button
                onClick={() => setActiveTab('graph')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'graph'
                    ? 'bg-[var(--accent-dim)] text-[var(--accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Knowledge Graph
              </button>
            </div>

            {activeTab === 'results' && <ResultsPanel data={data} />}
            {activeTab === 'graph' && (
              <Suspense fallback={<div className="text-center py-12 text-[var(--text-muted)]">Loading graph...</div>}>
                <KnowledgeGraph graphData={data.graph_data} />
              </Suspense>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
