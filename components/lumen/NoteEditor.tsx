import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  FileText,
  Files,
  Search,
  Sparkles,
  CornerDownLeft,
  Maximize,
  Minimize,
  Table,
  Download,
} from 'lucide-react';
import { Note, Collection, NoteVersion, DocumentItem } from '@/lib/types';

interface NoteEditorProps {
  note: Note;
  collections: Collection[];
  notes?: Note[];
  documents?: DocumentItem[];
  onSave: (updates: Partial<Note>) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onOpenBacklink?: (title: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  collections,
  notes = [],
  documents = [],
  onSave,
  onDelete,
  onTogglePin,
  onOpenBacklink,
  isFullscreen = false,
  onToggleFullscreen,
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

  // Wikilink [[ Auto-suggest State
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestQuery, setSuggestQuery] = useState('');
  const [linkStartIndex, setLinkStartIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pdfExportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter notes for auto-suggest
  const matchingNotes = notes
    .filter((n) => n.id !== note.id && n.title.toLowerCase().includes(suggestQuery.toLowerCase()))
    .slice(0, 6);

  const handleDownloadPDF = async () => {
    if (!pdfExportRef.current) return;
    setIsExporting(true);

    try {
      // Dynamically import client-only libraries to prevent SSR build errors
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = pdfExportRef.current;
      element.style.display = 'block'; // Make visible for html2canvas

      const canvas = await html2canvas(element, {
        useCORS: true,
        logging: false,
        background: '#ffffff', // Force white background for PDF
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title || 'Untitled Note'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      if (pdfExportRef.current) {
        pdfExportRef.current.style.display = 'none';
      }
      setIsExporting(false);
    }
  };

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
    }, 1000);
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

    // Detect [[ wikilink pattern
    const cursor = e.target.selectionStart;
    const textBeforeCursor = val.slice(0, cursor);
    const lastOpenBracket = textBeforeCursor.lastIndexOf('[[');

    if (lastOpenBracket !== -1) {
      const textAfterOpen = textBeforeCursor.slice(lastOpenBracket + 2);
      // Check if there are no closing brackets or line breaks between [[ and cursor
      if (!textAfterOpen.includes(']]') && !textAfterOpen.includes('\n')) {
        setSuggestQuery(textAfterOpen);
        setLinkStartIndex(lastOpenBracket);
        setShowSuggestions(true);
        setSelectedIndex(0);
        return;
      }
    }

    setShowSuggestions(false);
  };

