'use client';

import React from 'react';
import { Filter, Check, X } from 'lucide-react';

interface SlicerVisualProps {
  title: string;
  items?: { value: string; count: number; selected: boolean }[];
  isDemoData: boolean;
  onToggle?: (value: string) => void;
  onClear?: () => void;
}

export function SlicerVisual({
  title,
  items = [],
  isDemoData,
  onToggle,
  onClear,
}: SlicerVisualProps) {
  const selectedCount = items.filter((i) => i.selected).length;

  return (
    <div className="flex flex-col h-full p-4 justify-between bg-purple-50/20 border border-purple-100 rounded-xl">
      <div className="flex items-center justify-between gap-1 mb-2">
        <div className="flex items-center gap-1.5 truncate">
          <Filter className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <h4 className="text-xs font-bold text-slate-800 truncate" title={title}>
            {title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {selectedCount > 0 && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-[10px] text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-0.5 bg-purple-100/60 px-1.5 py-0.5 rounded transition-colors"
              title="Clear active slicer selections"
            >
              <X className="w-2.5 h-2.5" />
              <span>Clear</span>
            </button>
          )}
          {isDemoData && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
              Demo
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 flex-1 items-start content-start py-1 overflow-y-auto max-h-[140px]">
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onToggle && onToggle(item.value)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all font-medium border ${
              item.selected
                ? 'bg-[#e5322d] text-white border-[#e5322d] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            {item.selected && <Check className="w-3 h-3 stroke-[2.5]" />}
            <span>{item.value}</span>
            <span
              className={`text-[10px] ml-1 font-mono ${
                item.selected ? 'text-white/80' : 'text-slate-400'
              }`}
            >
              ({item.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
