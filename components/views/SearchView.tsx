import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  FileText,
  Files,
  Globe,
  Code2,
  Tag,
  Folder,
  ArrowRight,
  Sparkles,
  Bookmark as BookmarkIcon,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Note, DocumentItem, Bookmark, CodeSnippet, Collection } from '@/lib/types';
import { LumenCard } from '../lumen/LumenCard';

interface SearchViewProps {
  notes: Note[];
  documents: DocumentItem[];
  bookmarks: Bookmark[];
  codeSnippets: CodeSnippet[];
  collections: Collection[];
  onNavigate: (view: string, itemId?: string) => void;
  className?: string;
}

// Semantic Similarity Helpers (TF Cosine)
const getTermFrequency = (text: string): Record<string, number> => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  const tf: Record<string, number> = {};
  words.forEach(w => {
    tf[w] = (tf[w] || 0) + 1;
  });
  return tf;
};

const cosineSimilarity = (query: string, document: string): number => {
  const qTf = getTermFrequency(query);
  const dTf = getTermFrequency(document);
  
  const uniqueWords = new Set([...Object.keys(qTf), ...Object.keys(dTf)]);
  
  let dotProduct = 0;
  let qMag = 0;
  let dMag = 0;
  
  uniqueWords.forEach(w => {
    const qVal = qTf[w] || 0;
    const dVal = dTf[w] || 0;
    dotProduct += qVal * dVal;
    qMag += qVal * qVal;
    dMag += dVal * dVal;
  });
  
  if (qMag === 0 || dMag === 0) return 0;
  return dotProduct / (Math.sqrt(qMag) * Math.sqrt(dMag));
};