  const applySuggestion = (selectedTitle: string) => {
    if (!selectedTitle) return;

    const textarea = textareaRef.current;
    const before = content.slice(0, linkStartIndex);
    const cursor = textarea?.selectionStart || content.length;

    let after = content.slice(cursor);
    if (after.startsWith(']]')) {
      after = after.slice(2);
    }

    const newContent = `${before}[[${selectedTitle}]] ${after}`;
    setContent(newContent);
    triggerAutosave(title, newContent, tags, collectionId);
    setShowSuggestions(false);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newPos = before.length + selectedTitle.length + 5; // length of `[[${selectedTitle}]] `
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 20);
  };

  const insertMarkdownTable = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const cursor = textarea.selectionStart;
    const before = content.slice(0, cursor);
    const after = content.slice(cursor);
    
    const tableTemplate = `\n| Header 1 | Header 2 | Header 3 |\n| :--- | :--- | :--- |\n| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |\n| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |\n\n`;
    
    const newContent = `${before}${tableTemplate}${after}`;
    setContent(newContent);
    triggerAutosave(title, newContent, tags, collectionId);
    
    setTimeout(() => {
      textarea.focus();
      const newPos = cursor + tableTemplate.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 20);
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      const totalOptions = matchingNotes.length + (suggestQuery.trim() ? 1 : 0);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalOptions));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + Math.max(1, totalOptions)) % Math.max(1, totalOptions));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (selectedIndex < matchingNotes.length) {
          applySuggestion(matchingNotes[selectedIndex].title);
        } else if (suggestQuery.trim()) {
          applySuggestion(suggestQuery.trim());
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }
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

  // Render markdown with clickable [[Backlinks]] and syntax highlighting
  const renderMarkdownPreview = (text: string) => {
    // Pre-process wikilinks to markdown links
    const processedText = text.replace(/\[\[(.*?)\]\]/g, '[$1](wikilink:$1)');

    return (
      <div className="markdown-body">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              if (href?.startsWith('wikilink:')) {
                const linkTitle = decodeURIComponent(href.replace('wikilink:', ''));
                return (
                  <button
                    type="button"
                    onClick={() => onOpenBacklink?.(linkTitle)}
                    className="inline-flex items-center gap-1 font-mono text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800 hover:underline cursor-pointer mx-0.5 text-sm"
                  >
                    <Link2 className="h-3 w-3" />
                    <span>{linkTitle}</span>
                  </button>
                );
              }
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline" {...props}>
                  {children}
                </a>
              );
            },
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              return match ? (
                <SyntaxHighlighter
                  {...(rest as any)}
                  PreTag="div"
                  language={match[1]}
                  style={vscDarkPlus as any}
                  className="rounded-lg text-xs"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={`${className || ''} bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono`}>
                  {children}
                </code>
              );
            },
          }}
        >
          {processedText}
        </Markdown>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 relative ${className}`}>
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
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                !isPreview
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Edit3 className="h-3 w-3" /> Write
            </button>
            <button
              onClick={() => setIsPreview(true)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                isPreview
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="h-3 w-3" /> Preview
            </button>
          </div>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-sky-500/10 text-sky-600 border-sky-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
            </button>
          )}

          {onTogglePin && (
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                note.pinned
                  ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              <Pin className="h-3.5 w-3.5" />
            </button>
          )}

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={`p-1.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer ${
              isExporting
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title="Download as PDF"
          >
            <Download className={`h-3.5 w-3.5 ${isExporting ? 'animate-pulse' : ''}`} />
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 relative">
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
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5 cursor-pointer"
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
          <div className="relative flex flex-col flex-1 min-h-[420px]">
            {/* Formatting Toolbar */}
            <div className="flex items-center gap-1 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={insertMarkdownTable}
                className="p-1.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Insert Table"
              >
                <Table className="h-4 w-4" />
              </button>
            </div>
            
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Write your thoughts in Markdown. Type [[ to link existing notes..."
              className="w-full flex-1 bg-transparent text-slate-800 dark:text-slate-200 font-sans text-sm leading-relaxed resize-none focus:outline-hidden"
            />

            {/* Wikilink Auto-suggest Dropdown Popover */}
            {showSuggestions && (
              <div
                id="wikilink-suggestions-popover"
                className="absolute z-30 left-0 bottom-6 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-sky-500/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
              >
                {/* Popover Header */}
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-sky-600 dark:text-sky-400">
                    <Link2 className="h-3.5 w-3.5" />
                    <span>Link Knowledge Note</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Query: &ldquo;{suggestQuery}&rdquo;
                  </span>
                </div>

                {/* Suggestions List */}
                <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                  {matchingNotes.length > 0 ? (
                    matchingNotes.map((matchedNote, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={matchedNote.id}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => applySuggestion(matchedNote.title)}
                          className={`flex items-start justify-between gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-sky-500 text-white'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <FileText
                              className={`h-4 w-4 mt-0.5 shrink-0 ${
                                isSelected ? 'text-white' : 'text-sky-500'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold font-sans truncate">
                                {matchedNote.title}
                              </p>
                              <p
                                className={`text-[11px] truncate ${
                                  isSelected
                                    ? 'text-sky-100'
                                    : 'text-slate-500 dark:text-slate-400'
                                }`}
                              >
                                {matchedNote.content.slice(0, 60).replace(/#|\[\[|\]\]/g, '')}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end">
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {matchedNote.collectionName || 'General'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-500 font-mono">
                      No existing notes matching &ldquo;{suggestQuery}&rdquo;.
                    </div>
                  )}

                  {/* Option to create custom/new target link */}
                  {suggestQuery.trim() && (
                    <div
                      onClick={() => applySuggestion(suggestQuery.trim())}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border-t border-dashed border-slate-200 dark:border-slate-700 ${
                        selectedIndex === matchingNotes.length
                          ? 'bg-sky-500 text-white'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs font-mono">
                        Link as <strong className="font-semibold">[[{suggestQuery.trim()}]]</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Popover Keyboard Shortcuts Footer */}
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>↑↓ Navigate</span>
                  <span>↵ / Tab Insert</span>
                  <span>Esc Dismiss</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[420px] max-w-[68ch] mx-auto prose dark:prose-invert prose-code:before:hidden prose-code:after:hidden">
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
          Tip: Type <code className="text-sky-500 bg-sky-50 dark:bg-sky-950/50 px-1 py-0.5 rounded">[[</code> to auto-suggest & connect notes
        </div>
      </div>

      {/* Hidden Div for PDF Export */}
      <div 
        ref={pdfExportRef}
        style={{
          display: 'none',
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '800px',
          background: '#ffffff',
          padding: '40px',
          color: '#000000',
        }}
      >
        <h1 className="text-3xl font-bold font-serif mb-4 text-black" style={{ color: '#000000' }}>
          {title || 'Untitled Note'}
        </h1>
        {tags.length > 0 && (
          <div className="flex gap-2 mb-6">
            {tags.map((t) => (
              <span key={t} className="text-gray-500 text-sm">
                #{t}
              </span>
            ))}
          </div>
        )}
        <div className="prose max-w-none text-black prose-code:before:hidden prose-code:after:hidden">
          {renderMarkdownPreview(content)}
        </div>
      </div>
    </div>
  );
};
