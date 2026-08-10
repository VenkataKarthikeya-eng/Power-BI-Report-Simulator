'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';

export interface TourStepInfo {
  targetSelector: string;
  title: string;
  content: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
}

const TOUR_STEPS: TourStepInfo[] = [
  {
    targetSelector: '#nav-workspace-switcher',
    title: 'Workspace Switcher',
    content: 'Switch between enterprise supply chain, finance, and HR workspaces or create new ones.',
  },
  {
    targetSelector: '#btn-import-pbix',
    title: 'Import Power BI Report',
    content: 'Start by uploading your .pbix report file to extract DataModel AST & visuals.',
  },
  {
    targetSelector: '#nav-copilot',
    title: 'AI Copilot',
    content: 'Ask questions about your active dashboard dataset schema using natural language.',
  },
  {
    targetSelector: '#nav-health',
    title: 'Health Score Index',
    content: 'View multi-dimensional scores across Performance, Security, and Accessibility with 1-click Auto-Fixes.',
  },
];

export function ProductTourOverlay() {
  const { tourActive, tourStep, nextTourStep, prevTourStep, endTour } = useApp();

  if (!tourActive) return null;

  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isLast = tourStep >= TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 pointer-events-auto flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-left relative">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Product Tour • Step {tourStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button onClick={endTour} className="text-slate-400 hover:text-white text-xs font-bold">
            Skip Tour ✕
          </button>
        </div>

        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <span>💡</span>
            <span>{current.title}</span>
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">{current.content}</p>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={prevTourStep}
            disabled={tourStep === 0}
            className="text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>

          <div className="flex space-x-2">
            {!isLast ? (
              <button
                onClick={nextTourStep}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={endTour}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow"
              >
                Got It! Complete Tour ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
