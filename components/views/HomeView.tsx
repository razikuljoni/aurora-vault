import React from 'react';
import {
  Sparkles,
  ArrowRight,
  FileText,
  Files,
  Globe,
  Share2,
  AlertTriangle,
  Activity,
  Layers,
  Zap,
  Plus,
  BookOpen,
  Folder,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Note, DocumentItem, Bookmark, Collection, DeterministicIntelligenceInsights, InboxItem } from '@/lib/types';
import { LumenCard } from '../lumen/LumenCard';
import { InsightStrip } from '../lumen/SourceBadge';

interface HomeViewProps {
  insights: DeterministicIntelligenceInsights;
  recentNotes: Note[];
  recentDocs: DocumentItem[];
  recentBookmarks: Bookmark[];
  collections: Collection[];
  inboxItems: InboxItem[];
  onNavigate: (view: string, itemId?: string) => void;
  onOpenQuickCapture: () => void;
  onSelectNote: (noteId: string) => void;
  onSelectDoc: (docId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  insights,
  recentNotes,
  recentDocs,
  recentBookmarks,
  collections,
  inboxItems,
  onNavigate,
  onOpenQuickCapture,
  onSelectNote,
  onSelectDoc,
}) => {
  const { knowledgePulse, staleNotes, orphanNodes, unreferencedSources, highImpactHubs } = insights;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Knowledge Pulse */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-linear-to-r from-slate-900 via-slate-900 to-indigo-950 text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sky-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Workspace Intelligence Pulse</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-white tracking-tight">
              Capture. Connect. Understand.
            </h1>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Your knowledge graph has mapped <strong className="text-white">{knowledgePulse.totalItems}</strong> entities with a <strong className="text-emerald-400">{knowledgePulse.connectedRatio}%</strong> connection ratio across {knowledgePulse.activeCollections} structured research collections.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenQuickCapture}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg hover:shadow-sky-500/20 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-amber-900" />
              <span>Quick Capture (⌘⇧Space)</span>
            </button>
            <button
              onClick={() => onNavigate('graph')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-mono text-xs font-medium transition-all"
            >
              <Share2 className="h-4 w-4 text-sky-400" />
              <span>Explore Graph</span>
            </button>
          </div>
        </div>

        {/* Pulse Metric Badges */}
        <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <div className="text-slate-400 text-[11px]">Total Entities</div>
            <div className="text-xl font-bold text-white mt-0.5">{knowledgePulse.totalItems}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Graph Connected Ratio</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">{knowledgePulse.connectedRatio}%</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">New This Week</div>
            <div className="text-xl font-bold text-sky-400 mt-0.5">+{knowledgePulse.newThisWeek}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Active Hub Nodes</div>
            <div className="text-xl font-bold text-indigo-300 mt-0.5">{highImpactHubs.length}</div>
          </div>
        </div>
      </div>

      {/* Grid Layout: Continue Research + Capture Inbox */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Research */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-sky-500" />
              <span>Continue Research</span>
            </h2>
            <button
              onClick={() => onNavigate('notes')}
              className="text-xs font-mono text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              View all notes <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-3">
            {recentNotes.slice(0, 3).map((note) => (
              <LumenCard
                key={note.id}
                title={note.title}
                subtitle={note.content.substring(0, 140).replace(/#|\[\[|\]\]/g, '') + '...'}
                icon={FileText}
                badge={note.collectionName || 'General'}
                badgeVariant="primary"
                tags={note.tags}
                meta={`v${note.versionCount} • ~${note.readingTimeMinutes} min read`}
                onClick={() => {
                  onSelectNote(note.id);
                  onNavigate('notes');
                }}
              />
            ))}
          </div>

          {/* Recent Documents Section */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-semibold uppercase text-slate-500">
                Primary Sources & Documents ({recentDocs.length})
              </h3>
              <button
                onClick={() => onNavigate('documents')}
                className="text-xs font-mono text-sky-600 dark:text-sky-400 hover:underline"
              >
                Inspect PDFs →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentDocs.map((doc) => (
                <LumenCard
                  key={doc.id}
                  title={doc.title}
                  subtitle={doc.summary}
                  icon={Files}
                  badge={`${doc.pageCount} pages`}
                  badgeVariant="rose"
                  tags={doc.tags}
                  meta={`${doc.highlights.length} citations`}
                  onClick={() => {
                    onSelectDoc(doc.id);
                    onNavigate('documents');
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Inbox & Deterministic Warnings */}
        <div className="space-y-6">
          {/* Capture Inbox Panel */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>Inbox Queue ({inboxItems.length})</span>
              </h3>
              <button
                onClick={() => onNavigate('inbox')}
                className="text-xs font-mono text-sky-600 dark:text-sky-400 hover:underline"
              >
                Triage →
              </button>
            </div>

            {inboxItems.length === 0 ? (
              <p className="text-xs text-slate-400 font-sans">
                Inbox is clear. Use Quick Capture (⌘⇧Space) to stash fleeting thoughts or URLs.
              </p>
            ) : (
              <div className="space-y-2">
                {inboxItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate('inbox')}
                    className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      <span className="truncate">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.type}
                      </span>
                    </div>
                    {item.content && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                        {item.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deterministic Health & Suggestions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-indigo-500" />
                <span>Deterministic Health</span>
              </h3>
              <button
                onClick={() => onNavigate('intelligence')}
                className="text-xs font-mono text-sky-600 dark:text-sky-400 hover:underline"
              >
                Inspect →
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {staleNotes.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{staleNotes.length} notes</span> require review ({staleNotes[0].title.substring(0, 24)}...)
                  </div>
                </div>
              )}

              {orphanNodes.length > 0 && (
                <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
                  <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{orphanNodes.length} orphan entities</span> with 0 backlinks. Link them into notes.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
