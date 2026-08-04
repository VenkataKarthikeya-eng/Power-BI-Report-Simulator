'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, MetricCard } from '@dcaps/ui';

export default function AIOptimizationDashboardPage() {
  const [status, setStatus] = useState<'PENDING' | 'APPLIED' | 'ROLLED_BACK'>('PENDING');
  const [suggestions, setSuggestions] = useState([
    {
      id: 'opt_dax_filter_delayed',
      category: 'DAX',
      title: "Refactor FILTER(ALL()) in 'Delayed Shipments Count'",
      targetResource: 'Delayed Shipments Count',
      originalCodeOrConfig: 'CALCULATE(COUNTROWS(Fact_Shipments), FILTER(ALL(Fact_Shipments), Fact_Shipments[TransitDelayHours] > 48))',
      proposedCodeOrConfig: 'CALCULATE(COUNTROWS(Fact_Shipments), KEEPFILTERS(Fact_Shipments[TransitDelayHours] > 48))',
      rationale: 'Replaces full table scan with KEEPFILTERS context transition for 65% faster DuckDB WASM evaluation.',
      estimatedGainPercent: 65,
      applied: false,
    },
    {
      id: 'opt_lay_snap_101',
      category: 'LAYOUT',
      title: 'Snap Visual Containers to 8pt Grid',
      targetResource: 'Q3 Overview.vis_101',
      originalCodeOrConfig: 'X: 41px, Y: 39px',
      proposedCodeOrConfig: 'X: 40px, Y: 40px (8pt Grid Aligned)',
      rationale: 'Aligns visual container to standard 8pt grid system for pixel-perfect visual hierarchy.',
      estimatedGainPercent: 100,
      applied: false,
    },
    {
      "id": 'opt_vis_pie_201',
      "category": 'VISUAL',
      "title": "Replace Pie Chart 'Carrier Distribution' with Bar Chart",
      "targetResource": 'Carrier Distribution',
      "originalCodeOrConfig": 'visualType: pieChart (7 slices)',
      "proposedCodeOrConfig": 'visualType: horizontalBarChart',
      "rationale": 'Horizontal bar charts increase perceptual clarity for categorical comparisons over 5 slices.',
      "estimatedGainPercent": 40,
      "applied": false,
    },
  ]);

  const handleApply = async () => {
    setStatus('APPLIED');
    setSuggestions((prev) => prev.map((s) => ({ ...s, applied: true })));
  };

  const handleRollback = async () => {
    setStatus('ROLLED_BACK');
    setSuggestions((prev) => prev.map((s) => ({ ...s, applied: false })));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Optimization Engine</h1>
            <Badge variant={status === 'APPLIED' ? 'success' : status === 'ROLLED_BACK' ? 'warning' : 'info'}>
              {status}
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">Automatic DAX refactoring, 8pt grid layout snap, and visual enhancements.</p>
        </div>
        <div className="flex space-x-3">
          {status === 'APPLIED' ? (
            <Button variant="destructive" onClick={handleRollback}>
              ↩ Rollback Optimizations
            </Button>
          ) : (
            <Button variant="primary" onClick={handleApply}>
              ✨ Apply All Optimizations
            </Button>
          )}
          <a
            href="/capsules"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
          >
            Compile .dcaps Capsule →
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Overall Gain" value="+42%" change="PERFORMANCE" changeType="positive" />
        <MetricCard title="DAX Speedup" value="+65%" change="Sub-50ms" changeType="positive" />
        <MetricCard title="Grid Alignment" value="100%" change="8pt Snap" changeType="positive" />
        <MetricCard title="Size Savings" value="-58%" change="42MB -> 18MB" changeType="positive" />
      </div>

      {/* Optimization Proposals Grid */}
      <div className="space-y-6">
        <h3 className="text-base font-bold text-white">AI Optimization Proposals ({suggestions.length})</h3>

        {suggestions.map((sug) => (
          <Card key={sug.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant={sug.category === 'DAX' ? 'info' : 'neutral'}>{sug.category}</Badge>
                  <span className="text-xs font-mono text-slate-400">{sug.targetResource}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{sug.title}</h4>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full">
                +{sug.estimatedGainPercent}% Gain
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800">
              💡 <strong>AI Rationale:</strong> {sug.rationale}
            </p>

            {/* Before / After Code Diff View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-rose-950/20 border border-rose-900/50 rounded-xl space-y-1">
                <span className="text-rose-400 font-bold font-sans uppercase text-[10px]">Before Optimization</span>
                <pre className="text-rose-300 whitespace-pre-wrap">{sug.originalCodeOrConfig}</pre>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-xl space-y-1">
                <span className="text-emerald-400 font-bold font-sans uppercase text-[10px]">After AI Refactoring</span>
                <pre className="text-emerald-300 whitespace-pre-wrap">{sug.proposedCodeOrConfig}</pre>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
