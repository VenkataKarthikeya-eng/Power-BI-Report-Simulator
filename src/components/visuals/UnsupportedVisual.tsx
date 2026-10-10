'use client';

import React from 'react';
import { Database, AlertTriangle, Layers } from 'lucide-react';
import { NormalizedVisual } from '@/lib/parser/types';

interface UnsupportedVisualProps {
  title: string;
  visual: NormalizedVisual;
  isDataModelMissing: boolean;
  warnings?: string[];
}

export function UnsupportedVisual({
  title,
  visual,
  isDataModelMissing,
  warnings = [],
}: UnsupportedVisualProps) {
  return (
    <div className="flex flex-col justify-between h-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl text-left">
      <div>
        <div className="flex items-start justify-between gap-1 mb-2">
          <span className="text-xs font-bold text-slate-800 truncate" title={title}>
            {title}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            {visual.visualType}
          </span>
        </div>

        {isDataModelMissing ? (
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-1.5 my-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Database className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>VertiPaq DataModel Unexecuted</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Report layout and AST coordinates were successfully parsed, but the proprietary binary VertiPaq tabular model is not executed in the browser.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg space-y-1 my-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <AlertTriangle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Unsupported Visual Type ({visual.rawVisualType})</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {warnings[0] || 'This visual plugin requires custom rendering capabilities.'}
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>pos: ({Math.round(visual.position.x)}, {Math.round(visual.position.y)})</span>
        <span>dim: {Math.round(visual.position.width)} × {Math.round(visual.position.height)}</span>
      </div>
    </div>
  );
}
