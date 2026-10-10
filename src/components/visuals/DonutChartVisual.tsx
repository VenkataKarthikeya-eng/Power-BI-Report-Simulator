'use client';

import React from 'react';
import { ComputedChartItem } from '@/lib/simulation/types';

interface DonutChartVisualProps {
  title: string;
  items?: ComputedChartItem[];
  isDemoData: boolean;
}

export function DonutChartVisual({ title, items = [], isDemoData }: DonutChartVisualProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-slate-400">
        No distribution data available.
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.value, 0);
  const size = 120;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col h-full p-4 justify-between">
      <div className="flex items-center justify-between gap-1 mb-2">
        <h4 className="text-xs font-bold text-slate-800 truncate" title={title}>
          {title}
        </h4>
        {isDemoData && (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
            Demo
          </span>
        )}
      </div>

      <div className="flex items-center justify-around gap-2 flex-1">
        {/* SVG Donut */}
        <div className="relative w-[110px] h-[110px] shrink-0">
          <svg width="110" height="110" viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {items.map((item, idx) => {
              const pct = total > 0 ? item.value / total : 0;
              const strokeDasharray = `${pct * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += pct;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={item.color || '#e5322d'}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-700 font-mono">
              {items.length} Segs
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 text-[11px] max-w-[140px]">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 truncate">{item.category}</span>
              </div>
              <span className="font-mono font-semibold text-slate-900 shrink-0">
                {Math.round(item.percentage || 0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
