'use client';

import React, { useState } from 'react';
import { Card, MetricCard, Badge, Button } from '@dcaps/ui';

export default function HealthScorePage() {
  const [report, setReport] = useState<any>({
    scores: {
      overallScore: 94,
      performanceScore: 96,
      securityScore: 100,
      accessibilityScore: 88,
      designScore: 95,
      dataModelScore: 92,
      daxScore: 90,
      aiReadinessScore: 94,
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
        confidenceScore: 98,
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
        confidenceScore: 95,
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
        confidenceScore: 90,
      },
    ],
    predictions: [
      { metricName: 'WASM Query Latency', currentValue: '28 ms', predicted30Days: '30 ms', predicted90Days: '32 ms', trendStatus: 'OPTIMAL' },
      { metricName: 'Capsule Storage Footprint', currentValue: '18.4 MB', predicted30Days: '19.2 MB', predicted90Days: '21.0 MB', trendStatus: 'STABLE' },
      { metricName: 'Monthly Active Viewers', currentValue: '1,840', predicted30Days: '2,400', predicted90Days: '3,800', trendStatus: 'OPTIMAL' },
    ],
  });

  const handleExport = (format: string) => {
    alert(`Exporting Health Report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Dashboard Health Index</h1>
          <p className="text-sm text-slate-400 mt-1">Continuous multi-dimensional evaluation across Performance, Security, Accessibility & Design.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExport('json')}>
            📄 JSON
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            📊 Excel
          </Button>
          <Button variant="primary" onClick={() => handleExport('pdf')}>
            📥 Export Health PDF
          </Button>
        </div>
      </div>

      {/* Hero Health Score Card */}
      <Card className="p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center bg-slate-950 shadow-xl">
              <span className="text-3xl font-extrabold text-white">{report.scores.overallScore}</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">/ 100</span>
            </div>
            <div>
              <Badge variant="success">EXCELLENT HEALTH</Badge>
              <h2 className="text-xl font-bold text-white mt-1">Q3_Logistics_Global.pbix</h2>
              <p className="text-xs text-slate-400 mt-1">Evaluated across 7 dimensions • Sub-50ms query target met</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <a href="/import/dash_3c91a02b/optimization" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg">
              ✨ Auto-Fix All Issues →
            </a>
          </div>
        </div>
      </Card>

      {/* 7-Dimension Score Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Performance" value={`${report.scores.performanceScore}%`} change="WASM Optimized" changeType="positive" />
        <MetricCard title="Security" value={`${report.scores.securityScore}%`} change="AES-256 KMS" changeType="positive" />
        <MetricCard title="Accessibility" value={`${report.scores.accessibilityScore}%`} change="WCAG 2.2 AA" changeType="neutral" />
        <MetricCard title="Design & Grid" value={`${report.scores.designScore}%`} change="8pt Snap" changeType="positive" />
      </div>

      {/* Predictive Trends Panel */}
      <Card title="AI Predictive Intelligence (90-Day Forecast)" subtitle="Machine learning trend projection engine">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.predictions.map((p: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">{p.metricName}</span>
                <Badge variant={p.trendStatus === 'OPTIMAL' ? 'success' : 'info'}>{p.trendStatus}</Badge>
              </div>
              <div className="text-xl font-mono font-bold text-indigo-400">{p.currentValue}</div>
              <div className="text-[10px] text-slate-400 flex justify-between pt-2 border-t border-slate-800">
                <span>30d: {p.predicted30Days}</span>
                <span>90d: {p.predicted90Days}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Prioritized Recommendation Roadmap */}
      <Card title="Prioritized Health Improvement Roadmap">
        <div className="space-y-4 divide-y divide-slate-800">
          {report.recommendations.map((rec: any) => (
            <div key={rec.id} className="pt-4 flex justify-between items-start text-xs">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center space-x-2">
                  <Badge variant={rec.priority === 'P1' ? 'error' : rec.priority === 'P2' ? 'warning' : 'info'}>
                    {rec.priority}
                  </Badge>
                  <span className="font-bold text-white text-sm">{rec.title}</span>
                </div>
                <p className="text-slate-300">{rec.businessImpact}</p>
                <p className="text-slate-500 font-mono">Technical: {rec.technicalImpact}</p>
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
