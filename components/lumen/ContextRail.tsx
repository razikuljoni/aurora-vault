import React, { useState } from 'react';
import {
  Link2,
  FileText,
  Clock,
  History,
  RotateCcw,
  Tag,
  Folder,
  Layers,
  ChevronRight,
  ExternalLink,
  GitBranch,
} from 'lucide-react';
import { Note, NoteVersion, Backlink, DocumentHighlight, Collection } from '@/lib/types';
import { EvidenceCard } from './SourceBadge';

interface ContextRailProps {
  note?: Note | null;
  backlinks?: Backlink[];
  versions?: NoteVersion[];
  highlights?: DocumentHighlight[];
  collection?: Collection | null;
  onSelectNote?: (noteId: string) => void;
  onRestoreVersion?: (versionId: string) => void;
  onOpenDocument?: (docId: string, page?: number) => void;
  className?: string;
}

export const ContextRail: React.FC<ContextRailProps> = ({
  note,
  backlinks = [],
  versions = [],
  highlights = [],
  collection,
  onSelectNote,
  onRestoreVersion,
  onOpenDocument,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'backlinks' | 'evidence' | 'versions' | 'meta'>('backlinks');
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null);

  if (!note) {
    return (
      <div className={`p-6 text-center text-slate-400 dark:text-slate-500 text-xs font-mono ${className}`}>
        <GitBranch className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>Select a note or resource to inspect relationship graph and context rails.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 ${className}`}>
      {/* Context Rail Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Layers className="h-3.5 w-3.5 text-sky-500" />
            <span>Context Rail</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            {backlinks.length} backlinks
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="mt-2.5 grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800/80 text-[11px] font-medium font-mono text-slate-600 dark:text-slate-400">
          <button
            onClick={() => setActiveTab('backlinks')}
            className={`py-1 rounded text-center transition-all ${
              activeTab === 'backlinks'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Links ({backlinks.length})
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-1 rounded text-center transition-all ${
              activeTab === 'evidence'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Evidence ({highlights.length})
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`py-1 rounded text-center transition-all ${
              activeTab === 'versions'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            History ({versions.length})
          </button>
          <button
            onClick={() => setActiveTab('meta')}
            className={`py-1 rounded text-center transition-all ${
              activeTab === 'meta'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Meta
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Backlinks Tab */}
        {activeTab === 'backlinks' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Referenced by ({backlinks.length} Notes)
            </div>

            {backlinks.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-400">
                No inbound backlinks yet. Link this note from other notes using{' '}
                <code className="font-mono text-sky-500">[[{note.title}]]</code>.
              </div>
            ) : (
              backlinks.map((bl) => (
                <div
                  key={bl.id}
                  onClick={() => onSelectNote?.(bl.sourceId)}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 hover:border-sky-500/40 hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Link2 className="h-3 w-3 text-sky-500 shrink-0" />
                      <span className="truncate">{bl.sourceTitle}</span>
                    </div>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded">
                    &ldquo;{bl.contextSnippet}&rdquo;
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Evidence & Highlights Tab */}
        {activeTab === 'evidence' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Citing Documents & Highlights ({highlights.length})
            </div>

            {highlights.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-400">
                No highlights linked directly to this note. Highlight text inside any uploaded PDF to attach evidence.
              </div>
            ) : (
              highlights.map((hl) => (
                <EvidenceCard
                  key={hl.id}
                  quote={hl.selectedText}
                  sourceTitle="Whitepaper / Research PDF"
                  sourceType="DOCUMENT"
                  pageNumber={hl.page}
                  color={hl.color}
                  comment={hl.comment}
                  onOpenSource={() => onOpenDocument?.(hl.documentId, hl.page)}
                />
              ))
            )}
          </div>
        )}

        {/* Version History Tab */}
        {activeTab === 'versions' && (
          <div className="space-y-3">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Immutable Revisions ({versions.length})
            </div>

            <div className="space-y-2">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className={`rounded-lg border p-3 transition-all ${
                    selectedVersion?.id === ver.id
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                      <History className="h-3.5 w-3.5 text-slate-400" />
                      <span>Revision v{ver.versionNumber}</span>
                    </div>
                    {ver.versionNumber === note.versionCount ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Current
                      </span>
                    ) : (
                      <button
                        onClick={() => onRestoreVersion?.(ver.id)}
                        className="flex items-center gap-1 text-[11px] font-mono text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </button>
                    )}
                  </div>
                  {ver.summary && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {ver.summary}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                    <span>{ver.createdBy}</span>
                    <span>{new Date(ver.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata & Taxonomy Tab */}
        {activeTab === 'meta' && (
          <div className="space-y-4 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div>
              <div className="text-slate-400 uppercase text-[10px] mb-1">Collection</div>
              <div className="flex items-center gap-1.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                <Folder className="h-3.5 w-3.5 text-amber-500" />
                <span>{collection ? collection.name : 'Unassigned (Root)'}</span>
              </div>
            </div>

            <div>
              <div className="text-slate-400 uppercase text-[10px] mb-1.5">Tags</div>
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span>Words</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{note.wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Time</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">~{note.readingTimeMinutes} min</span>
              </div>
              <div className="flex justify-between">
                <span>Created By</span>
                <span className="text-slate-800 dark:text-slate-300">{note.authorName}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Modified</span>
                <span>{new Date(note.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
