'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '@dcaps/ui';

export function AutoFixModal() {
  const { modals, closeModal } = useApp();
  const { showToast } = useToast();
  const [fixing, setFixing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (!modals.autoFix) return null;

  const handleStartAutoFix = () => {
    setFixing(true);
    setProgress(20);

    setTimeout(() => setProgress(55), 400);
    setTimeout(() => setProgress(85), 800);
    setTimeout(() => {
      setProgress(100);
      setFixing(false);
      setCompleted(true);
      showToast({
        type: 'success',
        title: 'Auto-Fix Applied',
        message: '3 health recommendations applied! Health index boosted to 98/100.',
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">✨ AI Health Auto-Fix Optimization</h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated DAX refactoring, PII masking & WCAG contrast fix</p>
          </div>
          <button onClick={() => closeModal('autoFix')} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {!completed ? (
          <div className="space-y-4 text-xs">
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>🛡️ Apply RLS PII Masking to DriverSSN</span>
                <span className="text-emerald-400 font-mono">P1 Security</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>⚡ Refactor FILTER(ALL()) → KEEPFILTERS</span>
                <span className="text-indigo-400 font-mono">+65% Speed</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span>🎨 WCAG 2.2 AA Contrast Palette Adjustment</span>
                <span className="text-amber-400 font-mono">Accessibility</span>
              </div>
            </div>

            {fixing && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between font-mono text-[11px] text-slate-300">
                  <span>Executing AST Optimization & Compiling...</span>
                  <span className="text-indigo-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => closeModal('autoFix')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleStartAutoFix}
                disabled={fixing}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md disabled:opacity-50"
              >
                {fixing ? 'Fixing...' : 'Run 1-Click Auto-Fix →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
              ✓
            </div>
            <h4 className="text-base font-bold text-white">All Optimization Rules Applied!</h4>
            <p className="text-slate-300 max-w-xs mx-auto">
              Report health score increased from <strong className="text-slate-400">94/100</strong> to{' '}
              <strong className="text-emerald-400">98/100</strong>.
            </p>

            <button
              onClick={() => closeModal('autoFix')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow"
            >
              Done & Return to Health Index
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
