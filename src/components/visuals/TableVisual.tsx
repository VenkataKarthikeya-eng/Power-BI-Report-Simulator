'use client';

import React from 'react';

interface TableVisualProps {
  title: string;
  columns?: string[];
  rows?: Record<string, any>[];
  isDemoData: boolean;
}

export function TableVisual({ title, columns = [], rows = [], isDemoData }: TableVisualProps) {
  if (!rows || rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center text-xs text-slate-400">
        No tabular rows available.
      </div>
    );
  }

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

      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[160px] text-[11px] border border-slate-100 rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="p-1.5 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="p-1.5 whitespace-nowrap text-slate-700 font-mono">
                    {String(row[col] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
