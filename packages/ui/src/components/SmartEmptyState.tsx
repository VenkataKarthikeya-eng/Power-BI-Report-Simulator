'use client';

import React from 'react';

interface SmartEmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function SmartEmptyState({
  icon = '📦',
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: SmartEmptyStateProps) {
  return (
    <div className="p-10 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6">
      <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-3xl shadow-inner mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">{description}</p>
      
      {(primaryActionLabel || secondaryActionLabel) && (
        <div className="flex items-center space-x-3 mt-6">
          {primaryActionLabel && onPrimaryAction && (
            <button
              onClick={onPrimaryAction}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center space-x-2"
            >
              <span>{primaryActionLabel}</span>
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
