import React from 'react';
import {
  Home,
  Inbox,
  FileText,
  Files,
  Globe,
  Code2,
  Folder,
  Share2,
  Search,
  Activity,
  Shield,
  Settings,
  Plus,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { Collection, Workspace } from '@/lib/types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  collections: Collection[];
  onSelectCollection?: (colId: string) => void;
  inboxCount: number;
  workspace: Workspace;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  collections,
  onSelectCollection,
  inboxCount,
  workspace,
  className = '',
}) => {
  const navItems = [
    { id: 'home', label: 'Home & Pulse', icon: Home },
    { id: 'inbox', label: 'Inbox', icon: Inbox, badge: inboxCount > 0 ? inboxCount : undefined },
    { id: 'notes', label: 'Notes & Backlinks', icon: FileText },
    { id: 'documents', label: 'Documents & PDFs', icon: Files },
    { id: 'bookmarks', label: 'Bookmarks', icon: Globe },
    { id: 'code', label: 'Code Snippets', icon: Code2 },
    { id: 'collections', label: 'Collections', icon: Folder },
    { id: 'graph', label: 'Knowledge Graph', icon: Share2 },
    { id: 'search', label: 'Search Engine', icon: Search },
    { id: 'intelligence', label: 'Deterministic Intel', icon: Activity },
    { id: 'audit', label: 'Activity & Audit', icon: Shield },
    { id: 'settings', label: 'Workspace & RBAC', icon: Settings },
  ];

  const storageUsedMB = (workspace.storageUsedBytes / (1024 * 1024)).toFixed(0);
  const storageLimitGB = (workspace.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(0);
  const storagePercent = Math.min(100, Math.round((workspace.storageUsedBytes / workspace.storageLimitBytes) * 100));

  return (
    <aside className={`w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-md flex flex-col justify-between shrink-0 select-none ${className}`}>
      <div className="p-3 space-y-4 overflow-y-auto">
        {/* Navigation List */}
        <div className="space-y-0.5">
          <div className="px-3 py-1 text-[10px] uppercase font-mono font-semibold text-slate-400">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 font-semibold shadow-xs border border-sky-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Collections Quick List */}
        <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between px-3 py-1 text-[10px] uppercase font-mono font-semibold text-slate-400">
            <span>Collections</span>
            <button
              onClick={() => onNavigate('collections')}
              className="hover:text-sky-500 transition-colors"
              title="Manage Collections"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-0.5">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => {
                  onSelectCollection?.(col.id);
                  onNavigate('collections');
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-sans text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors truncate"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: col.color }} />
                  <span className="truncate">{col.name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 ml-1">
                  {col.itemsCount.notes + col.itemsCount.documents}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Storage & Engine Status Widget */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-[11px] font-mono text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <HardDrive className="h-3.5 w-3.5 text-slate-400" />
            <span>Storage</span>
          </div>
          <span>{storageUsedMB} MB / {storageLimitGB} GB</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.max(4, storagePercent)}%` }} />
        </div>

        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Lumen Engine Online
          </span>
          <span>v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};
