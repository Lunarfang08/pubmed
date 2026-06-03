import { useMutation } from '@tanstack/react-query'

interface SearchResponse {
  summary: string
  papers: Array<{
    title: string
    abstract: string
    score?: number
  }>
  graph_data: {
    nodes: Array<{ id: string; label: string; type: string }>
    edges: Array<{ source: string; target: string; relationship: string }>
  }
}

export function useSearch() {
  return useMutation<SearchResponse, Error, string>({
    mutationFn: async (query: string) => {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, limit: 10, threshold: 0.80 }),
      })
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`)
      }
      return response.json()
    },
  })
}

export async function fetchGraphData(): Promise<SearchResponse['graph_data']> {
  const res = await fetch('/api/graph')
  return res.json()
}

export async function fetchGraphStats() {
  const res = await fetch('/api/graph/stats')
  return res.json()
}
