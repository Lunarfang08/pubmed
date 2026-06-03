import { useState, useEffect } from 'react'

const STEPS = [
  { label: 'Generating semantic embedding', detail: 'Converting your query into a vector representation', icon: '{ }' },
  { label: 'Searching knowledge graph', detail: 'Querying Neo4j with cosine similarity', icon: '::' },
  { label: 'Analyzing research papers', detail: 'Matching relevant publications by relevance', icon: '[ ]' },
  { label: 'Generating AI summary', detail: 'Synthesizing findings with Gemini', icon: '>_' },
  { label: 'Building knowledge graph', detail: 'Mapping relationships between entities', icon: '<>' },
]

const FACTS = [
  'Over 36 million articles are indexed in PubMed.',
  'Vector embeddings capture semantic meaning beyond keyword matching.',
  'Knowledge graphs reveal hidden connections between concepts.',
  'MedGraph uses 3072-dimensional embeddings for high accuracy.',
  'Cosine similarity measures the angle between two vectors.',
]

export function LoadingSpinner() {
  const [activeStep, setActiveStep] = useState(0)
  const [fact, setFact] = useState(() => FACTS[Math.floor(Math.random() * FACTS.length)])
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 3000)
    return () => clearInterval(stepInterval)
  }, [])

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFact(FACTS[Math.floor(Math.random() * FACTS.length)])
    }, 5000)
    return () => clearInterval(factInterval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card p-6">
        {/* Animated header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border-medium)" strokeWidth="2.5" />
              <circle
                cx="20" cy="20" r="16" fill="none"
                stroke="var(--accent)" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="100"
                strokeDashoffset={100 - (activeStep + 1) * 20}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
              style={{ color: 'var(--accent)' }}
            >
              {activeStep + 1}/{STEPS.length}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Searching Medical Literature
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {elapsed}s elapsed
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-1 mb-6">
          {STEPS.map((step, i) => {
            const done = i < activeStep
            const active = i === activeStep
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300"
                style={{
                  background: active ? 'var(--accent-dim)' : 'transparent',
                  opacity: i > activeStep ? 0.35 : 1,
                }}
              >
                <span
                  className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0"
                  style={{
                    background: done ? 'var(--accent)' : active ? 'var(--accent-dim)' : 'var(--bg-secondary)',
                    color: done ? '#fff' : active ? 'var(--accent)' : 'var(--text-muted)',
                    border: `1px solid ${done ? 'var(--accent)' : active ? 'var(--accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {done ? '\u2713' : step.icon}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-xs font-medium truncate"
                    style={{ color: active ? 'var(--accent-light)' : done ? 'var(--text-primary)' : 'var(--text-muted)' }}
                  >
                    {step.label}
                  </p>
                  {active && (
                    <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {step.detail}
                    </p>
                  )}
                </div>
                {active && (
                  <div className="ml-auto flex gap-1">
                    {[0, 1, 2].map(d => (
                      <span
                        key={d}
                        className="w-1 h-1 rounded-full"
                        style={{
                          background: 'var(--accent)',
                          animation: `pulse-ring 1s ease-in-out ${d * 0.15}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'var(--bg-secondary)' }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${((activeStep + 1) / STEPS.length) * 100}%`,
              background: 'var(--accent)',
            }}
          />
        </div>

        {/* Fun fact */}
        <div className="px-3 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--accent)' }}>Did you know? </span>
            {fact}
          </p>
        </div>
      </div>
    </div>
  )
}
