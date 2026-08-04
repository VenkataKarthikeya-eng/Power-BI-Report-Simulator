'use client';

import React, { useState } from 'react';
import { Card, MetricCard, Button, Badge } from '@dcaps/ui';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'PERFORMANCE' | 'AI' | 'SECURITY'>('EXECUTIVE');

  const handleExport = (format: string) => {
    alert(`Exporting telemetry report as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Telemetry & Business Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Columnar ClickHouse analytics tracking viewer sessions, visual heatmaps, and AI adoption.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            📄 CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            📊 Excel
          </Button>
          <Button variant="primary" onClick={() => handleExport('pdf')}>
            📥 Export PDF Report
          </Button>
        </div>
      </div>

      {/* Analytics Sub-Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        {[
          { id: 'EXECUTIVE', label: '📊 Executive Overview' },
          { id: 'PERFORMANCE', label: '⚡ WASM Performance' },
          { id: 'AI', label: '🤖 AI Adoption' },
          { id: 'SECURITY', label: '🔒 Security & Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Executive */}
      {activeTab === 'EXECUTIVE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Total Dashboard Views" value="14,200" change="+18% this month" changeType="positive" />
            <MetricCard title="Avg Session Duration" value="4m 12s" change="+32s" changeType="positive" />
            <MetricCard title="Active Viewers" value="1,840" change="Across 12 Orgs" changeType="positive" />
            <MetricCard title="Bounce Rate" value="12.4%" change="-2.1%" changeType="positive" />
          </div>

          <Card title="Viewer Attention Heatmap" subtitle="Most clicked interactive visual slicers & charts">
            <div className="h-64 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-xs font-mono text-indigo-400">
              [ClickHouse Columnar Visual Attention Matrix — Top Slicer: Geographic Region (42% clicks)]
            </div>
          </Card>
        </div>
      )}

      {/* Tab Content: Performance */}
      {activeTab === 'PERFORMANCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="WASM Query Latency" value="28ms" change="Sub-50ms Target" changeType="positive" />
            <MetricCard title="Avg Load Time" value="180ms" change="P99: 310ms" changeType="positive" />
            <MetricCard title="Avg Memory Footprint" value="42 MB" change="Client Browser" changeType="positive" />
            <MetricCard title="Compression Ratio" value="-58.1%" change="Gzip Binary" changeType="positive" />
          </div>
        </div>
      )}

      {/* Tab Content: AI */}
      {activeTab === 'AI' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Prompts Processed" value="8,420" change="+45% this month" changeType="positive" />
            <MetricCard title="AI Response Latency" value="320ms" change="RAG Engine" changeType="positive" />
            <MetricCard title="Recommendation Acceptance" value="84.5%" change="1-Click Apply" changeType="positive" />
            <MetricCard title="Top Category" value="DAX Explanation" change="52% of queries" changeType="neutral" />
          </div>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard title="Failed Access Attempts" value="12" change="Passcode Blocked" changeType="positive" />
            <MetricCard title="Permission Violations" value="0" change="Clean Audit" changeType="positive" />
            <MetricCard title="Expired Link Access" value="4" change="Auto-Revoked" changeType="neutral" />
            <MetricCard title="Tampering Attempts" value="0" change="ECDSA Verified" changeType="positive" />
          </div>
        </div>
      )}
    </div>
  );
}
