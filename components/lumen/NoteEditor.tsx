import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Clock,
  Eye,
  Edit3,
  Tag,
  Folder,
  Link2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Pin,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Note, Collection, NoteVersion } from '@/lib/types';

interface NoteEditorProps {
  note: Note;
  collections: Collection[];
  onSave: (updates: Partial<Note>) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onOpenBacklink?: (title: string) => void;
  className?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  collections,
  onSave,
  onDelete,
  onTogglePin,
  onOpenBacklink,
  className = '',
}) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [collectionId, setCollectionId] = useState(note.collectionId || '');
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING' | 'IDLE'>('SAVED');
  const [lastSavedAt, setLastSavedAt] = useState<Date>(new Date(note.updatedAt));

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced Autosave (800ms)
  const triggerAutosave = (newTitle: string, newContent: string, newTags: string[], newColId: string) => {
    setSaveStatus('SAVING');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      onSave({
        title: newTitle,
        content: newContent,
        tags: newTags,
        collectionId: newColId || undefined,
      });
      setSaveStatus('SAVED');
      setLastSavedAt(new Date());
    }, 800);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutosave(val, content, tags, collectionId);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    triggerAutosave(title, val, tags, collectionId);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (!tags.includes(clean)) {
        const nextTags = [...tags, clean];
        setTags(nextTags);
        triggerAutosave(title, content, nextTags, collectionId);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const nextTags = tags.filter((t) => t !== tagToRemove);
    setTags(nextTags);
    triggerAutosave(title, content, nextTags, collectionId);
  };

  const handleCollectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCollectionId(val);
    triggerAutosave(title, content, tags, val);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Render markdown with clickable [[Backlinks]]
  const renderMarkdownPreview = (text: string) => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const linkTitle = part.slice(2, -2);
        return (
          <button
            key={index}
            onClick={() => onOpenBacklink?.(linkTitle)}
            className="inline-flex items-center gap-1 font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 hover:underline cursor-pointer mx-0.5 text-sm"
          >
            <Link2 className="h-3 w-3" />
            <span>{linkTitle}</span>
          </button>
        );
      }

      if (part.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold text-slate-900 dark:text-slate-100 my-4 font-serif">
            {part.replace(/^# /, '')}
          </h1>
        );
      }

      if (part.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-slate-900 dark:text-slate-100 my-3 font-serif">
            {part.replace(/^## /, '')}
          </h2>
        );
      }

      if (part.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-slate-900 dark:text-slate-100 my-2 font-serif">
            {part.replace(/^### /, '')}
          </h3>
        );
      }

      if (part.startsWith('```')) {
        return (
          <pre key={index} className="p-3 my-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
            {part.replace(/```[a-z]*\n?/g, '')}
          </pre>
        );
      }

      return (
        <p key={index} className="my-2 leading-relaxed text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap">
          {part}
        </p>
      );
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          {/* Collection Picker */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Folder className="h-3.5 w-3.5 text-amber-500" />
            <select
              value={collectionId}
              onChange={handleCollectionChange}
              className="bg-transparent border-0 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:ring-0 cursor-pointer pr-4"
            >
              <option value="">(No Collection)</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-300 dark:text-slate-700 select-none">•</span>

          {/* Autosave Status */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            {saveStatus === 'SAVING' ? (
              <span className="text-amber-500 animate-pulse flex items-center gap-1">
                <Clock className="h-3 w-3" /> Saving revision...
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Saved ({lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-xs font-mono">
            <button
              onClick={() => setIsPreview(false)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                !isPreview
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="h-3 w-3" /> Write
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                isPreview
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="h-3 w-3" /> Preview
            </button>
          </div>

          {onTogglePin && (
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                note.pinned
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              title="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {/* Title Field */}
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled Note..."
          className="w-full text-2xl md:text-3xl font-bold font-serif text-slate-900 dark:text-slate-100 bg-transparent border-0 border-b border-transparent focus:border-slate-200 dark:focus:border-slate-800 focus:outline-hidden pb-2"
        />

        {/* Tags Bar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag className="h-3.5 w-3.5 text-slate-400" />
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono"
            >
              #{t}
              <button
                onClick={() => handleRemoveTag(t)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="+ tag (Enter)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="text-xs font-mono bg-transparent border-0 text-slate-600 dark:text-slate-300 focus:outline-hidden placeholder:text-slate-400 w-24"
          />
        </div>

        {/* Content Area (Write vs Preview) */}
        {!isPreview ? (
          <div className="relative">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Write your thoughts in Markdown. Type [[Note Name]] to insert connected knowledge backlinks..."
              className="w-full min-h-[420px] bg-transparent text-slate-800 dark:text-slate-200 font-sans text-sm leading-relaxed resize-none focus:outline-hidden"
            />
          </div>
        ) : (
          <div className="min-h-[420px] max-w-[68ch] mx-auto prose dark:prose-invert">
            {renderMarkdownPreview(content)}
          </div>
        )}
      </div>

      {/* Editor Footer / Metadata Strip */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>~{readingTime} min read</span>
          <span>•</span>
          <span>Format: Markdown / [[Backlinks]]</span>
        </div>
        <div className="text-slate-400">
          Tip: Insert <code className="text-sky-500 bg-sky-50 dark:bg-sky-950/50 px-1 py-0.5 rounded">[[Title]]</code> to establish live bi-directional links
        </div>
      </div>
    </div>
  );
};
