import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

const suggestions = [
  'What are the latest treatments for Type 2 Diabetes?',
  'Cancer immunotherapy clinical trials 2024',
  'CRISPR gene therapy applications',
  'COVID-19 long-term effects and management',
]

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medical literature, diseases, treatments..."
            disabled={isLoading}
            className="w-full pl-5 pr-14 py-3.5 rounded-xl text-sm transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
            style={{ background: 'var(--accent-dim)' }}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'var(--accent)' }} />
            ) : (
              <Search className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            )}
          </button>
        </div>
      </form>

      <div>
        <p className="text-xs mb-2.5" style={{ color: 'var(--text-muted)' }}>Try these searches:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuery(q); onSearch(q) }}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg text-xs transition-all duration-150 disabled:opacity-40"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent-light)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
