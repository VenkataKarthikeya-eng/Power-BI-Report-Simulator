'use client';

import React from 'react';
import { ComputedTimelineItem } from '@/lib/simulation/types';

interface LineChartVisualProps {
  title: string;
  items?: ComputedTimelineItem[];
  isDemoData: boolean;
}

export function LineChartVisual({ title, items = [], isDemoData }: LineChartVisualProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-slate-400">
        No timeline data available.
      </div>
    );
  }

  const maxVal = Math.max(...items.map((i) => i.value), ...items.map((i) => i.target || 0), 1);
  const width = 280;
  const height = 120;
  const padding = 20;

  const points = items.map((item, idx) => {
    const x = padding + (idx / Math.max(1, items.length - 1)) * (width - padding * 2);
    const y = height - padding - (item.value / maxVal) * (height - padding * 2);
    return { x, y, item };
  });

  const pathD = points.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
    ''
  );

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

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

      <div className="flex-1 flex flex-col justify-center items-center">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e5322d" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#e5322d" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#lineGrad)" />

          {/* Line stroke */}
          <path d={pathD} fill="none" stroke="#e5322d" strokeWidth="2.5" strokeLinecap="round" />

          {/* Data nodes */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#e5322d" strokeWidth="2" />
            </g>
          ))}
        </svg>

        {/* Labels below */}
        <div className="flex justify-between w-full text-[10px] text-slate-500 font-mono mt-2 px-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-semibold text-slate-700">{item.label}</span>
              <span className="text-[9px] text-slate-400">{item.formattedValue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
