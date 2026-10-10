'use client';

import React from 'react';
import { ComputedChartItem } from '@/lib/simulation/types';

interface BarChartVisualProps {
  title: string;
  items?: ComputedChartItem[];
  isDemoData: boolean;
  isColumn?: boolean;
}

export function BarChartVisual({ title, items = [], isDemoData, isColumn = false }: BarChartVisualProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-slate-400">
        No series data available for this chart.
      </div>
    );
  }

  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex items-center justify-between gap-1 mb-3">
        <h4 className="text-xs font-bold text-slate-800 truncate" title={title}>
          {title}
        </h4>
        {isDemoData && (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Demo
          </span>
        )}
      </div>

      {isColumn ? (
        /* Vertical Column Chart */
        <div className="flex-1 flex items-end gap-3 pt-2 pb-1 min-h-[140px]">
          {items.map((item, idx) => {
            const heightPct = Math.max(10, Math.round((item.value / maxVal) * 100));
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.formattedValue}
                </span>
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:brightness-110"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: item.color || '#e5322d',
                  }}
                />
                <span className="text-[10px] font-medium text-slate-600 truncate max-w-[60px] text-center" title={item.category}>
                  {item.category}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Horizontal Bar Chart */
        <div className="space-y-2.5 flex-1 flex flex-col justify-center">
          {items.map((item, idx) => {
            const widthPct = Math.max(8, Math.round((item.value / maxVal) * 100));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-slate-700 truncate">{item.category}</span>
                  <span className="font-mono text-slate-500 font-semibold">{item.formattedValue}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: item.color || '#e5322d',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
