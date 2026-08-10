'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export function GuidedWorkflowPanel() {
  const { journeyProgress, nextAction, isDemoMode, toggleDemoMode } = useApp();
  const router = useRouter();

  const journeyItems = [
    { label: 'Workspace Created', done: journeyProgress.workspaceCreated },
    { label: 'Report Uploaded', done: journeyProgress.reportUploaded },
    { label: 'AI Analysis', done: journeyProgress.aiAnalyzed },
    { label: 'Optimization', done: journeyProgress.optimized },
    { label: 'Share', done: journeyProgress.shared },
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
      {/* Journey Progress Stepper */}
      <div className="flex items-center space-x-4 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
        <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center space-x-1 shrink-0">
          <span>🧭</span>
          <span>Your Analytics Journey:</span>
        </span>

        <div className="flex items-center space-x-2 shrink-0">
          {journeyItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <div
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  item.done
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400'
                }`}
              >
                <span>{item.done ? '✓' : '○'}</span>
                <span>{item.label}</span>
              </div>
              {idx < journeyItems.length - 1 && <span className="text-slate-600 text-[10px]">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Next Action Recommendation & Demo Mode Trigger */}
      <div className="flex items-center space-x-3 shrink-0 w-full md:w-auto justify-end">
        <div className="hidden lg:block text-right">
          <span className="text-[10px] text-slate-400 block font-medium">Next Recommended Action:</span>
          <span className="text-xs font-semibold text-indigo-300">{nextAction.title}</span>
        </div>

        <button
          onClick={() => router.push(nextAction.route)}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm transition-all text-xs flex items-center space-x-1.5"
        >
          <span>Continue</span>
          <span>→</span>
        </button>

        <button
          onClick={toggleDemoMode}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isDemoMode
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle pre-populated sample workspace"
        >
          {isDemoMode ? '⚡ Demo Mode Active' : '✨ Explore Demo Workspace'}
        </button>
      </div>
    </div>
  );
}
