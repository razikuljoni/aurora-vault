import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Pin,
  Tag,
  Folder,
  Layers,
  ChevronRight,
  Sparkles,
  Link2,
} from 'lucide-react';
import { Note, Collection, NoteVersion, Backlink, DocumentHighlight } from '@/lib/types';
import { NoteEditor } from '../lumen/NoteEditor';
import { ContextRail } from '../lumen/ContextRail';

interface NotesViewProps {
  notes: Note[];
  collections: Collection[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onSaveNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  getBacklinks: (noteId: string) => Backlink[];
  getVersions: (noteId: string) => NoteVersion[];
  getHighlights: (noteId: string) => DocumentHighlight[];
  onRestoreVersion: (noteId: string, versionId: string) => void;
  onOpenDocument: (docId: string, page?: number) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  collections,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onSaveNote,
  onDeleteNote,
  onTogglePin,
  getBacklinks,
  getVersions,
  getHighlights,
  onRestoreVersion,
  onOpenDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCol, setSelectedCol] = useState<string | null>(null);
  const [showContextRail, setShowContextRail] = useState(true);

  // All unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const n of notes) {
      for (const t of n.tags) set.add(t);
    }
    return Array.from(set);
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      if (selectedTag && !note.tags.includes(selectedTag)) return false;
      if (selectedCol && note.collectionId !== selectedCol) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [notes, selectedTag, selectedCol, searchQuery]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0] || null;
  const activeBacklinks = activeNote ? getBacklinks(activeNote.id) : [];
  const activeVersions = activeNote ? getVersions(activeNote.id) : [];
  const activeHighlights = activeNote ? getHighlights(activeNote.id) : [];
  const activeCollection = activeNote ? collections.find((c) => c.id === activeNote.collectionId) : null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Column 1: Notes List Panel (Width: 320px) */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col shrink-0">
        {/* Search & Actions Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-sky-500" />
              <span>Notes ({filteredNotes.length})</span>
            </div>
            <button
              onClick={onCreateNote}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> New
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter notes & tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono"
            />
          </div>

          {/* Filter Pills (Tags & Collections) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
            {(selectedTag || selectedCol) && (
              <button
                onClick={() => {
                  setSelectedTag(null);
                  setSelectedCol(null);
                }}
                className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0"
              >
                Clear Filters ×
              </button>
            )}
            {allTags.slice(0, 5).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`px-2 py-0.5 rounded border shrink-0 transition-colors ${
                  selectedTag === t
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                #{t}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-mono">
              No notes matched your filter.
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = activeNote?.id === note.id;
              const blCount = getBacklinks(note.id).length;
              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className={`group rounded-lg p-3 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-500/40 shadow-xs'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      className={`text-xs font-semibold font-sans leading-snug line-clamp-2 ${
                        isActive ? 'text-sky-900 dark:text-sky-300' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {note.title}
                    </h4>
                    {note.pinned && <Pin className="h-3 w-3 text-amber-500 shrink-0 mt-0.5" />}
                  </div>

                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 font-sans">
                    {note.content.substring(0, 90).replace(/#|\[\[|\]\]/g, '')}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="truncate max-w-[120px]">
                      {note.collectionName || 'General'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {blCount > 0 && (
                        <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400">
                          <Link2 className="h-2.5 w-2.5" />
                          {blCount}
                        </span>
                      )}
                      <span>v{note.versionCount}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 2: Note Editor / Focus Reader (Center) */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        {activeNote ? (
          <NoteEditor
            key={activeNote.id}
            note={activeNote}
            collections={collections}
            onSave={(updates) => onSaveNote(activeNote.id, updates)}
            onDelete={onDeleteNote}
            onTogglePin={onTogglePin}
            onOpenBacklink={(linkTitle) => {
              const matched = notes.find((n) => n.title.toLowerCase() === linkTitle.toLowerCase());
              if (matched) onSelectNote(matched.id);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
            <FileText className="h-8 w-8 mb-2 opacity-30" />
            <p>No note selected. Click New to author your first knowledge note.</p>
          </div>
        )}
      </div>

      {/* Column 3: Context Rail (Width: 320px) */}
      {showContextRail && (
        <div className="w-80 shrink-0 hidden xl:block">
          <ContextRail
            note={activeNote}
            backlinks={activeBacklinks}
            versions={activeVersions}
            highlights={activeHighlights}
            collection={activeCollection}
            onSelectNote={onSelectNote}
            onRestoreVersion={(verId) => activeNote && onRestoreVersion(activeNote.id, verId)}
            onOpenDocument={onOpenDocument}
          />
        </div>
      )}
    </div>
  );
};
