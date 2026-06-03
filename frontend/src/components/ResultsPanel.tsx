import { BookOpen, FileText, ChevronRight } from 'lucide-react'

interface Paper {
  title: string
  abstract: string
  score?: number
}

interface SearchResponse {
  summary: string
  papers: Paper[]
  graph_data: object
}

interface ResultsPanelProps {
  data: SearchResponse
}

export function ResultsPanel({ data }: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      {/* AI Summary */}
      <section className="card p-6 animate-fade-up">
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-dim)' }}
          >
            <BookOpen className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            AI Summary
          </h2>
        </div>
        <div
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {data.summary.split('\n').map((p, i) =>
            p.trim() ? <p key={i} className={i > 0 ? 'mt-3' : ''}>{p}</p> : null
          )}
        </div>
      </section>

      {/* Papers */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent-dim)' }}
            >
              <FileText className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Referenced Papers
            </h2>
          </div>
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
          >
            {data.papers.length} found
          </span>
        </div>

        <div className="space-y-3">
          {data.papers.map((paper, index) => (
            <article
              key={index}
              className="card p-5 group cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3
                      className="text-sm font-semibold leading-snug line-clamp-2 transition-colors duration-150"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-light)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {paper.title}
                    </h3>
                    {paper.score != null && (
                      <span
                        className="shrink-0 px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums"
                        style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                      >
                        {(paper.score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>

                  {paper.score != null && (
                    <div className="h-0.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--bg-secondary)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(paper.score || 0) * 100}%`,
                          background: 'var(--accent)',
                        }}
                      />
                    </div>
                  )}

                  <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                    {paper.abstract}
                  </p>
                </div>

                <ChevronRight
                  className="w-4 h-4 shrink-0 mt-1 transition-transform duration-150 group-hover:translate-x-0.5"
                  style={{ color: 'var(--text-muted)' }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
