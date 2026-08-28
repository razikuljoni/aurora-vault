import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Download,
  Filter,
  Search,
  User,
  Clock,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import { AuditLogItem, ActivityItem, Role } from '@/lib/types';

interface AuditViewProps {
  auditLogs: AuditLogItem[];
  activities: ActivityItem[];
  className?: string;
}

export const AuditView: React.FC<AuditViewProps> = ({
  auditLogs,
  activities,
  className = '',
}) => {
  const [tab, setTab] = useState<'AUDIT' | 'ACTIVITY'>('AUDIT');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterStatus !== 'ALL' && log.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.actorEmail.toLowerCase().includes(q) ||
        log.eventType.toLowerCase().includes(q) ||
        log.targetResource.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportAuditLog = () => {
    const dataStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aurora-vault-audit-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-6 md:p-8 max-w-7xl mx-auto space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Immutable Compliance & Security Ledger</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 mt-1">
            Security & Audit Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-0.5">
            Trace authentications, RBAC role mutations, and resource transactions across your workspace.
          </p>
        </div>

        <button
          onClick={exportAuditLog}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 hover:opacity-90 text-white dark:text-slate-900 text-xs font-mono font-medium shadow-xs transition-opacity cursor-pointer shrink-0"
        >
          <Download className="h-4 w-4" /> Export Ledger (JSON)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setTab('AUDIT')}
          className={`pb-3 text-xs font-mono font-semibold transition-colors flex items-center gap-2 ${
            tab === 'AUDIT'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="h-4 w-4" /> Security Audit Trail ({auditLogs.length})
        </button>
        <button
          onClick={() => setTab('ACTIVITY')}
          className={`pb-3 text-xs font-mono font-semibold transition-colors flex items-center gap-2 ${
            tab === 'ACTIVITY'
              ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-600 dark:border-sky-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck className="h-4 w-4" /> Research Activity Feed ({activities.length})
        </button>
      </div>

      {tab === 'AUDIT' ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg text-xs font-mono">
              {(['ALL', 'SUCCESS', 'BLOCKED', 'FAILED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    filterStatus === s
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter logs by actor, IP, event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 font-mono focus:outline-hidden"
              />
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Target Resource</th>
                    <th className="py-3 px-4">IP & Device</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        {log.status === 'SUCCESS' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> PASS
                          </span>
                        )}
                        {log.status === 'BLOCKED' && (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[10px]">
                            <AlertTriangle className="h-3.5 w-3.5" /> BLOCKED
                          </span>
                        )}
                        {log.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[10px]">
                            <XCircle className="h-3.5 w-3.5" /> FAILED
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        {log.eventType}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 dark:text-slate-300">{log.actorEmail}</div>
                        <div className="text-[10px] text-slate-400 font-sans">Role: {log.actorRole}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {log.targetResource}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{log.ipAddress}</div>
                        <div className="text-[10px] truncate max-w-[140px]">{log.userAgent}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Activity Stream */
        <div className="space-y-3">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={act.userAvatar}
                  alt={act.userName}
                  className="h-8 w-8 rounded-full bg-slate-200 shrink-0"
                />
                <div>
                  <div className="text-xs font-sans text-slate-800 dark:text-slate-200">
                    <strong className="font-semibold">{act.userName}</strong> {act.action.toLowerCase()}{' '}
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-medium">
                      [{act.resourceType}] {act.resourceTitle}
                    </span>
                  </div>
                  {act.details && (
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">{act.details}</div>
                  )}
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
