import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import { Network, Zap, FileText, Users } from 'lucide-react'

interface Node {
  id: string
  label: string
  type: string
}

interface Edge {
  source: string
  target: string
  relationship: string
}

interface GraphDataProps {
  graphData: {
    nodes: Node[]
    edges: Edge[]
  }
}

const TYPE_COLORS: Record<string, string> = {
  Paper: '#14b8a6',
  Author: '#3b82f6',
  Disease: '#f59e0b',
}

export function KnowledgeGraph({ graphData }: GraphDataProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes?.length) return

    const elements = [
      ...graphData.nodes.map(node => ({
        data: { id: node.id, label: node.label, type: node.type },
      })),
      ...graphData.edges.map(edge => ({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.relationship,
        },
      })),
    ]

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => TYPE_COLORS[ele.data('type')] || '#64748b',
            label: 'data(label)',
            color: '#e2e8f0',
            'font-size': 10,
            'text-valign': 'bottom',
            'text-halign': 'center',
            'text-margin-y': 6,
            width: (ele: any) => (ele.data('type') === 'Paper' ? 50 : 34),
            height: (ele: any) => (ele.data('type') === 'Paper' ? 50 : 34),
            'border-width': 2,
            'border-color': (ele: any) => {
              const c = TYPE_COLORS[ele.data('type')] || '#64748b'
              return c + '60'
            },
            'text-wrap': 'ellipsis',
            'text-max-width': '70px',
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'edge',
          style: {
            width: 1.5,
            'line-color': '#ffffff15',
            'target-arrow-color': '#ffffff25',
            'target-arrow-shape': 'triangle',
            'arrow-scale': 0.7,
            'curve-style': 'bezier',
            label: 'data(label)',
            'font-size': 8,
            color: '#ffffff40',
            'text-rotation': 'autorotate',
            'overlay-opacity': 0,
          },
        },
        {
          selector: 'node:active',
          style: {
            'overlay-opacity': 0,
            'border-color': '#14b8a6',
            'border-width': 3,
          },
        },
      ],
      layout: {
        name: 'cose',
        randomize: false,
        componentSpacing: 50,
        gravity: 0.8,
        avoidOverlap: true,
        animate: false,
      } as cytoscape.LayoutOptions,
      wheelSensitivity: 0.3,
      minZoom: 0.3,
      maxZoom: 3,
    })

    cyRef.current = cy
    requestAnimationFrame(() => cy.fit(undefined, 30))

    return () => { cy.destroy() }
  }, [graphData])

  const nodeCount = graphData?.nodes?.length || 0
  const edgeCount = graphData?.edges?.length || 0
  const paperCount = graphData?.nodes?.filter(n => n.type === 'Paper').length || 0
  const otherCount = nodeCount - paperCount

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={<Network className="w-4 h-4" />} label="Nodes" value={nodeCount} />
        <Stat icon={<Zap className="w-4 h-4" />} label="Edges" value={edgeCount} />
        <Stat icon={<FileText className="w-4 h-4" />} label="Papers" value={paperCount} />
        <Stat icon={<Users className="w-4 h-4" />} label="Others" value={otherCount} />
      </div>

      <div className="card overflow-hidden">
        <div
          ref={containerRef}
          className="w-full h-[500px] sm:h-[600px]"
          style={{ background: 'var(--bg-primary)' }}
        />
        <div className="px-4 py-3 flex flex-wrap items-center gap-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <Legend color={TYPE_COLORS.Paper} label="Papers" />
          <Legend color={TYPE_COLORS.Author} label="Authors" />
          <Legend color={TYPE_COLORS.Disease} label="Diseases" />
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Scroll to zoom / Drag to pan
          </span>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: 'var(--accent)' }}>{icon}</span>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <span className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  )
}
