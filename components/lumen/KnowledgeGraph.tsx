import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Layers,
  Search,
  Share2,
  FileText,
  Globe,
  Code2,
  Folder,
  Eye,
  Info,
} from 'lucide-react';
import { KnowledgeGraphData, KnowledgeNode, KnowledgeEdge, NodeType } from '@/lib/types';

interface KnowledgeGraphProps {
  graphData: KnowledgeGraphData;
  selectedNodeId?: string | null;
  onSelectNode?: (node: KnowledgeNode) => void;
  className?: string;
}

interface SimulatedNode extends KnowledgeNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({
  graphData,
  selectedNodeId,
  onSelectNode,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Record<NodeType, boolean>>({
    NOTE: true,
    DOCUMENT: true,
    BOOKMARK: true,
    CODE: true,
    COLLECTION: true,
    PROJECT: true,
    CONCEPT: true,
  });
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Node Type colors
  const typeConfig: Record<NodeType, { color: string; fill: string; stroke: string; label: string; icon: any }> = {
    NOTE: { color: '#6366f1', fill: 'rgba(99, 102, 241, 0.15)', stroke: '#6366f1', label: 'Note', icon: FileText },
    DOCUMENT: { color: '#f43f5e', fill: 'rgba(244, 63, 94, 0.15)', stroke: '#f43f5e', label: 'Document', icon: FileText },
    BOOKMARK: { color: '#0ea5e9', fill: 'rgba(14, 165, 233, 0.15)', stroke: '#0ea5e9', label: 'Bookmark', icon: Globe },
    CODE: { color: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', stroke: '#10b981', label: 'Snippet', icon: Code2 },
    COLLECTION: { color: '#f59e0b', fill: 'rgba(245, 158, 11, 0.2)', stroke: '#f59e0b', label: 'Collection', icon: Folder },
    PROJECT: { color: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)', stroke: '#8b5cf6', label: 'Project', icon: Layers },
    CONCEPT: { color: '#64748b', fill: 'rgba(100, 116, 139, 0.15)', stroke: '#64748b', label: 'Concept', icon: Share2 },
  };

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return graphData.nodes.filter((node) => {
      if (!activeTypes[node.type]) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return node.title.toLowerCase().includes(q) || node.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [graphData.nodes, activeTypes, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return graphData.edges.filter(
      (edge) => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [graphData.edges, filteredNodeIds]);

  // Force-directed simulation placement computation
  const simulatedNodes: SimulatedNode[] = useMemo(() => {
    const width = 800;
    const height = 550;
    const initialNodes: SimulatedNode[] = filteredNodes.map((n, i) => {
      // Circle layout with jitter
      const angle = (i / (filteredNodes.length || 1)) * 2 * Math.PI;
      const radius = 180 + (i % 3) * 60;
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * radius,
        y: height / 2 + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });

    // Run simple spring simulation steps
    for (let step = 0; step < 45; step++) {
      // Repulsion between all nodes
      for (let i = 0; i < initialNodes.length; i++) {
        for (let j = i + 1; j < initialNodes.length; j++) {
          const dx = initialNodes[i].x - initialNodes[j].x;
          const dy = initialNodes[i].y - initialNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 220) {
            const force = (220 - dist) / dist * 1.5;
            initialNodes[i].x += (dx / dist) * force;
            initialNodes[i].y += (dy / dist) * force;
            initialNodes[j].x -= (dx / dist) * force;
            initialNodes[j].y -= (dy / dist) * force;
          }
        }
      }

      // Spring attraction along edges
      for (const edge of filteredEdges) {
        const sourceNode = initialNodes.find((n) => n.id === edge.source);
        const targetNode = initialNodes.find((n) => n.id === edge.target);
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 140;
          const force = (dist - targetDist) * 0.04;
          sourceNode.x += (dx / dist) * force;
          sourceNode.y += (dy / dist) * force;
          targetNode.x -= (dx / dist) * force;
          targetNode.y -= (dy / dist) * force;
        }
      }

      // Center gravity
      for (const n of initialNodes) {
        n.x += (width / 2 - n.x) * 0.02;
        n.y += (height / 2 - n.y) * 0.02;
      }
    }

    return initialNodes;
  }, [filteredNodes, filteredEdges]);

  // Connected node IDs for neighborhood highlight
  const neighborIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId) return null;

    const set = new Set<string>([activeId]);
    for (const edge of filteredEdges) {
      if (edge.source === activeId) set.add(edge.target);
      if (edge.target === activeId) set.add(edge.source);
    }
    return set;
  }, [hoveredNodeId, selectedNodeId, filteredEdges]);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-[600px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden select-none ${className}`}
    >
      {/* Top Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Search & Type Filter Bar */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 shadow-md">
          <div className="relative flex items-center">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs bg-slate-800/80 border border-slate-700 text-slate-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 w-44 placeholder:text-slate-500 font-mono"
            />
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Type toggles */}
          <div className="flex items-center gap-1">
            {(Object.keys(typeConfig) as NodeType[]).slice(0, 5).map((t) => {
              const cfg = typeConfig[t];
              const active = activeTypes[t];
              return (
                <button
                  key={t}
                  onClick={() => setActiveTypes((prev) => ({ ...prev, [t]: !prev[t] }))}
                  className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-all ${
                    active
                      ? 'bg-slate-800 text-slate-200 border-slate-700'
                      : 'bg-transparent text-slate-600 border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-md text-slate-300">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
            title="Reset Viewport"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeOpacity="0.4" />
          </pattern>
          {/* Arrow markers for edges */}
          <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#475569" />
          </marker>
        </defs>

        <rect width="2000" height="2000" x="-600" y="-600" fill="url(#grid)" />

        {/* Render Edges */}
        <g className="edges">
          {filteredEdges.map((edge) => {
            const sourceNode = simulatedNodes.find((n) => n.id === edge.source);
            const targetNode = simulatedNodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = neighborIds ? neighborIds.has(edge.source) && neighborIds.has(edge.target) : false;
            const isDimmed = neighborIds && !isHighlighted;

            return (
              <g key={edge.id}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#38bdf8' : '#334155'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={edge.type === 'TAGGED_WITH' ? '4 4' : undefined}
                  opacity={isDimmed ? 0.15 : isHighlighted ? 0.9 : 0.45}
                  markerEnd="url(#arrow)"
                />
                {edge.label && isHighlighted && (
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 4}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none bg-slate-900 px-1"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Render Nodes */}
        <g className="nodes">
          {simulatedNodes.map((node) => {
            const cfg = typeConfig[node.type] || typeConfig.NOTE;
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isHighlighted = neighborIds ? neighborIds.has(node.id) : true;
            const isDimmed = neighborIds && !isHighlighted;
            const radius = (node.size || 20) / 2 + 4;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelectNode?.(node)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer transition-opacity duration-200"
                style={{ opacity: isDimmed ? 0.2 : 1 }}
              >
                {/* Glow for selected/hovered */}
                {(isSelected || isHovered) && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={cfg.color}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                    className="animate-pulse"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r={radius}
                  fill={cfg.fill}
                  stroke={isSelected ? '#ffffff' : cfg.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Node Label */}
                <text
                  y={radius + 14}
                  fill={isSelected ? '#ffffff' : '#cbd5e1'}
                  fontSize="11"
                  fontWeight={isSelected ? '600' : '500'}
                  fontFamily="system-ui, sans-serif"
                  textAnchor="middle"
                  className="select-none pointer-events-none drop-shadow-md"
                >
                  {node.title.length > 22 ? `${node.title.substring(0, 20)}...` : node.title}
                </text>

                {/* Node Sublabel / Tag */}
                {node.tags?.[0] && (
                  <text
                    y={radius + 25}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    #{node.tags[0]}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Bottom Info & Stats Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 shadow-md pointer-events-auto">
          <span>
            <strong className="text-slate-200">{simulatedNodes.length}</strong> Nodes
          </span>
          <span>•</span>
          <span>
            <strong className="text-slate-200">{filteredEdges.length}</strong> Connections
          </span>
          <span>•</span>
          <span>Click node to inspect context</span>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-sky-400 shadow-md pointer-events-auto flex items-center gap-1.5">
          <Share2 className="h-3 w-3" />
          <span>Deterministic Graph Engine Active</span>
        </div>
      </div>
    </div>
  );
};
