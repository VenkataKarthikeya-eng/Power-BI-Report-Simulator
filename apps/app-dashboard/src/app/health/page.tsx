'use client';

import React from 'react';
import { Card, MetricCard, Badge, useToast } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';

export default function HealthScorePage() {
  const { openModal } = useApp();
  const { showToast } = useToast();

  const report = {
    scores: {
      overallScore: 94,
      performanceScore: 96,
      securityScore: 100,
      accessibilityScore: 88,
      designScore: 95,
    },
    recommendations: [
      {
        id: 'rec_h_001',
        priority: 'P1',
        title: 'Apply RLS Filtering to DriverSSN Column',
        category: 'SECURITY',
        businessImpact: 'Prevents GDPR compliance penalties and unauthorized PII leakage.',
        technicalImpact: 'Injects RLS predicate during VertiPaq query generation.',
        estimatedTime: '15 mins',
        estimatedImprovement: '100% Compliance',
      },
      {
        id: 'rec_h_002',
        priority: 'P2',
        title: 'Refactor FILTER(ALL()) to KEEPFILTERS in Delayed Shipments',
        category: 'DAX',
        businessImpact: 'Accelerates executive dashboard render time for mobile users.',
        technicalImpact: 'Eliminates full table scan in DuckDB WASM engine.',
        estimatedTime: '5 mins',
        estimatedImprovement: '+65% Speedup',
      },
      {
        id: 'rec_h_003',
        priority: 'P3',
        title: 'Adjust Metric Card Subtitle Color Contrast (WCAG 2.2 AA)',
        category: 'ACCESSIBILITY',
        businessImpact: 'Improves visual readability for low-vision executives.',
        technicalImpact: 'Updates CSS token from #888888 to #A1A1AA for 5.2:1 ratio.',
        estimatedTime: '2 mins',
        estimatedImprovement: '+12% Accessibility',
      },
    ],
  };

  const handleExport = (format: string) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `health_report.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast({
      type: 'success',
      title: 'Health Report Downloaded',
      message: `Exported report payload as ${format.toUpperCase()} file.`,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Dashboard Health Index</h1>
            <Badge variant="info">Step 3 of 4</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous multi-dimensional evaluation across Performance, Security, Accessibility & Design.
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('json')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold"
          >
            📄 JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold"
          >
            📊 Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
          >
            📥 Export Health Report
          </button>
        </div>
      </div>

      {/* Hero Health Score Card */}
      <Card className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-slate-950 shadow-xl shrink-0">
              <span className="text-3xl font-extrabold text-white">{report.scores.overallScore}</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">/ 100</span>
            </div>
            <div>
              <Badge variant="success">EXCELLENT HEALTH</Badge>
              <h2 className="text-xl font-bold text-white mt-1">Q3_Logistics_Global.pbix</h2>
              <p className="text-xs text-slate-400 mt-1">Evaluated across 7 dimensions • Sub-50ms WASM query target met</p>
            </div>
          </div>
          <button
            onClick={() => openModal('autoFix')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all shrink-0"
          >
            ✨ Run 1-Click Auto-Fix →
          </button>
        </div>
      </Card>

      {/* Score Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Performance" value={`${report.scores.performanceScore}%`} change="WASM Optimized" changeType="positive" />
        <MetricCard title="Security" value={`${report.scores.securityScore}%`} change="AES-256 KMS" changeType="positive" />
        <MetricCard title="Accessibility" value={`${report.scores.accessibilityScore}%`} change="WCAG 2.2 AA" changeType="neutral" />
        <MetricCard title="Design & Grid" value={`${report.scores.designScore}%`} change="8pt Snap" changeType="positive" />
      </div>

      {/* Prioritized Recommendation Roadmap */}
      <Card title="Prioritized Health Improvement Roadmap">
        <div className="space-y-4 divide-y divide-slate-800">
          {report.recommendations.map((rec) => (
            <div key={rec.id} className="pt-4 flex justify-between items-start text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <Badge variant={rec.priority === 'P1' ? 'error' : rec.priority === 'P2' ? 'warning' : 'info'}>
                    {rec.priority}
                  </Badge>
                  <span className="font-bold text-white text-sm">{rec.title}</span>
                </div>
                <p className="text-slate-300">{rec.businessImpact}</p>
                <p className="text-slate-500 font-mono text-[11px]">Technical: {rec.technicalImpact}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-emerald-400 font-semibold block">{rec.estimatedImprovement}</span>
                <span className="text-slate-400 text-[10px] block">Est: {rec.estimatedTime}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