export const SearchView: React.FC<SearchViewProps> = ({
  notes,
  documents,
  bookmarks,
  codeSnippets,
  collections,
  onNavigate,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | 'NOTE' | 'DOCUMENT' | 'BOOKMARK' | 'CODE'>('ALL');
  const [selectedCollection, setSelectedCollection] = useState<string>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    documents.forEach((d) => d.tags.forEach((t) => set.add(t)));
    bookmarks.forEach((b) => b.tags.forEach((t) => set.add(t)));
    codeSnippets.forEach((c) => c.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes, documents, bookmarks, codeSnippets]);

  // Aggregate and search results
  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      type: 'NOTE' | 'DOCUMENT' | 'BOOKMARK' | 'CODE';
      tags: string[];
      collectionId?: string;
      collectionName?: string;
      icon: any;
      badge: string;
      badgeVariant: 'primary' | 'emerald' | 'amber' | 'purple' | 'rose' | 'muted';
      view: string;
      score: number;
    }> = [];

    const getScore = (text: string) => {
      if (!q) return 1;
      // Bonus if exact match
      const exactBonus = text.toLowerCase().includes(q) ? 0.5 : 0;
      return cosineSimilarity(q, text) + exactBonus;
    };

    // Search Notes
    if (selectedType === 'ALL' || selectedType === 'NOTE') {
      notes.forEach((n) => {
        const fullText = `${n.title} ${n.content} ${n.tags.join(' ')}`;
        const score = getScore(fullText);
        const matchesCol = selectedCollection === 'ALL' || n.collectionId === selectedCollection;
        const matchesTag = !selectedTag || n.tags.includes(selectedTag);

        if ((!q || score > 0) && matchesCol && matchesTag) {
          results.push({
            id: n.id,
            title: n.title,
            subtitle: n.content.substring(0, 140).replace(/#|\[\[|\]\]/g, '') + '...',
            type: 'NOTE',
            tags: n.tags,
            collectionId: n.collectionId,
            collectionName: n.collectionName,
            icon: FileText,
            badge: `v${n.versionCount} • ${n.wordCount} words`,
            badgeVariant: 'primary',
            view: 'notes',
            score,
          });
        }
      });
    }

    // Search Documents
    if (selectedType === 'ALL' || selectedType === 'DOCUMENT') {
      documents.forEach((d) => {
        const fullText = `${d.title} ${d.extractedText} ${d.summary || ''} ${d.tags.join(' ')}`;
        const score = getScore(fullText);
        const matchesCol = selectedCollection === 'ALL' || d.collectionId === selectedCollection;
        const matchesTag = !selectedTag || d.tags.includes(selectedTag);

        if ((!q || score > 0) && matchesCol && matchesTag) {
          results.push({
            id: d.id,
            title: d.title,
            subtitle: d.summary || d.extractedText.substring(0, 140) + '...',
            type: 'DOCUMENT',
            tags: d.tags,
            collectionId: d.collectionId,
            icon: Files,
            badge: `${d.pageCount} pages`,
            badgeVariant: 'rose',
            view: 'documents',
            score,
          });
        }
      });
    }

    // Search Bookmarks
    if (selectedType === 'ALL' || selectedType === 'BOOKMARK') {
      bookmarks.forEach((b) => {
        const fullText = `${b.title} ${b.description} ${b.domain} ${b.tags.join(' ')}`;
        const score = getScore(fullText);
        const matchesCol = selectedCollection === 'ALL' || b.collectionId === selectedCollection;
        const matchesTag = !selectedTag || b.tags.includes(selectedTag);

        if ((!q || score > 0) && matchesCol && matchesTag) {
          results.push({
            id: b.id,
            title: b.title,
            subtitle: b.description,
            type: 'BOOKMARK',
            tags: b.tags,
            collectionId: b.collectionId,
            collectionName: b.collectionName,
            icon: Globe,
            badge: b.domain,
            badgeVariant: 'emerald',
            view: 'bookmarks',
            score,
          });
        }
      });
    }

    // Search Code Snippets
    if (selectedType === 'ALL' || selectedType === 'CODE') {
      codeSnippets.forEach((c) => {
        const fullText = `${c.title} ${c.description || ''} ${c.code} ${c.tags.join(' ')}`;
        const score = getScore(fullText);
        const matchesCol = selectedCollection === 'ALL' || c.collectionId === selectedCollection;
        const matchesTag = !selectedTag || c.tags.includes(selectedTag);

        if ((!q || score > 0) && matchesCol && matchesTag) {
          results.push({
            id: c.id,
            title: c.title,
            subtitle: c.description || c.code.substring(0, 100) + '...',
            type: 'CODE',
            tags: c.tags,
            collectionId: c.collectionId,
            icon: Code2,
            badge: c.language,
            badgeVariant: 'amber',
            view: 'code',
            score,
          });
        }
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }, [query, selectedType, selectedCollection, selectedTag, notes, documents, bookmarks, codeSnippets]);

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-sky-600 dark:text-sky-400">
          <Search className="h-4 w-4" />
          <span>Unified Cross-Vault Retrieval</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
          Deep Search & Full-Text Queries
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
          Scan markdown notes, extracted PDF pages, indexed bookmark descriptions, and code syntax blocks.
        </p>
      </div>

      {/* Main Search Input */}
      <div className="relative">
        <Search className="h-5 w-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search research vault by keywords, concepts, syntax, or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-sans text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500/50 shadow-xs"
          autoFocus
        />
      </div>

      {/* Facet Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium">Type:</span>
          {(['ALL', 'NOTE', 'DOCUMENT', 'BOOKMARK', 'CODE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedType === t
                  ? 'bg-sky-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-700 dark:text-slate-300"
            >
              <option value="ALL">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              #{selectedTag} ✕
            </button>
          )}
        </div>
      </div>

      {/* Tags quick cloud */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono text-slate-400">
        <span className="shrink-0">Filter by Tag:</span>
        {allTags.slice(0, 12).map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTag(selectedTag === t ? null : t)}
            className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
              selectedTag === t
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            #{t}
          </button>
        ))}
      </div>

      {/* Results Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Found {searchResults.length} matching artifacts</span>
          {query && <span>Query: &ldquo;{query}&rdquo;</span>}
        </div>

        {searchResults.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400 font-mono space-y-2">
            <div>No matching artifacts found.</div>
            <div className="text-[11px] text-slate-500">Try adjusting keywords or clearing facet filters.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((item) => (
              <LumenCard
                key={`${item.type}-${item.id}`}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon}
                badge={item.badge}
                badgeVariant={item.badgeVariant}
                tags={item.tags}
                onClick={() => onNavigate(item.view, item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
