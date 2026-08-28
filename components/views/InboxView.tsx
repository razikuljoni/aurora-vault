import React, { useState } from 'react';
import {
  Inbox,
  Zap,
  ArrowRight,
  CheckCircle2,
  Trash2,
  FileText,
  Globe,
  Code2,
  Filter,
  Plus,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FolderPlus,
} from 'lucide-react';
import { InboxItem, InboxItemType, Collection } from '@/lib/types';

interface InboxViewProps {
  items: InboxItem[];
  collections: Collection[];
  onTriageItem: (itemId: string, destination: 'NOTE' | 'BOOKMARK' | 'CODE', collectionId?: string) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenQuickCapture: () => void;
  className?: string;
}

export const InboxView: React.FC<InboxViewProps> = ({
  items,
  collections,
  onTriageItem,
  onDeleteItem,
  onOpenQuickCapture,
  className = '',
}) => {
  const [filterType, setFilterType] = useState<InboxItemType | 'ALL'>('ALL');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(items[0]?.id || null);
  const [targetCollectionId, setTargetCollectionId] = useState<string>('');

  const filteredItems = items.filter((item) => {
    if (filterType !== 'ALL' && item.type !== filterType) return false;
    return true;
  });

  const selectedItem = items.find((i) => i.id === selectedItemId) || items[0] || null;

  const getTypeIcon = (type: InboxItemType) => {
    switch (type) {
      case 'NOTE':
        return <FileText className="h-4 w-4 text-sky-500" />;
      case 'URL':
        return <Globe className="h-4 w-4 text-emerald-500" />;
      case 'CODE':
        return <Code2 className="h-4 w-4 text-amber-500" />;
      default:
        return <Zap className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
            <Zap className="h-4 w-4" />
            <span>Zero-Friction Ingestion Pipeline</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Capture Inbox & Rapid Triage
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Process incoming raw ideas, links, and code snippets into permanent research artifacts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQuickCapture}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Capture New (⌘⇧Space)
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg w-fit text-xs font-mono">
        {(['ALL', 'NOTE', 'URL', 'CODE'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 rounded-md transition-all ${
              filterType === t
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {t === 'ALL' ? `All Items (${items.length})` : `${t} (${items.filter((i) => i.type === t).length})`}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Items List & Triage Workspace */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white/50 dark:bg-slate-900/50">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto opacity-80" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Inbox Zero Reached</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All captured items have been triaged into notes, bookmarks, or code snippets. Use Quick Capture to record new research signals.
          </p>
          <button
            onClick={onOpenQuickCapture}
            className="mt-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-mono font-medium hover:opacity-90 transition-opacity"
          >
            Trigger Quick Capture
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Queue List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {filteredItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 shadow-xs ring-1 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-2 font-sans line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-sans">
                    {item.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1">
                      {item.tags.slice(0, 2).map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                    <span className="text-sky-600 dark:text-sky-400 font-medium">Ready to Triage →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Triage Inspection & Action Stage (7 cols) */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs sticky top-20">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedItem.type)}
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      Triage Item: {selectedItem.title}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteItem(selectedItem.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded"
                    title="Dismiss / Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Content Preview */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Captured Payload</div>
                  {selectedItem.type === 'URL' && selectedItem.url ? (
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-sky-600 dark:text-sky-400 flex items-center justify-between">
                      <span className="truncate">{selectedItem.url}</span>
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-sky-500 ml-2"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ) : null}

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {selectedItem.content}
                  </div>
                </div>

                {/* Destination Collection Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-500 block">
                    Assign Collection (Optional)
                  </label>
                  <select
                    value={targetCollectionId}
                    onChange={(e) => setTargetCollectionId(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-800 dark:text-slate-200"
                  >
                    <option value="">(Root / Uncategorized)</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Triage Actions */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    Transform & Promote To:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => onTriageItem(selectedItem.id, 'NOTE', targetCollectionId)}
                      className="p-3 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-sky-900 dark:text-sky-200 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <FileText className="h-4 w-4 text-sky-500" />
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="font-semibold text-xs mt-2">Promote to Note</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                        Author markdown & backlinks
                      </div>
                    </button>

                    <button
                      onClick={() => onTriageItem(selectedItem.id, 'BOOKMARK', targetCollectionId)}
                      className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <Globe className="h-4 w-4 text-emerald-500" />
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="font-semibold text-xs mt-2">Save Bookmark</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                        SSRF-safe metadata ingestion
                      </div>
                    </button>

                    <button
                      onClick={() => onTriageItem(selectedItem.id, 'CODE', targetCollectionId)}
                      className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-left transition-all group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <Code2 className="h-4 w-4 text-amber-500" />
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="font-semibold text-xs mt-2">Store Code</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans">
                        Syntax highlighted snippet
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
