import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LumenCardProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: 'primary' | 'emerald' | 'amber' | 'purple' | 'rose' | 'muted';
  tags?: string[];
  meta?: string;
  active?: boolean;
  onClick?: () => void;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const LumenCard: React.FC<LumenCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeVariant = 'muted',
  tags,
  meta,
  active,
  onClick,
  actions,
  children,
  className = '',
}) => {
  const badgeStyles = {
    primary: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    muted: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`group relative rounded-xl border p-4 transition-all duration-200 ${
        active
          ? 'border-sky-500/50 bg-sky-50/50 dark:border-sky-500/40 dark:bg-sky-950/20 ring-1 ring-sky-500/30'
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {Icon && (
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm leading-snug">
                {title}
              </h3>
              {badge && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium border ${badgeStyles[badgeVariant]}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>

      {children && <div className="mt-3">{children}</div>}

      {(tags?.length || meta) && (
        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
            {tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
              >
                #{tag}
              </span>
            ))}
            {(tags?.length || 0) > 3 && (
              <span className="text-[10px] text-slate-400 font-mono">
                +{(tags?.length || 0) - 3}
              </span>
            )}
          </div>
          {meta && <span className="shrink-0 font-mono text-[11px] text-slate-400">{meta}</span>}
        </div>
      )}
    </div>
  );
};
