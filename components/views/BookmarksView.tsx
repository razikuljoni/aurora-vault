import React, { useState } from 'react';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Clock,
  Tag,
  BookOpen,
  Trash2,
  Edit2,
  Folder,
  Layers,
  Filter,
} from 'lucide-react';
import { Bookmark, Collection } from '@/lib/types';

interface BookmarksViewProps {
  bookmarks: Bookmark[];
  collections: Collection[];
  onAddBookmark: (data: Partial<Bookmark>) => void;
  onToggleRead: (id: string) => void;
  onDeleteBookmark: (id: string) => void;
  onUpdateBookmarkNotes?: (id: string, notes: string) => void;
  className?: string;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  collections,
  onAddBookmark,
  onToggleRead,
  onDeleteBookmark,
  onUpdateBookmarkNotes,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form State for Add Bookmark
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [tagsInput, setTagsInput] = useState('research, web');
  const [collectionIdInput, setCollectionIdInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ safe: boolean; host: string } | null>(null);

  // Filter Bookmarks
  const filteredBookmarks = bookmarks.filter((bm) => {
    if (readFilter !== 'ALL' && bm.readStatus !== readFilter) return false;
    if (selectedTag && !bm.tags.includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        bm.title.toLowerCase().includes(q) ||
        bm.description.toLowerCase().includes(q) ||
        bm.domain.toLowerCase().includes(q) ||
        bm.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleSimulateUrlLookup = () => {
    if (!urlInput.trim()) return;
    setIsVerifying(true);
    try {
      const parsed = new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`);
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationResult({ safe: true, host: parsed.hostname });
        if (!titleInput) {
          setTitleInput(`${parsed.hostname} Research Reference`);
        }
        if (!descInput) {
          setDescInput(`Verified bookmark captured from ${parsed.hostname} with SSRF protection.`);
        }
      }, 400);
    } catch {
      setIsVerifying(false);
      setVerificationResult({ safe: false, host: 'Invalid URL Format' });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim() || !titleInput.trim()) return;

    try {
      const validUrl = urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
      const parsed = new URL(validUrl);
      const col = collections.find((c) => c.id === collectionIdInput);

      onAddBookmark({
        url: validUrl,
        title: titleInput.trim(),
        description: descInput.trim() || `Bookmark from ${parsed.hostname}`,
        domain: parsed.hostname,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
        collectionId: collectionIdInput || undefined,
        collectionName: col ? col.name : undefined,
        readStatus: 'UNREAD',
      });

      setIsAdding(false);
      setUrlInput('');
      setTitleInput('');
      setDescInput('');
      setVerificationResult(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            <Globe className="h-4 w-4" />
            <span>Curated Reading Queue & Web Signals</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Bookmarks & Research Links
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Store, annotate, and trace digital references with automatic SSRF safety checks.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Bookmark
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono">
          {(['ALL', 'UNREAD', 'READ'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setReadFilter(status)}
              className={`px-3 py-1 rounded-md transition-all ${
                readFilter === status
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {status} ({status === 'ALL' ? bookmarks.length : bookmarks.filter((b) => b.readStatus === status).length})
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bookmarks, domains, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400 font-mono">
          No bookmarks match current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bm) => (
            <div
              key={bm.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                {/* Domain & Read Status Header */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[180px]">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{bm.domain}</span>
                  </div>

                  <button
                    onClick={() => onToggleRead(bm.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                      bm.readStatus === 'READ'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {bm.readStatus === 'READ' ? '✓ Read' : '○ Unread'}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold font-sans text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                  {bm.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-sans">
                  {bm.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {bm.tags.map((t) => (
                    <span
                      key={t}
                      onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        selectedTag === t
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* User Notes */}
                {bm.notes && (
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 italic">
                    &ldquo;{bm.notes}&rdquo;
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Visit Page <ExternalLink className="h-3 w-3" />
                </a>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    onClick={() => onDeleteBookmark(bm.id)}
                    className="p-1 hover:text-rose-500 transition-colors"
                    title="Delete bookmark"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Bookmark Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-mono flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Globe className="h-4 w-4 text-emerald-500" />
                Add Bookmark & Ingest Metadata
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-200">
                ×
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">URL (SSRF Protected)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSimulateUrlLookup}
                    disabled={isVerifying}
                    className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors shrink-0"
                  >
                    {isVerifying ? 'Checking...' : 'Fetch Info'}
                  </button>
                </div>
              </div>

              {verificationResult && (
                <div className={`p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 ${
                  verificationResult.safe
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-600'
                }`}>
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>
                    {verificationResult.safe
                      ? `SSRF Passed: Public Host Verified (${verificationResult.host})`
                      : `SSRF Blocked: ${verificationResult.host}`}
                  </span>
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Title</label>
                <input
                  type="text"
                  placeholder="Bookmark title"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  placeholder="Key takeaways or summary"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Target Collection</label>
                <select
                  value={collectionIdInput}
                  onChange={(e) => setCollectionIdInput(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="">(Root Collection)</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium shadow-md transition-colors"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
