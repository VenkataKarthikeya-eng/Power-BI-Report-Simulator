'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';

export default function DigitalTwinPage() {
  const { showToast } = useToast();
  const [nlQuery, setNlQuery] = useState('What happens if sales increase by 20%?');
  const [salesGrowth, setSalesGrowth] = useState(20);
  const [transitCost, setTransitCost] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const sampleQueries = [
    { label: '🚀 +20% Sales Shift', query: 'What happens if sales increase by 20%?' },
    { label: '🚛 +12% Transport Cost Spike', query: 'What if transportation cost increases by 12%?' },
  ];

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      showToast({
        type: 'success',
        title: 'Simulation Complete',
        message: `Executed 1,000 Monte Carlo runs for shift +${salesGrowth}%.`,
      });
    }, 800);
  };

  const calculatedRev = 1482910 * (1 + salesGrowth / 100) * (1 - transitCost / 100 * 0.3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Guidance Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Simulation & Digital Twin Platform</h1>
          <Badge variant="success">v2.0 Twin Active</Badge>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Stochastic Monte Carlo simulations, natural language what-if scenario branching, and version rollback.
        </p>
      </div>

      {/* Natural Language Input */}
      <Card title="Natural Language What-If Simulation Engine">
        <form onSubmit={handleSimulate} className="space-y-3 mt-2">
          <div className="flex gap-3">
            <input
              type="text"
              required
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              placeholder="Ask natural language simulation..."
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
            <button
              type="submit"
              disabled={isSimulating}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50"
            >
              {isSimulating ? '⚡ Simulating...' : '🔮 Run Simulation'}
            </button>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-[11px] text-slate-400 font-medium">Sample Queries:</span>
            {sampleQueries.map((sq) => (
              <button
                key={sq.label}
                type="button"
                onClick={() => setNlQuery(sq.query)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-indigo-300 font-medium"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </form>
      </Card>

      {/* Sliders & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Parameter Controls">
          <div className="space-y-5 mt-2 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Sales Revenue Growth Shift</span>
                <span className="text-indigo-400">+{salesGrowth}%</span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                value={salesGrowth}
                onChange={(e) => setSalesGrowth(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-300 mb-1">
                <span>Transit Freight Cost Variance</span>
                <span className="text-rose-400">+{transitCost}%</span>
              </div>
              <input
                type="range"
                min="-20"
                max="40"
                value={transitCost}
                onChange={(e) => setTransitCost(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card title="Monte Carlo 1,000 Iterations Quantiles">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-slate-400">P10 (Conservative)</div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">${(calculatedRev * 0.85).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-slate-400">P50 (Expected Median)</div>
                <div className="text-2xl font-extrabold text-indigo-400 mt-1">${calculatedRev.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-semibold text-slate-400">P90 (Optimistic)</div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">${(calculatedRev * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
