import React, { useState } from 'react';
import {
  Share2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Search,
  Filter,
  Info,
  ExternalLink,
  ArrowRight,
  FileText,
  Files,
  Globe,
  Code2,
  Folder,
} from 'lucide-react';
import { KnowledgeGraphData, KnowledgeNode, NodeType } from '@/lib/types';
import { KnowledgeGraph } from '../lumen/KnowledgeGraph';

interface KnowledgeGraphViewProps {
  graphData: KnowledgeGraphData;
  onNavigate: (view: string, itemId?: string) => void;
  className?: string;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graphData,
  onNavigate,
  className = '',
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  // Derived metrics
  const totalNodes = graphData.nodes.length;
  const totalEdges = graphData.edges.length;
  const density = totalNodes > 1 ? ((2 * totalEdges) / (totalNodes * (totalNodes - 1))).toFixed(3) : '0';

  // Connected components / top hubs
  const hubRanking = [...graphData.nodes]
    .sort((a, b) => (b.connectionsCount || 0) - (a.connectionsCount || 0))
    .slice(0, 5);

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
  };

  const handleOpenSource = (node: KnowledgeNode) => {
    const viewMap: Record<NodeType, string> = {
      NOTE: 'notes',
      DOCUMENT: 'documents',
      BOOKMARK: 'bookmarks',
      CODE: 'code',
      COLLECTION: 'collections',
      PROJECT: 'notes',
      CONCEPT: 'notes',
    };
    onNavigate(viewMap[node.type] || 'notes', node.id);
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-600 dark:text-indigo-400">
            <Share2 className="h-4 w-4" />
            <span>Interactive Knowledge Graph & Semantic Topography</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Knowledge Graph Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Visualize the organic relationships, citations, and structural cross-links connecting your research vault.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400">
            <span><strong>{totalNodes}</strong> Entities</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span><strong>{totalEdges}</strong> Synapses</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Density <strong>{density}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas Stage (8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 h-[620px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden relative shadow-lg">
          <KnowledgeGraph
            graphData={graphData}
            selectedNodeId={selectedNode?.id}
            onSelectNode={handleNodeClick}
            className="w-full h-full"
          />
        </div>

        {/* Right Side: Node Inspector & Hub Analytics (4 or 3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Selected Node Details Card */}
          {selectedNode ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold">
                  {selectedNode.type}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  ✕
                </button>
              </div>

              <div>
                <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-slate-100">
                  {selectedNode.title}
                </h3>
                {selectedNode.collectionName && (
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    in {selectedNode.collectionName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-center py-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">Connections</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedNode.connectionsCount || 0}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Node Weight</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedNode.size || 14}pt
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400">Associated Tags</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleOpenSource(selectedNode)}
                className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                Open Entity Artifact <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400 font-mono">
              Click any node in the graph to inspect structural properties & jump directly to its content.
            </div>
          )}

          {/* Top Knowledge Hubs */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Top Semantic Hubs
            </h4>

            <div className="space-y-2">
              {hubRanking.map((hub) => (
                <div
                  key={hub.id}
                  onClick={() => setSelectedNode(hub)}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-xs font-sans font-medium text-slate-800 dark:text-slate-200 truncate">
                      {hub.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                    {hub.connectionsCount || 0} links
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
