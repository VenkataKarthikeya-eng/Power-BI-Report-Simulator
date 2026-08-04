'use client';

import React, { useState } from 'react';
import { PageAST, VisualAST } from '@dcaps/types';
import { CanvasRenderer } from '../components/CanvasRenderer';
import { SlicerPanel } from '../components/SlicerPanel';

export default function ViewerPage() {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [slicerOpen, setSlicerOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const pages: PageAST[] = [
    {
      id: 'sec_overview',
      name: 'sec_overview',
      displayName: 'Q3 Executive Logistics',
      ordinal: 1,
      width: 1280,
      height: 720,
      visuals: [
        { id: 'vis_kpi_1', type: 'kpiCard', name: 'Margin', x: 40, y: 40, width: 380, height: 140, zIndex: 1, title: 'Total Freight Margin', fields: [] },
        { id: 'vis_kpi_2', type: 'kpiCard', name: 'Delays', x: 440, y: 40, width: 380, height: 140, zIndex: 2, title: 'Avg Transit Delay (Hours)', fields: [] },
        { id: 'vis_kpi_3', type: 'kpiCard', name: 'Shipments', x: 840, y: 40, width: 380, height: 140, zIndex: 3, title: 'Active Global Shipments', fields: [] },
        { id: 'vis_bar_1', type: 'horizontalBarChart', name: 'Carriers', x: 40, y: 200, width: 580, height: 320, zIndex: 4, title: 'Carrier Freight Allocation', fields: [] },
        { id: 'vis_line_1', type: 'lineChart', name: 'Timeline', x: 640, y: 200, width: 580, height: 320, zIndex: 5, title: 'Delay Hours Trend', fields: [] },
        { id: 'vis_matrix_1', type: 'matrix', name: 'Matrix', x: 40, y: 540, width: 1180, height: 280, zIndex: 6, title: 'Carrier Detailed Metric Matrix', fields: [] },
      ],
    },
    {
      id: 'sec_regional',
      name: 'sec_regional',
      displayName: 'Regional Transit Breakdown',
      ordinal: 2,
      width: 1280,
      height: 720,
      visuals: [
        { id: 'vis_matrix_reg', type: 'matrix', name: 'RegionalMatrix', x: 40, y: 40, width: 1180, height: 600, zIndex: 1, title: 'Regional Transit Performance', fields: [] },
      ],
    },
  ];

  const currentPage = pages[activePageIndex];

  const handleCrossFilter = (visualId: string, val: string) => {
    if (activeFilter === visualId) {
      setActiveFilter('');
    } else {
      setActiveFilter(visualId);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between ${presentationMode ? 'p-0' : ''}`}>
      {/* Top Header Bar */}
      {!presentationMode && (
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              DC
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center space-x-2">
                <span>Q3_Logistics_Global.dcaps</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                  READ-ONLY LOCKED
                </span>
              </div>
              <span className="text-[10px] text-slate-400">WASM Direct Canvas Runtime • ECDSA P-384 Verified</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => setSlicerOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 font-medium"
            >
              🌪️ Filter Slicers ({selectedRegion !== 'All Regions' ? '1 Active' : '0'})
            </button>

            <button
              onClick={() => setPresentationMode(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-sm"
            >
              📺 Fullscreen Presentation
            </button>
          </div>
        </header>
      )}

      {/* Presentation Exit Button */}
      {presentationMode && (
        <button
          onClick={() => setPresentationMode(false)}
          className="fixed top-4 right-4 bg-slate-900/90 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg z-50 hover:text-white"
        >
          ✕ Exit Presentation
        </button>
      )}

      {/* Main Interactive Canvas Area */}
      <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
        <CanvasRenderer page={currentPage} activeFilter={activeFilter} onCrossFilter={handleCrossFilter} />
      </main>

      {/* Interactive Slicer Drawer */}
      <SlicerPanel
        isOpen={slicerOpen}
        onClose={() => setSlicerOpen(false)}
        selectedRegion={selectedRegion}
        onSelectRegion={(reg) => {
          setSelectedRegion(reg);
          setSlicerOpen(false);
        }}
      />

      {/* Bottom Page Navigator */}
      {!presentationMode && (
        <footer className="h-14 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-between sticky bottom-0 z-40">
          <div className="flex space-x-2">
            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActivePageIndex(idx)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activePageIndex === idx
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                📄 {p.displayName}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Page {activePageIndex + 1} of {pages.length} • Visual Interactive Slicing Active
          </span>
        </footer>
      )}
    </div>
  );
}
