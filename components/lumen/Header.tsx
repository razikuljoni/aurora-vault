import React from 'react';
import {
  Search,
  Zap,
  Bell,
  Sun,
  Moon,
  Shield,
  Layers,
  ChevronDown,
  ExternalLink,
  Lock,
  User as UserIcon,
  Menu,
} from 'lucide-react';
import { Workspace, User } from '@/lib/types';

interface HeaderProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  currentUser: User;
  onSelectWorkspace: (ws: Workspace) => void;
  onOpenCommandPalette: () => void;
  onOpenQuickCapture: () => void;
  onNavigate: (view: string) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWorkspace,
  workspaces,
  currentUser,
  onSelectWorkspace,
  onOpenCommandPalette,
  onOpenQuickCapture,
  onNavigate,
  onToggleSidebar,
}) => {
  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between z-20 shrink-0">
      {/* Left: Workspace Branding & Switcher */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-linear-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xs tracking-wider">
            AV
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight font-mono hidden sm:inline">
            AURORA<span className="text-sky-500 font-normal">VAULT</span>
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700 select-none hidden sm:inline">/</span>

        {/* Workspace Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors">
            <Layers className="h-3.5 w-3.5 text-sky-500" />
            <span className="font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {currentWorkspace.name}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {/* Switcher Menu */}
          <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2 py-1 text-[10px] uppercase font-mono text-slate-400 font-semibold">
              Workspaces ({workspaces.length})
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => onSelectWorkspace(ws)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                  ws.id === currentWorkspace.id
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="truncate">
                  <div className="truncate">{ws.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{ws.description}</div>
                </div>
                {ws.id === currentWorkspace.id && <span className="text-[10px] text-sky-500 font-bold ml-1">●</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Role Badge */}
        <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
          <Lock className="h-2.5 w-2.5" />
          {currentWorkspace.currentUserRole}
        </span>
      </div>

      {/* Center: Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden sm:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all font-sans"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span>Search or run command...</span>
          </div>
          <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Quick Capture & User Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenQuickCapture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors"
        >
          <Zap className="h-3.5 w-3.5 text-amber-300" />
          <span className="hidden sm:inline">Quick Capture</span>
        </button>

        {/* Security & Audit shortcut */}
        <button
          onClick={() => onNavigate('audit')}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Security & Audit Logs"
        >
          <Shield className="h-4 w-4" />
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="h-7 w-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden lg:block text-left text-xs font-mono">
            <div className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400">{currentUser.email}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
