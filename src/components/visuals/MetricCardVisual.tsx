'use client';

import React from 'react';
import { TrendingUp, AlertCircle, Database } from 'lucide-react';
import { ComputedMetric } from '@/lib/simulation/types';

interface MetricCardVisualProps {
  title: string;
  metric?: ComputedMetric;
  isDemoData: boolean;
}

export function MetricCardVisual({ title, metric, isDemoData }: MetricCardVisualProps) {
  if (!metric || metric.status === 'unsupported' || metric.status === 'no_data') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <AlertCircle className="w-6 h-6 text-slate-300 mb-1" />
        <span className="text-xs text-slate-400 font-medium">
          {metric?.warning || 'No data available'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-xs font-semibold text-slate-600 truncate" title={title}>
            {title}
          </span>
          {isDemoData && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Demo
            </span>
          )}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {metric.formattedValue}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Active Simulation</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          Status: {metric.status}
        </span>
      </div>
    </div>
  );
}
