import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  ChevronDown,
  Sparkles,
  Link2,
  Calendar,
  FlaskConical,
  Kanban,
  FileCode,
  Sun,
  LayoutTemplate,
} from 'lucide-react';
import { Note, Collection, NoteVersion, Backlink, DocumentHighlight, DocumentItem, NoteTemplate } from '@/lib/types';
import { NOTE_TEMPLATES } from '@/lib/templates';
import { NoteEditor } from '../lumen/NoteEditor';
import { ContextRail } from '../lumen/ContextRail';

interface NotesViewProps {
  notes: Note[];
  documents?: DocumentItem[];
  collections: Collection[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onCreateNote: (template?: Partial<Note> | NoteTemplate) => void;
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
  documents = [],
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
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const templateMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target as Node)) {
        setIsTemplateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTemplateIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Calendar':
      case 'Clock':
        return <Calendar className="h-4 w-4 text-emerald-500" />;
      case 'FlaskConical':
      case 'BookOpen':
        return <FlaskConical className="h-4 w-4 text-purple-500" />;
      case 'Kanban':
      case 'Users':
        return <Kanban className="h-4 w-4 text-blue-500" />;
      case 'FileCode':
      case 'Cpu':
        return <FileCode className="h-4 w-4 text-amber-500" />;
      case 'Sun':
        return <Sun className="h-4 w-4 text-orange-500" />;
      case 'Sparkles':
        return <Sparkles className="h-4 w-4 text-sky-500" />;
      default:
        return <FileText className="h-4 w-4 text-sky-500" />;
    }
  };

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

            {/* Split New Button with Template Picker Dropdown */}
            <div className="relative inline-flex rounded-lg shadow-xs" ref={templateMenuRef}>
              <button
                onClick={() => onCreateNote()}
                className="flex items-center gap-1 pl-2.5 pr-2 py-1 rounded-l-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> New
              </button>
              <button
                onClick={() => setIsTemplateMenuOpen((prev) => !prev)}
                className="px-1.5 py-1 rounded-r-lg bg-sky-700 hover:bg-sky-600 text-white text-xs transition-colors border-l border-sky-500 cursor-pointer"
                title="Create from template"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {/* Template Selection Dropdown */}
              {isTemplateMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <LayoutTemplate className="h-3.5 w-3.5 text-sky-500" />
                    <span>Choose a Note Template</span>
                  </div>

                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {NOTE_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => {
                          onCreateNote(tmpl);
                          setIsTemplateMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-start gap-2.5 cursor-pointer group"
                      >
                        <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 shrink-0 mt-0.5">
                          {getTemplateIcon(tmpl.icon)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold font-sans text-slate-800 dark:text-slate-200">
                              {tmpl.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                              {tmpl.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {tmpl.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shrink-0 cursor-pointer"
              >
                Clear Filters ×
              </button>
            )}
            {allTags.slice(0, 5).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                className={`px-2 py-0.5 rounded border shrink-0 transition-colors cursor-pointer ${
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
            notes={notes}
            documents={documents}
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
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs max-w-lg mx-auto text-center p-6 space-y-4">
            <LayoutTemplate className="h-10 w-10 opacity-30 text-sky-500" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300 font-sans">
                Create a Note from Template
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Choose a structured format to jumpstart your synthesis or start with a clean slate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full pt-2">
              {NOTE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => onCreateNote(tmpl)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-500/50 dark:hover:border-sky-500/50 text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {getTemplateIcon(tmpl.icon)}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs font-sans">
                      {tmpl.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2">
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
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

