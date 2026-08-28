import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileText,
  Globe,
  Code2,
  Folder,
  Share2,
  Plus,
  Moon,
  Sun,
  Shield,
  Download,
  Command,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { Note, DocumentItem, Bookmark, CodeSnippet, Collection } from '@/lib/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  documents: DocumentItem[];
  bookmarks: Bookmark[];
  codeSnippets: CodeSnippet[];
  collections: Collection[];
  onNavigate: (view: string, itemId?: string) => void;
  onAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  notes,
  documents,
  bookmarks,
  codeSnippets,
  collections,
  onNavigate,
  onAction,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Keydown Listener for Cmd+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onAction('OPEN_COMMAND_PALETTE');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items
  const matchedNotes = notes.filter((n) => !q || n.title.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))).slice(0, 4);
  const matchedDocs = documents.filter((d) => !q || d.title.toLowerCase().includes(q)).slice(0, 3);
  const matchedBookmarks = bookmarks.filter((b) => !q || b.title.toLowerCase().includes(q) || b.domain.toLowerCase().includes(q)).slice(0, 3);
  const matchedCode = codeSnippets.filter((c) => !q || c.title.toLowerCase().includes(q) || c.language.toLowerCase().includes(q)).slice(0, 2);

  const staticCommands = [
    { id: 'cmd_new_note', title: 'Create New Note', icon: Plus, action: () => onAction('CREATE_NOTE'), category: 'Quick Actions' },
    { id: 'cmd_upload_doc', title: 'Upload Document / PDF', icon: FileText, action: () => onAction('UPLOAD_DOC'), category: 'Quick Actions' },
    { id: 'cmd_save_bm', title: 'Save Bookmark URL', icon: Globe, action: () => onAction('SAVE_BOOKMARK'), category: 'Quick Actions' },
    { id: 'cmd_open_graph', title: 'Open Knowledge Graph', icon: Share2, action: () => { onNavigate('graph'); onClose(); }, category: 'Navigation' },
    { id: 'cmd_open_intel', title: 'Deterministic Intelligence & Health', icon: Activity, action: () => { onNavigate('intelligence'); onClose(); }, category: 'Navigation' },
    { id: 'cmd_open_audit', title: 'Security & Audit Logs', icon: Shield, action: () => { onNavigate('audit'); onClose(); }, category: 'Navigation' },
    { id: 'cmd_export_ws', title: 'Export Workspace (JSON & Markdown Archive)', icon: Download, action: () => onAction('EXPORT_WORKSPACE'), category: 'Workspace' },
  ].filter((c) => !q || c.title.toLowerCase().includes(q));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search notes, documents, bookmarks, code..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm focus:outline-hidden font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs font-mono">
          {/* Quick Commands */}
          {staticCommands.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Commands
              </div>
              <div className="space-y-0.5">
                {staticCommands.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 group text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-slate-400 group-hover:text-sky-500 transition-colors" />
                        <span className="font-medium text-xs font-sans">{cmd.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          {matchedNotes.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Notes ({matchedNotes.length})
              </div>
              <div className="space-y-0.5">
                {matchedNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onNavigate('notes', note.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-800 dark:text-slate-200 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="truncate font-sans font-medium text-xs">{note.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {note.tags?.[0] ? `#${note.tags[0]}` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {matchedDocs.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Documents ({matchedDocs.length})
              </div>
              <div className="space-y-0.5">
                {matchedDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      onNavigate('documents', doc.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-800 dark:text-slate-200 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="truncate font-sans font-medium text-xs">{doc.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {doc.highlights.length} highlights
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {matchedBookmarks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Bookmarks ({matchedBookmarks.length})
              </div>
              <div className="space-y-0.5">
                {matchedBookmarks.map((bm) => (
                  <button
                    key={bm.id}
                    onClick={() => {
                      onNavigate('bookmarks', bm.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 text-slate-800 dark:text-slate-200 group text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Globe className="h-4 w-4 text-sky-500 shrink-0" />
                      <span className="truncate font-sans font-medium text-xs">{bm.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">{bm.domain}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Search operators: <code className="text-sky-500">type:</code> <code className="text-sky-500">tag:</code> <code className="text-sky-500">domain:</code></span>
          <span>Aurora Vault Lumen Grid</span>
        </div>
      </div>
    </div>
  );
};
