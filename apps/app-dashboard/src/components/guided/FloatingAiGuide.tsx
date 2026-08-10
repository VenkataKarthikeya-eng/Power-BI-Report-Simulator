'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export function FloatingAiGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const { startTour, toggleDemoMode, setOnboardingStep } = useApp();
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Panel */}
      {isOpen && (
        <div className="mb-4 bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl max-w-sm w-full space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                AI
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Platform Assistant Guide</h4>
                <p className="text-[10px] text-slate-400">Step-by-step guidance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-xs font-bold">
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
            👋 Welcome! I can help you analyze your first BI dashboard. What would you like to do?
          </p>

          <div className="space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/import');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-between transition-colors"
            >
              <span>1. Upload a PBIX report</span>
              <span className="text-indigo-400">→</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                toggleDemoMode();
                router.push('/dashboard');
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-between transition-colors"
            >
              <span>2. Explore sample demo dashboard</span>
              <span className="text-indigo-400">→</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                startTour();
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-between transition-colors"
            >
              <span>3. Take an interactive product tour</span>
              <span className="text-indigo-400">→</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setOnboardingStep(1);
              }}
              className="w-full text-left p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-white font-medium flex items-center justify-between transition-colors"
            >
              <span>4. Restart 4-step onboarding wizard</span>
              <span className="text-indigo-400">→</span>
            </button>
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl border-2 border-indigo-400 transition-all hover:scale-105 active:scale-95 group relative"
        title="Open AI Guide Assistant"
      >
        <span className="text-2xl">{isOpen ? '✕' : '🤖'}</span>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-white">
            !
          </span>
        )}
      </button>
    </div>
  );
}
