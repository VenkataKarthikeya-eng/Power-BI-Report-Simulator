import React from 'react';

export interface TimelineStep {
  step: number;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function ProgressTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-6 gap-2">
      {steps.map((s) => (
        <div
          key={s.step}
          className={`p-3 rounded-xl border text-center transition-all ${
            s.status === 'completed'
              ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
              : s.status === 'current'
              ? 'bg-indigo-950/80 border-indigo-500 text-white ring-1 ring-indigo-500/50'
              : 'bg-slate-900/60 border-slate-800 text-slate-500'
          }`}
        >
          <div className="text-[10px] font-bold uppercase tracking-wider">
            {s.status === 'completed' ? '✓ Step ' + s.step : 'Step ' + s.step}
          </div>
          <div className="text-xs font-bold mt-0.5 truncate">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
