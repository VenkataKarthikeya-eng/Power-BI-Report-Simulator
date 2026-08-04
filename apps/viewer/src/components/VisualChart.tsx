'use client';

import React from 'react';
import { VisualAST } from '@dcaps/types';

interface VisualChartProps {
  visual: VisualAST;
  activeFilter?: string;
  onCrossFilter: (visualId: string, value: string) => void;
}

export const VisualChart: React.FC<VisualChartProps> = ({ visual, activeFilter, onCrossFilter }) => {
  const isSelected = activeFilter && activeFilter.includes(visual.id);

  switch (visual.type) {
    case 'barChart':
    case 'horizontalBarChart':
      return (
        <div
          onClick={() => onCrossFilter(visual.id, 'Carrier_A')}
          className={`h-full flex flex-col justify-between p-4 bg-slate-900 border rounded-xl cursor-pointer transition-all ${
            isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-bold text-slate-200">{visual.title || 'Regional Carrier Freight Cost'}</div>
          <div className="space-y-2 my-auto">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>FedEx Freight</span>
                <span className="font-mono text-indigo-400">$42,500</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>DHL Global</span>
                <span className="font-mono text-cyan-400">$28,100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[60%]"></div>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 text-right font-mono">Click to slice visual data</span>
        </div>
      );

    case 'lineChart':
      return (
        <div
          onClick={() => onCrossFilter(visual.id, 'Q3_Trend')}
          className={`h-full flex flex-col justify-between p-4 bg-slate-900 border rounded-xl cursor-pointer transition-all ${
            isSelected ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-bold text-slate-200">{visual.title || 'Transit Delay Hours Trend'}</div>
          <div className="h-32 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-center text-[10px] font-mono text-indigo-400">
            [WASM Canvas Interactive Spline Curve Engine]
          </div>
          <span className="text-[10px] text-slate-500 text-right font-mono">Click to slice timeline</span>
        </div>
      );

    case 'kpiCard':
    case 'card':
      return (
        <div className="h-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-center">
          <span className="text-xs text-slate-400 font-medium">{visual.title || 'Total Freight Margin'}</span>
          <div className="text-2xl font-extrabold text-white tracking-tight mt-1">$1,482,900</div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">↑ +14.2% vs previous quarter</span>
        </div>
      );

    case 'matrix':
    case 'pivotTable':
    case 'table':
      return (
        <div className="h-full p-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="text-xs font-bold text-slate-200 mb-2">{visual.title || 'Carrier Performance Matrix'}</div>
          <div className="flex-1 border border-slate-800 rounded-lg overflow-y-auto">
            <table className="w-full text-left text-[11px] text-slate-300">
              <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-mono">
                <tr>
                  <th className="p-2">Carrier</th>
                  <th className="p-2">Delay (Hrs)</th>
                  <th className="p-2 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[10px]">
                <tr>
                  <td className="p-2 font-sans font-medium text-white">FedEx Freight</td>
                  <td className="p-2 text-emerald-400">12.4</td>
                  <td className="p-2 text-right">$42,500</td>
                </tr>
                <tr>
                  <td className="p-2 font-sans font-medium text-white">DHL Express</td>
                  <td className="p-2 text-rose-400">54.1</td>
                  <td className="p-2 text-right">$28,100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
          📊 Visual: {visual.title || visual.type}
        </div>
      );
  }
};
