import React, { useState } from 'react';
import {
  Zap,
  FileText,
  Globe,
  Code2,
  Tag,
  Folder,
  Send,
  X,
  Check,
  Mic,
  MicOff,
} from 'lucide-react';
import { InboxItemType } from '@/lib/types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: { type: InboxItemType; title: string; content: string; url?: string; tags: string[] }) => void;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const [type, setType] = useState<InboxItemType>('NOTE');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Speech Recognition reference
  const recognitionRef = React.useRef<any>(null);

  if (!isOpen) return null;

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support the Web Speech API. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setContent((prev) => (prev ? prev + ' ' + finalTranscript : finalTranscript));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim() && !url.trim()) return;

    onCapture({
      type,
      title: title.trim() || (url ? new URL(url).hostname : 'Quick Thought'),
      content: content.trim(),
      url: url.trim() || undefined,
      tags,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setTitle('');
      setContent('');
      setUrl('');
      setTags([]);
      onClose();
    }, 450);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Quick Capture to Inbox</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Type Select */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono">
          <button
            type="button"
            onClick={() => setType('NOTE')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
              type === 'NOTE' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-indigo-500" /> Note
          </button>
          <button
            type="button"
            onClick={() => setType('URL')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
              type === 'URL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Globe className="h-3.5 w-3.5 text-sky-500" /> URL
          </button>
          <button
            type="button"
            onClick={() => setType('CODE')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
              type === 'CODE' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Code2 className="h-3.5 w-3.5 text-emerald-500" /> Code
          </button>
          <button
            type="button"
            onClick={() => setType('TEXT')}
            className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
              type === 'TEXT' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs' : 'text-slate-500'
            }`}
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" /> Thought
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Title / Summary..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-sans"
              autoFocus
            />
          </div>

          {/* URL Input (if type is URL) */}
          {type === 'URL' && (
            <div>
              <input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>
          )}

          {/* Content / Snippet */}
          <div className="relative">
            <textarea
              placeholder={
                type === 'CODE'
                  ? '// Paste code snippet here...'
                  : type === 'URL'
                  ? 'Notes or why you saved this link...'
                  : 'Quick thought or draft content...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono resize-none leading-relaxed"
            />
            {type !== 'CODE' && type !== 'URL' && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`absolute bottom-3 right-3 p-1.5 rounded-full shadow-xs transition-colors cursor-pointer ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-sky-500 border border-slate-200 dark:border-slate-700'
                }`}
                title={isRecording ? 'Stop recording' : 'Start voice dictation'}
              >
                {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-mono"
              >
                #{t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((tag) => tag !== t))}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
              className="text-xs font-mono bg-transparent border-0 text-slate-600 dark:text-slate-300 focus:outline-hidden w-24 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">
              Shortcut: <kbd className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">⌘⇧Space</kbd>
            </span>
            <button
              type="submit"
              disabled={isSaved}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium text-white transition-all shadow-md ${
                isSaved ? 'bg-emerald-600' : 'bg-sky-600 hover:bg-sky-500'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Stashed in Inbox
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" /> Capture to Inbox
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
