import React, { useState } from 'react';
import {
  Folder,
  Plus,
  FileText,
  Files,
  Globe,
  Code2,
  MoreVertical,
  Edit2,
  Trash2,
  Layers,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Collection, Note, DocumentItem, Bookmark, CodeSnippet } from '@/lib/types';
import { LumenCard } from '../lumen/LumenCard';

interface CollectionsViewProps {
  collections: Collection[];
  notes: Note[];
  documents: DocumentItem[];
  bookmarks: Bookmark[];
  codeSnippets: CodeSnippet[];
  selectedCollectionId: string | null;
  onSelectCollection: (colId: string | null) => void;
  onCreateCollection: (data: Partial<Collection>) => void;
  onUpdateCollection?: (id: string, updates: Partial<Collection>) => void;
  onDeleteCollection?: (id: string) => void;
  onNavigate: (view: string, itemId?: string) => void;
  className?: string;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  notes,
  documents,
  bookmarks,
  codeSnippets,
  selectedCollectionId,
  onSelectCollection,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onNavigate,
  className = '',
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#0284c7');

  const activeCollection = collections.find((c) => c.id === selectedCollectionId) || null;

  // Items under selected collection
  const colNotes = activeCollection ? notes.filter((n) => n.collectionId === activeCollection.id) : [];
  const colDocs = activeCollection ? documents.filter((d) => d.collectionId === activeCollection.id) : [];
  const colBookmarks = activeCollection ? bookmarks.filter((b) => b.collectionId === activeCollection.id) : [];
  const colCode = activeCollection ? codeSnippets.filter((c) => c.collectionId === activeCollection.id) : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateCollection({
      name: name.trim(),
      description: description.trim(),
      color,
    });

    setIsCreating(false);
    setName('');
    setDescription('');
  };

  const presetColors = ['#0284c7', '#059669', '#d97706', '#7c3aed', '#e11d48', '#475569'];

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-sky-600 dark:text-sky-400">
            <Folder className="h-4 w-4" />
            <span>Taxonomy & Hierarchical Research Clusters</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Collections & Notebooks
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Organize multi-modal research artifacts into domain-specific workspaces and project hubs.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" /> New Collection
        </button>
      </div>

      {/* Grid of Collections Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => {
          const isSelected = activeCollection?.id === col.id;
          const totalItems =
            col.itemsCount.notes + col.itemsCount.documents + col.itemsCount.bookmarks + col.itemsCount.code;

          return (
            <div
              key={col.id}
              onClick={() => onSelectCollection(isSelected ? null : col.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 shadow-md ring-1 ring-sky-500/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: col.color }}
                    />
                    <h3 className="text-sm font-semibold font-sans text-slate-900 dark:text-slate-100 truncate">
                      {col.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    {totalItems} items
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-sans">
                  {col.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400">
                    <FileText className="h-3 w-3" /> {col.itemsCount.notes}
                  </span>
                  <span className="flex items-center gap-1 text-rose-500">
                    <Files className="h-3 w-3" /> {col.itemsCount.documents}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500">
                    <Globe className="h-3 w-3" /> {col.itemsCount.bookmarks}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Code2 className="h-3 w-3" /> {col.itemsCount.code}
                  </span>
                </div>
                <span className="text-sky-600 dark:text-sky-400 text-xs font-semibold">
                  {isSelected ? 'Selected' : 'Explore →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Collection Contents Panel */}
      {activeCollection && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 space-y-6 shadow-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <span
                className="h-4 w-4 rounded-full shrink-0"
                style={{ backgroundColor: activeCollection.color }}
              />
              <div>
                <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">
                  {activeCollection.name}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
                  {activeCollection.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectCollection(null)}
              className="text-xs font-mono text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              Close Cluster View ✕
            </button>
          </div>

          {/* Section: Notes */}
          {colNotes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-sky-500" />
                <span>Notes in this Collection ({colNotes.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colNotes.map((n) => (
                  <LumenCard
                    key={n.id}
                    title={n.title}
                    subtitle={n.content.substring(0, 100).replace(/#|\[\[|\]\]/g, '') + '...'}
                    icon={FileText}
                    badge={`v${n.versionCount}`}
                    badgeVariant="primary"
                    tags={n.tags}
                    onClick={() => onNavigate('notes', n.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: Documents */}
          {colDocs.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Files className="h-3.5 w-3.5 text-rose-500" />
                <span>Documents & PDF Sources ({colDocs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colDocs.map((d) => (
                  <LumenCard
                    key={d.id}
                    title={d.title}
                    subtitle={d.summary}
                    icon={Files}
                    badge={`${d.pageCount} pages`}
                    badgeVariant="rose"
                    tags={d.tags}
                    onClick={() => onNavigate('documents', d.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: Bookmarks */}
          {colBookmarks.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-emerald-500" />
                <span>Bookmarks ({colBookmarks.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colBookmarks.map((b) => (
                  <LumenCard
                    key={b.id}
                    title={b.title}
                    subtitle={b.description}
                    icon={Globe}
                    badge={b.domain}
                    badgeVariant="emerald"
                    tags={b.tags}
                    onClick={() => onNavigate('bookmarks', b.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section: Code Snippets */}
          {colCode.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Code2 className="h-3.5 w-3.5 text-amber-500" />
                <span>Code Snippets ({colCode.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colCode.map((c) => (
                  <LumenCard
                    key={c.id}
                    title={c.title}
                    subtitle={c.description}
                    icon={Code2}
                    badge={c.language}
                    badgeVariant="amber"
                    tags={c.tags}
                    onClick={() => onNavigate('code', c.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Collection Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-mono flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Folder className="h-4 w-4 text-sky-500" />
                Create New Research Collection
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-200">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Collection Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Consensus Research"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Description & Scope</label>
                <textarea
                  rows={3}
                  placeholder="Scope of work, key questions, and methodology..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1.5 block">Accent Color</label>
                <div className="flex items-center gap-2">
                  {presetColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-6 w-6 rounded-full transition-transform ${
                        color === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-md transition-colors"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
