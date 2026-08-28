import React from 'react';
import { Globe, FileText, Bookmark, Code2, Folder, Network, ArrowUpRight } from 'lucide-react';
import { NodeType } from '@/lib/types';

interface SourceBadgeProps {
  type: NodeType | 'URL' | 'PDF' | 'GITHUB';
  label: string;
  sublabel?: string;
  url?: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({
  type,
  label,
  sublabel,
  url,
  className = '',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'DOCUMENT':
      case 'PDF':
        return <FileText className="h-3.5 w-3.5 text-rose-500" />;
      case 'BOOKMARK':
      case 'URL':
        return <Globe className="h-3.5 w-3.5 text-sky-500" />;
      case 'CODE':
      case 'GITHUB':
        return <Code2 className="h-3.5 w-3.5 text-emerald-500" />;
      case 'COLLECTION':
        return <Folder className="h-3.5 w-3.5 text-amber-500" />;
      case 'NOTE':
        return <FileText className="h-3.5 w-3.5 text-indigo-500" />;
      default:
        return <Network className="h-3.5 w-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-xs text-slate-700 dark:text-slate-300 font-mono ${className}`}
    >
      {getIcon()}
      <span className="font-medium truncate max-w-[180px]">{label}</span>
      {sublabel && <span className="text-slate-400 dark:text-slate-500 text-[10px]">({sublabel})</span>}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-sky-500 transition-colors ml-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
    </div>
  );
};

interface InsightStripProps {
  items: { label: string; value: string | number; icon?: React.ReactNode }[];
  className?: string;
}

export const InsightStrip: React.FC<InsightStripProps> = ({ items, className = '' }) => {
  return (
    <div
      className={`flex items-center gap-4 py-2 px-3 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono ${className}`}
    >
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <div className="flex items-center gap-1.5">
            {item.icon}
            <span className="font-semibold text-slate-900 dark:text-slate-200">{item.value}</span>
            <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
          </div>
          {idx < items.length - 1 && (
            <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

interface EvidenceCardProps {
  id?: string;
  quote: string;
  sourceTitle: string;
  sourceType: 'DOCUMENT' | 'BOOKMARK';
  pageNumber?: number;
  color?: 'amber' | 'emerald' | 'sky' | 'purple' | 'rose';
  comment?: string;
  onOpenSource?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  id,
  quote,
  sourceTitle,
  sourceType,
  pageNumber,
  color = 'amber',
  comment,
  onOpenSource,
}) => {
  const borderColors = {
    amber: 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/10',
    emerald: 'border-l-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/10',
    sky: 'border-l-sky-500 bg-sky-50/30 dark:bg-sky-950/10',
    purple: 'border-l-purple-500 bg-purple-50/30 dark:bg-purple-950/10',
    rose: 'border-l-rose-500 bg-rose-50/30 dark:bg-rose-950/10',
  };

  return (
    <div
      id={id}
      className={`rounded-r-lg border border-slate-200 dark:border-slate-800 border-l-4 p-3.5 ${borderColors[color]} transition-all`}
    >
      <blockquote className="text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {comment && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-sans">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Note:</span> {comment}
        </p>
      )}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span className="truncate max-w-[220px]">
          {sourceType === 'DOCUMENT' ? '📄 ' : '🔗 '}
          {sourceTitle} {pageNumber ? `(p. ${pageNumber})` : ''}
        </span>
        {onOpenSource && (
          <button
            onClick={onOpenSource}
            className="text-sky-600 dark:text-sky-400 hover:underline font-sans font-medium shrink-0 ml-2"
          >
            Inspect Source →
          </button>
        )}
      </div>
    </div>
  );
};
