import { Beaker, Search, GitBranch } from 'lucide-react'

export function SearchHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(10,15,26,0.85)', backdropFilter: 'blur(12px)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
              <Beaker className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                MedGraph
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Medical Research Intelligence
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-5">
            <Feature icon={<Search className="w-3.5 h-3.5" />} label="Semantic Search" />
            <Feature icon={<GitBranch className="w-3.5 h-3.5" />} label="Knowledge Graph" />
            <Feature icon={<Beaker className="w-3.5 h-3.5" />} label="AI Summaries" />
          </div>
        </div>
      </div>
    </header>
  )
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
      <span style={{ color: 'var(--accent)' }}>{icon}</span>
      {label}
    </div>
  )
}
