import React, { useState } from 'react';
import {
  Code2,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Tag,
  Folder,
  Terminal,
  FileCode,
} from 'lucide-react';
import { CodeSnippet, Collection } from '@/lib/types';

interface CodeViewProps {
  snippets: CodeSnippet[];
  collections: Collection[];
  onAddSnippet: (data: Partial<CodeSnippet>) => void;
  onDeleteSnippet: (id: string) => void;
  className?: string;
}

export const CodeView: React.FC<CodeViewProps> = ({
  snippets,
  collections,
  onAddSnippet,
  onDeleteSnippet,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(snippets[0]?.id || null);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [code, setCode] = useState('');
  const [repository, setRepository] = useState('');
  const [filePath, setFilePath] = useState('');
  const [tags, setTags] = useState('algorithm, backend');
  const [collectionId, setCollectionId] = useState('');

  const languages = Array.from(new Set(snippets.map((s) => s.language)));

  const filteredSnippets = snippets.filter((s) => {
    if (selectedLanguage && s.language !== selectedLanguage) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const selectedSnippet = snippets.find((s) => s.id === selectedSnippetId) || filteredSnippets[0] || null;

  const handleCopy = (snippet: CodeSnippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    onAddSnippet({
      title: title.trim(),
      description: description.trim(),
      language,
      code: code.trim(),
      repository: repository.trim() || undefined,
      filePath: filePath.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      collectionId: collectionId || undefined,
    });

    setIsAdding(false);
    setTitle('');
    setDescription('');
    setCode('');
    setRepository('');
    setFilePath('');
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-600 dark:text-amber-400">
            <Code2 className="h-4 w-4" />
            <span>Developer Knowledge & Syntax Vault</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Code Snippets & Algorithms
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Store, catalog, and recall production recipes, algorithms, and infrastructure definitions.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" /> New Snippet
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono overflow-x-auto">
          <button
            onClick={() => setSelectedLanguage(null)}
            className={`px-3 py-1 rounded-md transition-all ${
              selectedLanguage === null
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            All ({snippets.length})
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(selectedLanguage === lang ? null : lang)}
              className={`px-3 py-1 rounded-md uppercase transition-all ${
                selectedLanguage === lang
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {lang} ({snippets.filter((s) => s.language === lang).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, functions, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Two Column Layout: Snippets List & Inspector */}
      {filteredSnippets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400 font-mono">
          No code snippets match current criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {filteredSnippets.map((snippet) => {
              const isSelected = selectedSnippet?.id === snippet.id;
              return (
                <div
                  key={snippet.id}
                  onClick={() => setSelectedSnippetId(snippet.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-xs ring-1 ring-amber-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-amber-500 shrink-0" />
                      <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-mono truncate">
                        {snippet.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shrink-0">
                      {snippet.language}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 font-sans">
                    {snippet.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1 truncate max-w-[180px]">
                      {snippet.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                    <span>{snippet.code.split('\n').length} lines</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Code Viewer (7 cols) */}
          <div className="lg:col-span-7">
            {selectedSnippet ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-xl sticky top-20">
                {/* Code Window Titlebar */}
                <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <Terminal className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="font-mono text-xs font-semibold text-slate-200 truncate">
                      {selectedSnippet.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                      {selectedSnippet.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(selectedSnippet)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors"
                    >
                      {copiedId === selectedSnippet.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-slate-400" /> Copy Code
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteSnippet(selectedSnippet.id)}
                      className="p-1.5 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete snippet"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Code Body */}
                <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
                  <pre className="whitespace-pre">{selectedSnippet.code}</pre>
                </div>

                {/* Footer Metadata */}
                <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
                  <div className="flex items-center gap-3">
                    {selectedSnippet.repository && (
                      <span className="flex items-center gap-1 text-slate-300">
                        Repo: {selectedSnippet.repository}
                      </span>
                    )}
                    {selectedSnippet.filePath && <span>Path: {selectedSnippet.filePath}</span>}
                  </div>
                  <span>Updated: {new Date(selectedSnippet.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Add Snippet Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-mono flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Code2 className="h-4 w-4 text-amber-500" />
                Store New Code Snippet
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-200">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-slate-500 mb-1 block">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Distributed Lock with Redis Redlock"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-500 mb-1 block">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                  >
                    <option value="typescript">TypeScript</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="rust">Rust</option>
                    <option value="go">Go</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash / Shell</option>
                    <option value="dockerfile">Dockerfile</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Description & Purpose</label>
                <input
                  type="text"
                  placeholder="Brief summary of performance trade-offs or usage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Code Payload</label>
                <textarea
                  rows={8}
                  placeholder="// Paste code..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-950 text-slate-100 border border-slate-800 rounded-lg p-3 focus:outline-hidden resize-none leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-slate-500 mb-1 block">Repository (Optional)</label>
                  <input
                    type="text"
                    placeholder="github.com/org/repo"
                    value={repository}
                    onChange={(e) => setRepository(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-500 mb-1 block">File Path (Optional)</label>
                  <input
                    type="text"
                    placeholder="src/utils/lock.ts"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-500 mb-1 block">Target Collection</label>
                <select
                  value={collectionId}
                  onChange={(e) => setCollectionId(e.target.value)}
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
                <label className="text-xs font-mono text-slate-500 mb-1 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-medium shadow-md transition-colors"
                >
                  Save Code Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
