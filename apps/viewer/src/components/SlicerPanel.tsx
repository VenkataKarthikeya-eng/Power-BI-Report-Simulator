'use client';

import React from 'react';

interface SlicerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const SlicerPanel: React.FC<SlicerPanelProps> = ({ isOpen, onClose, selectedRegion, onSelectRegion }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-slate-800 p-6 z-50 shadow-2xl flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white">Interactive Slicers & Filters</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-6 text-xs text-slate-300">
          <div>
            <label className="font-bold text-slate-200 block mb-2">Geographic Region Slicer</label>
            <div className="space-y-1">
              {['All Regions', 'North America (NA)', 'EMEA Transit Hub', 'APAC Logistics'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => onSelectRegion(reg)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedRegion === reg ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => onSelectRegion('All Regions')}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
        >
          Reset All Canvas Slicers
        </button>
      </div>
    </div>
  );
};
