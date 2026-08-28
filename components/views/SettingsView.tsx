import React, { useState } from 'react';
import {
  Settings,
  Users,
  Shield,
  HardDrive,
  Download,
  Upload,
  UserPlus,
  Trash2,
  Check,
  Key,
  Command,
  HelpCircle,
} from 'lucide-react';
import { Workspace, WorkspaceMember, Role } from '@/lib/types';

interface SettingsViewProps {
  workspace: Workspace;
  members: WorkspaceMember[];
  onUpdateWorkspace: (updates: Partial<Workspace>) => void;
  onInviteMember: (email: string, role: Role) => void;
  onChangeRole: (memberId: string, newRole: Role) => void;
  onRemoveMember: (memberId: string) => void;
  onExportVault: () => void;
  className?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  workspace,
  members,
  onUpdateWorkspace,
  onInviteMember,
  onChangeRole,
  onRemoveMember,
  onExportVault,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'MEMBERS' | 'STORAGE' | 'SHORTCUTS'>('GENERAL');

  // General tab state
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [savedGeneral, setSavedGeneral] = useState(false);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('EDITOR');
  const [isInviting, setIsInviting] = useState(false);

  const storageUsedMB = (workspace.storageUsedBytes / (1024 * 1024)).toFixed(1);
  const storageLimitMB = (workspace.storageLimitBytes / (1024 * 1024)).toFixed(0);
  const storagePercent = Math.round((workspace.storageUsedBytes / workspace.storageLimitBytes) * 100);

  const handleGeneralSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWorkspace({ name, description });
    setSavedGeneral(true);
    setTimeout(() => setSavedGeneral(false), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onInviteMember(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setIsInviting(false);
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-slate-500">
          <Settings className="h-4 w-4" />
          <span>Workspace Control Plane</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
          Vault Settings & Governance
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
          Configure security policies, role-based access control (RBAC), and storage partitions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('GENERAL')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'GENERAL'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Settings className="h-3.5 w-3.5" /> Workspace Identity
        </button>

        <button
          onClick={() => setActiveTab('MEMBERS')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'MEMBERS'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-3.5 w-3.5" /> RBAC & Members ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('STORAGE')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'STORAGE'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <HardDrive className="h-3.5 w-3.5" /> Storage & Archival
        </button>

        <button
          onClick={() => setActiveTab('SHORTCUTS')}
          className={`pb-3 font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'SHORTCUTS'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Command className="h-3.5 w-3.5" /> Keyboard Shortcuts
        </button>
      </div>

      {/* Tab Content: General */}
      {activeTab === 'GENERAL' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
            Workspace Configuration
          </h3>

          <form onSubmit={handleGeneralSave} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-500 mb-1 block">Workspace Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 font-medium focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-500 mb-1 block">Description & Scope</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 resize-none focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-500 mb-1 block">Slug / Namespace</label>
              <input
                type="text"
                value={workspace.slug}
                disabled
                className="w-full text-xs bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {savedGeneral && (
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" /> Workspace updated successfully
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content: Members & RBAC */}
      {activeTab === 'MEMBERS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
              Role-Based Access Control (RBAC)
            </h3>
            <button
              onClick={() => setIsInviting(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" /> Add Member
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatarUrl} alt={m.name} className="h-7 w-7 rounded-full bg-slate-200" />
                        <div>
                          <div className="font-semibold font-sans text-slate-900 dark:text-slate-100">
                            {m.name}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={m.role}
                        onChange={(e) => onChangeRole(m.id, e.target.value as Role)}
                        disabled={m.role === 'OWNER'}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium disabled:opacity-60"
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="CONTRIBUTOR">CONTRIBUTOR</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(m.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {m.role !== 'OWNER' && (
                        <button
                          onClick={() => onRemoveMember(m.id)}
                          className="p-1 hover:text-rose-500 text-slate-400 transition-colors"
                          title="Revoke member access"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Invite Modal */}
          {isInviting && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                    Invite Collaborator to Vault
                  </h3>
                  <button onClick={() => setIsInviting(false)} className="text-slate-400 hover:text-slate-200">
                    ×
                  </button>
                </div>

                <form onSubmit={handleInviteSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-slate-500 mb-1 block">Email Address</label>
                    <input
                      type="email"
                      placeholder="colleague@domain.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-slate-500 mb-1 block">Access Role</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as Role)}
                      className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100"
                    >
                      <option value="ADMIN">ADMIN (Manage Members & Settings)</option>
                      <option value="EDITOR">EDITOR (Create, Edit & Delete)</option>
                      <option value="CONTRIBUTOR">CONTRIBUTOR (Create & Edit Own)</option>
                      <option value="VIEWER">VIEWER (Read-Only Access)</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsInviting(false)}
                      className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium shadow-md transition-colors"
                    >
                      Send Invitation
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Storage & Archival */}
      {activeTab === 'STORAGE' && (
        <div className="space-y-6 max-w-2xl">
          {/* Storage Quota Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                Storage Allocation
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {storageUsedMB} MB / {storageLimitMB} MB ({storagePercent}%)
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(storagePercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Backup & Export */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-xs">
            <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
              Vault Archival & Portable Backup
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
              Export all research notes, PDF highlights, bookmarks, and code snippets into an open JSON bundle.
            </p>

            <div className="pt-2">
              <button
                onClick={onExportVault}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 text-xs font-mono font-medium shadow-xs transition-opacity cursor-pointer"
              >
                <Download className="h-4 w-4" /> Download Complete Vault (.json)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Shortcuts */}
      {activeTab === 'SHORTCUTS' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
          <h3 className="text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
            Global Keyboard Shortcuts
          </h3>

          <div className="space-y-2 text-xs font-mono divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700 dark:text-slate-300">Open Command Palette</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                ⌘ K / Ctrl K
              </kbd>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700 dark:text-slate-300">Trigger Quick Capture</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                ⌘ ⇧ Space
              </kbd>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700 dark:text-slate-300">Insert Bi-Directional Backlink</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                [[ Note Title ]]
              </kbd>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-slate-700 dark:text-slate-300">Highlight Text in PDF Reader</span>
              <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs">
                Select Text + [H]
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
