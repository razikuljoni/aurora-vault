import React, { useMemo, useState } from 'react';
import { ActivityItem, Note, DocumentItem } from '@/lib/types';
import { Sparkles, Activity, FileText, CheckCircle2 } from 'lucide-react';

interface ContributionHeatmapProps {
  activities: ActivityItem[];
  notes: Note[];
  documents: DocumentItem[];
  weeksCount?: number;
  onSelectDate?: (dateStr: string) => void;
}

export const ContributionHeatmap: React.FC<ContributionHeatmapProps> = ({
  activities,
  notes,
  documents,
  weeksCount = 18,
  onSelectDate,
}) => {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Generate the past `weeksCount` weeks of days
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Go back `weeksCount` weeks
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksCount * 7) + 1);

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      arr.push(new Date(d));
    }
    return arr;
  }, [weeksCount]);

  // Aggregate counts per day
  const dayMap = useMemo(() => {
    const map = new Map<string, { count: number; items: any[] }>();
    days.forEach(d => {
      map.set(d.toISOString().split('T')[0], { count: 0, items: [] });
    });

    activities.forEach(act => {
      if (!act.timestamp) return;
      const dateStr = act.timestamp.split('T')[0];
      if (map.has(dateStr)) {
        const entry = map.get(dateStr)!;
        entry.count++;
        entry.items.push(act);
      }
    });

    // Also populate fallback from documents
    documents.forEach(doc => {
      const docDate = doc.createdAt?.split('T')[0];
      if (docDate && map.has(docDate)) {
        const e = map.get(docDate)!;
        if (!e.items.some(it => it.id === doc.id)) {
          e.count++;
          e.items.push({ id: doc.id, title: doc.title, type: 'DOCUMENT' });
        }
      }
    });

    notes.forEach(note => {
      const noteDate = note.updatedAt?.split('T')[0];
      if (noteDate && map.has(noteDate)) {
        const e = map.get(noteDate)!;
        if (!e.items.some(it => it.id === note.id)) {
          e.count++;
          e.items.push({ id: note.id, title: note.title, type: 'NOTE' });
        }
      }
    });

    return map;
  }, [activities, documents, notes, days]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    let currentWeek: Date[] = [];
    
    days.forEach(day => {
      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) result.push(currentWeek);
    return result;
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (count <= 2) return 'bg-sky-200 dark:bg-sky-900/40';
    if (count <= 4) return 'bg-sky-400 dark:bg-sky-700/60';
    if (count <= 6) return 'bg-sky-500 dark:bg-sky-600';
    return 'bg-sky-600 dark:bg-sky-500';
  };

  const totalActivity = Array.from(dayMap.values()).reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-sans">
              Knowledge Contribution Heatmap
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              {totalActivity} contributions over the last {weeksCount} weeks
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-4 pt-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1.5">
            {week.map((day, dIdx) => {
              const dateStr = day.toISOString().split('T')[0];
              const data = dayMap.get(dateStr) || { count: 0, items: [] };
              return (
                <div
                  key={dateStr}
                  onMouseEnter={() => setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => onSelectDate?.(dateStr)}
                  className={`w-3.5 h-3.5 rounded-[3px] transition-all cursor-pointer border border-black/5 dark:border-white/5 relative ${getColor(data.count)}`}
                >
                  {hoveredDate === dateStr && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg shadow-xl z-50 pointer-events-none text-xs animate-in fade-in zoom-in-95">
                      <div className="font-semibold text-sky-400 mb-1">{dateStr}</div>
                      <div className="text-[11px] text-slate-300">
                        {data.count} contribution{data.count !== 1 ? 's' : ''}
                      </div>
                      {data.items.slice(0, 3).map((it: any, i: number) => (
                        <div key={i} className="text-[10px] mt-1 truncate text-slate-400">
                          • {it.title || it.resourceTitle || 'Untitled'}
                        </div>
                      ))}
                      {data.items.length > 3 && (
                        <div className="text-[10px] text-slate-500 mt-1 italic">
                          +{data.items.length - 3} more...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
         <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-800 border border-black/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-200 dark:bg-sky-900/40 border border-black/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-400 dark:bg-sky-700/60 border border-black/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-500 dark:bg-sky-600 border border-black/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-sky-600 dark:bg-sky-500 border border-black/5" />
            <span>More</span>
         </div>
      </div>
    </div>
  );
};
