import React, { useState } from 'react';
import {
  Files,
  Upload,
  Search,
  Plus,
  FileText,
  Highlighter,
  CheckCircle,
  Clock,
  Tag,
  Folder,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { DocumentItem, DocumentHighlight, Collection } from '@/lib/types';
import { DocumentReader } from '../lumen/DocumentReader';
import { LumenCard } from '../lumen/LumenCard';

interface DocumentsViewProps {
  documents: DocumentItem[];
  collections: Collection[];
  activeDocId: string | null;
  onSelectDoc: (docId: string) => void;
  onUploadDoc: (data: Partial<DocumentItem>) => void;
  onAddHighlight: (docId: string, highlight: Omit<DocumentHighlight, 'id' | 'createdAt' | 'createdBy'>) => void;
  onOpenNote?: (noteId: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  collections,
  activeDocId,
  onSelectDoc,
  onUploadDoc,
  onAddHighlight,
  onOpenNote,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [uploadTags, setUploadTags] = useState('research, whitepaper');
  const [uploadColId, setUploadColId] = useState('');

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0] || null;

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim()) return;

    onUploadDoc({
      title: uploadTitle.trim(),
      fileName: `${uploadTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
      extractedText: uploadText.trim(),
      tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
      collectionId: uploadColId || undefined,
      pages: [
        { pageNumber: 1, text: uploadText.substring(0, 500) },
        { pageNumber: 2, text: uploadText.substring(500) || 'Continuation of extracted findings...' },
      ],
      pageCount: 2,
      summary: uploadText.substring(0, 160) + '...',
    });

    setIsUploading(false);
    setUploadTitle('');
    setUploadText('');
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Column 1: Document List (Width: 320px) */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md flex flex-col shrink-0 h-1/3 md:h-full">
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            <Files className="h-4 w-4 text-rose-500" />
            <span>Documents ({documents.length})</span>
          </div>
          <button
            onClick={() => setIsUploading(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-medium shadow-xs transition-colors"
          >
            <Upload className="h-3.5 w-3.5" /> Ingest PDF
          </button>
        </div>

        {/* List of Documents */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {documents.map((doc) => {
            const isActive = activeDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`rounded-lg p-3 border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-500/40 shadow-xs'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <FileText className={`h-4 w-4 shrink-0 mt-0.5 ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-xs font-semibold font-sans leading-snug line-clamp-2 ${
                      isActive ? 'text-rose-900 dark:text-rose-300' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {doc.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{doc.pageCount} pages</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {doc.highlights.length} highlights
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Column 2: Document Reader Viewport (Center) */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        {activeDoc ? (
          <DocumentReader
            key={activeDoc.id}
            document={activeDoc}
            onAddHighlight={(hl) => onAddHighlight(activeDoc.id, hl)}
            onOpenNote={onOpenNote}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
            <Files className="h-8 w-8 mb-2 opacity-30" />
            <p>No document selected. Upload or select a PDF to begin research synthesis.</p>
          </div>
        )}
      </div>

      {/* Ingest PDF Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-mono flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Upload className="h-4 w-4 text-rose-500" />
                Ingest PDF / Document Text Pipeline
              </h3>
              <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-slate-200">
                ×
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Asynchronous Consensus & Vector Indexing Benchmarks"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Target Collection</label>
                <select
                  value={uploadColId}
                  onChange={(e) => setUploadColId(e.target.value)}
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
                <label className="text-xs font-mono text-slate-500 mb-1 block">
                  Document Content (Extracted Text via BullMQ Worker simulation)
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste research paper, PDF text, or whitepaper contents..."
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  className="w-full text-xs font-serif bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-rose-500 resize-none leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-medium shadow-md transition-colors"
                >
                  Process & Index Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
