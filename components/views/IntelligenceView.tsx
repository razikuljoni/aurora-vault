import React from 'react';
import {
  Sparkles,
  Activity,
  AlertTriangle,
  Link2,
  Unlink,
  Clock,
  TrendingUp,
  FolderTree,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { DeterministicIntelligenceInsights, Note, DocumentItem, Bookmark, CodeSnippet } from '@/lib/types';

interface IntelligenceViewProps {
  insights: DeterministicIntelligenceInsights;
  notes: Note[];
  documents: DocumentItem[];
  bookmarks: Bookmark[];
  codeSnippets: CodeSnippet[];
  onNavigate: (view: string, itemId?: string) => void;
  className?: string;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  insights,
  notes,
  documents,
  bookmarks,
  codeSnippets,
  onNavigate,
  className = '',
}) => {
  const pulse = insights.knowledgePulse;

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-purple-600 dark:text-purple-400">
          <Sparkles className="h-4 w-4" />
          <span>Deterministic Graph Diagnostics & Vault Health</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
          Knowledge Intelligence & Health
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
          Deterministic topological analysis detecting orphan concepts, stale research clusters, and high-impact hubs.
        </p>
      </div>

      {/* Pulse KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Total Artifacts</span>
            <FolderTree className="h-4 w-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            {pulse.totalItems}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
            +{pulse.newThisWeek} new this week
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Connected Ratio</span>
            <Share2 className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            {(pulse.connectedRatio * 100).toFixed(0)}%
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Nodes with backlinks
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Orphan Nodes</span>
            <Unlink className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            {insights.orphanNodes.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
            Requires cross-linking
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Stale Notes</span>
            <Clock className="h-4 w-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            {insights.staleNotes.length}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono">
            &gt;30 days inactive
          </div>
        </div>
      </div>

      {/* Main Diagnostic Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Impact Hubs */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
              <span>High-Impact Knowledge Hubs</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Central Pillars</span>
          </div>

          <div className="space-y-2.5">
            {insights.highImpactHubs.map((hub) => (
              <div
                key={hub.id}
                onClick={() => onNavigate('notes', hub.id)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-semibold font-sans text-slate-900 dark:text-slate-100">
                    {hub.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Type: {hub.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                    {hub.connectionCount} links
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orphan Nodes Requiring Backlinks */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-600 dark:text-amber-400">
              <Unlink className="h-4 w-4" />
              <span>Orphan Artifacts (Zero Links)</span>
            </div>
            <span className="text-[11px] font-mono text-amber-600">Action Required</span>
          </div>

          <div className="space-y-2.5">
            {insights.orphanNodes.length === 0 ? (
              <div className="p-4 text-center text-xs font-mono text-slate-400">
                All artifacts are connected to the knowledge graph!
              </div>
            ) : (
              insights.orphanNodes.map((orphan) => (
                <div
                  key={orphan.id}
                  onClick={() => onNavigate('notes', orphan.id)}
                  className="p-3 rounded-xl border border-amber-500/20 bg-amber-50/20 dark:bg-amber-950/10 hover:bg-amber-50/40 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <h4 className="text-xs font-semibold font-sans text-slate-900 dark:text-slate-100">
                      {orphan.title}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                      Disconnected • Add [[WikiLinks]] in editor
                    </span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stale Research Notes */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-rose-600 dark:text-rose-400">
              <Clock className="h-4 w-4" />
              <span>Stale Research In Need of Review</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">&gt;30 Days</span>
          </div>

          <div className="space-y-2.5">
            {insights.staleNotes.map((stale) => (
              <div
                key={stale.id}
                onClick={() => onNavigate('notes', stale.id)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-semibold font-sans text-slate-900 dark:text-slate-100">
                    {stale.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    {stale.tags.map((t) => (
                      <span key={t} className="text-[10px] font-mono text-slate-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold shrink-0">
                  {stale.daysInactive}d inactive
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Unreferenced Sources */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-sky-600 dark:text-sky-400">
              <Link2 className="h-4 w-4" />
              <span>Unreferenced Source Literature</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Uncited</span>
          </div>

          <div className="space-y-2.5">
            {insights.unreferencedSources.map((source) => (
              <div
                key={source.id}
                onClick={() => onNavigate(source.type === 'DOCUMENT' ? 'documents' : 'bookmarks', source.id)}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-semibold font-sans text-slate-900 dark:text-slate-100">
                    {source.title}
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {source.type} • Zero citations in notes
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
