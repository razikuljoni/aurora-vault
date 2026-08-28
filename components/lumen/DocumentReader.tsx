import React, { useState } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Highlighter,
  Search,
  ZoomIn,
  ZoomOut,
  Tag,
  Link2,
  Bookmark,
  MessageSquare,
  Sparkles,
  Download,
} from 'lucide-react';
import { DocumentItem, DocumentHighlight } from '@/lib/types';
import { EvidenceCard } from './SourceBadge';

interface DocumentReaderProps {
  document: DocumentItem;
  initialPage?: number;
  onAddHighlight: (highlight: Omit<DocumentHighlight, 'id' | 'createdAt' | 'createdBy'>) => void;
  onOpenNote?: (noteId: string) => void;
  className?: string;
}

export const DocumentReader: React.FC<DocumentReaderProps> = ({
  document,
  initialPage = 1,
  onAddHighlight,
  onOpenNote,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [highlightColor, setHighlightColor] = useState<'amber' | 'emerald' | 'sky' | 'purple' | 'rose'>('emerald');
  const [highlightComment, setHighlightComment] = useState('');

  const activePageData = document.pages.find((p) => p.pageNumber === currentPage) || {
    pageNumber: currentPage,
    text: document.extractedText,
  };

  const pageHighlights = document.highlights.filter((h) => h.page === currentPage);

  // Handle Mouse Selection for Highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      setSelectedText(selection.toString().trim());
      setShowHighlightModal(true);
    }
  };

  const handleSaveHighlight = () => {
    if (!selectedText) return;
    onAddHighlight({
      documentId: document.id,
      page: currentPage,
      startOffset: 0,
      endOffset: selectedText.length,
      selectedText,
      color: highlightColor,
      comment: highlightComment.trim() || undefined,
    });
    setShowHighlightModal(false);
    setSelectedText('');
    setHighlightComment('');
  };

  const colorPills: { key: 'amber' | 'emerald' | 'sky' | 'purple' | 'rose'; color: string; label: string }[] = [
    { key: 'emerald', color: 'bg-emerald-500', label: 'Evidence' },
    { key: 'sky', color: 'bg-sky-500', label: 'Definition' },
    { key: 'amber', color: 'bg-amber-500', label: 'Key Finding' },
    { key: 'purple', color: 'bg-purple-500', label: 'Theory' },
    { key: 'rose', color: 'bg-rose-500', label: 'Critical' },
  ];

  return (
    <div className={`flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 text-slate-100 overflow-hidden ${className}`}>
      {/* Top Document Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-xs font-mono">
        {/* Document Title */}
        <div className="flex items-center gap-2 truncate max-w-md">
          <FileText className="h-4 w-4 text-rose-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{document.title}</span>
          <span className="text-slate-500 text-[10px]">({(document.fileSize / 1024 / 1024).toFixed(2)} MB)</span>
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center gap-3">
          {/* Search inside doc */}
          <div className="relative flex items-center">
            <Search className="h-3 w-3 text-slate-500 absolute left-2" />
            <input
              type="text"
              placeholder="Find in page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-7 pr-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-200 w-32 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="h-3.5 w-px bg-slate-800" />

          {/* Page Pagination */}
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-slate-300 px-1">
              Page <strong>{currentPage}</strong> of {document.pageCount}
            </span>
            <button
              disabled={currentPage >= document.pageCount}
              onClick={() => setCurrentPage((p) => Math.min(document.pageCount, p + 1))}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-3.5 w-px bg-slate-800" />

          {/* Zoom */}
          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setZoom((z) => Math.max(70, z - 10))}
              className="p-1 hover:bg-slate-800 rounded"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-slate-800 rounded"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Viewport: Split Document Page + Highlights Rail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Page Canvas */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-950/60 flex justify-center">
          <div
            onMouseUp={handleMouseUp}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[800px] min-h-[600px] bg-slate-900 border border-slate-800 rounded-lg p-10 shadow-2xl text-slate-200 font-serif leading-relaxed transition-transform"
          >
            {/* Page Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
              <span>{document.fileName}</span>
              <span>Page {currentPage}</span>
            </div>

            {/* Document Text Body with Highlight Overlay */}
            <div className="whitespace-pre-wrap text-sm leading-loose selection:bg-sky-500/30 selection:text-sky-200">
              {activePageData.text}
            </div>

            {/* Page Footer */}
            <div className="mt-12 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>Aurora Vault Document Processor v2.4</span>
              <span>Extracted via BullMQ Pipeline</span>
            </div>
          </div>
        </div>

        {/* Right Highlights & Citations Panel */}
        <div className="w-80 border-l border-slate-800 bg-slate-950 p-4 flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Highlighter className="h-3.5 w-3.5 text-emerald-400" />
              Document Highlights ({document.highlights.length})
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-sans mb-3">
            Select any text inside the document page to create a highlighted evidence card.
          </p>

          <div className="space-y-3">
            {document.highlights.map((hl) => (
              <EvidenceCard
                key={hl.id}
                quote={hl.selectedText}
                sourceTitle={document.title}
                sourceType="DOCUMENT"
                pageNumber={hl.page}
                color={hl.color}
                comment={hl.comment}
                onOpenSource={() => setCurrentPage(hl.page)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Highlight Creator Modal */}
      {showHighlightModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold font-mono flex items-center gap-1.5 text-slate-200">
                <Highlighter className="h-4 w-4 text-emerald-400" /> Create Evidence Citation
              </h4>
              <span className="text-[11px] font-mono text-slate-500">Page {currentPage}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs italic font-serif text-slate-300 max-h-28 overflow-y-auto">
              "{selectedText}"
            </div>

            {/* Color Tagging */}
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1.5 block">Category / Color</label>
              <div className="flex items-center gap-2">
                {colorPills.map((cp) => (
                  <button
                    key={cp.key}
                    onClick={() => setHighlightColor(cp.key)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border transition-all ${
                      highlightColor === cp.key
                        ? 'border-white text-white bg-slate-800'
                        : 'border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${cp.color}`} />
                    <span>{cp.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Comment */}
            <div>
              <label className="text-xs font-mono text-slate-400 mb-1 block">Research Annotation</label>
              <input
                type="text"
                placeholder="Add synthesis comment or reason for citation..."
                value={highlightComment}
                onChange={(e) => setHighlightComment(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowHighlightModal(false);
                  setSelectedText('');
                }}
                className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHighlight}
                className="px-4 py-1.5 text-xs font-mono font-medium rounded-lg bg-sky-600 hover:bg-sky-500 text-white shadow-md transition-colors"
              >
                Save Evidence Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
