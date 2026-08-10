'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function ViewerModal() {
  const { modals, closeViewer } = useApp();
  const [activeTab, setActiveTab] = useState('Overview');
  const [regionFilter, setRegionFilter] = useState('All');

  if (!modals.viewer.open) return null;

  const capsuleTitle = modals.viewer.capsuleName || 'Q3_Logistics_Global.dcaps';

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md text-xs">
              DC
            </div>
            <div>
              <div className="font-bold text-sm text-white flex items-center space-x-2">
                <span>{capsuleTitle}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                  ECDSA SIGNED
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Client-Side Direct Canvas Runtime • AES-256 Encrypted</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white"
            >
              <option value="All">Filter: All Regions</option>
              <option value="NorthAmerica">North America</option>
              <option value="EMEA">EMEA Transit</option>
              <option value="APAC">APAC Routes</option>
            </select>
            <button onClick={closeViewer} className="text-slate-400 hover:text-white text-sm font-bold p-1">
              ✕
            </button>
          </div>
        </header>

        {/* Viewer Content Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950 space-y-6">
          {/* KPI Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase font-semibold">Total Freight Margin</span>
              <div className="text-2xl font-extrabold text-white mt-1">
                {regionFilter === 'EMEA' ? '$420,500' : regionFilter === 'APAC' ? '$380,100' : '$1,482,910'}
              </div>
              <span className="text-[10px] text-emerald-400">↑ +14.2% YoY</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase font-semibold">Avg Transit Delay</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">
                {regionFilter === 'EMEA' ? '62.4 hrs' : '54.1 hrs'}
              </div>
              <span className="text-[10px] text-slate-400">DHL Express route spike</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase font-semibold">Active Shipments</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">12,840</div>
              <span className="text-[10px] text-emerald-400">100% On-time tracking</span>
            </div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <span className="text-xs text-slate-400 uppercase font-semibold">WASM Render Speed</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">18 ms</div>
              <span className="text-[10px] text-slate-400">DuckDB Columnar AST</span>
            </div>
          </div>

          {/* Interactive Chart Canvas Representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Carrier Volume Allocation</h4>
                <span className="text-[10px] text-slate-500 font-mono">Cross-Filter Enabled</span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>FedEx Freight</span>
                    <span>42.5%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div className="bg-indigo-500 h-3 rounded-full w-[42.5%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>DHL Express</span>
                    <span>31.0%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div className="bg-cyan-500 h-3 rounded-full w-[31%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>UPS Supply Chain</span>
                    <span>26.5%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full w-[26.5%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-white">Delay Hours Trend (Q3)</h4>
                <span className="text-[10px] text-emerald-400 font-mono">AI Anomaly Monitored</span>
              </div>
              <div className="h-40 flex items-end space-x-3 pt-6">
                {[35, 42, 28, 54, 68, 48, 52, 38, 44].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        h > 60 ? 'bg-rose-500' : 'bg-indigo-500 hover:bg-indigo-400'
                      }`}
                      style={{ height: `${h * 1.8}px` }}
                    />
                    <span className="text-[9px] text-slate-500 font-mono">W{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="h-12 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between shrink-0 text-xs">
          <div className="flex space-x-2">
            {['Overview', 'Regional Breakdown', 'Carrier Details'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                📄 {tab}
              </button>
            ))}
          </div>
          <span className="text-slate-500 font-mono text-[10px]">
            Runtime: DuckDB WASM • Visual Container AST v2.0
          </span>
        </footer>
      </div>
    </div>
  );
}
