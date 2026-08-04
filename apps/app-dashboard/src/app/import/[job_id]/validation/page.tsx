'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, MetricCard } from '@dcaps/ui';

export default function AIValidationDashboardPage() {
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedFinding, setSelectedFinding] = useState<any>(null);
  const [report, setReport] = useState<any>({
    overallScore: 78,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 1,
    infoCount: 0,
    findings: [
      {
        id: 'val_sec_pii_001',
        category: 'SECURITY',
        severity: 'CRITICAL',
        title: "Potential PII Exposure: Column 'DriverSSN'",
        problemDescription: "Column 'DriverSSN' in table 'Fact_Shipments' contains unencrypted sensitive identifier pattern.",
        rootCause: "Unencrypted PII included in raw data model dictionary without RLS masking.",
        recommendation: "Apply Row-Level Security (RLS) or mask column values prior to capsule compilation.",
        estimatedImpact: "Prevention of GDPR/HIPAA compliance violation",
        confidenceScore: 95,
        affectedResource: 'Fact_Shipments.DriverSSN',
      },
      {
        id: 'val_dax_filter_002',
        category: 'DAX',
        severity: 'HIGH',
        title: "Inefficient DAX Pattern in 'Delayed Shipments Count'",
        problemDescription: "Misuse of FILTER(ALL(...)) causing full table scan during evaluation.",
        rootCause: "FILTER(ALL()) overrides VertiPaq storage engine optimizations.",
        recommendation: "Refactor measure to use KEEPFILTERS or REMOVEFILTERS for sub-50ms query execution.",
        estimatedImpact: "50% - 80% DAX evaluation speed improvement",
        confidenceScore: 92,
        affectedResource: 'Delayed Shipments Count',
      },
      {
        id: 'val_str_empty_003',
        category: 'STRUCTURE',
        severity: 'MEDIUM',
        title: "Empty Report Page: Draft_Scratchpad",
        problemDescription: "Page 'Draft_Scratchpad' contains zero visual elements.",
        rootCause: "Unused blank page left in PBIX before publishing.",
        recommendation: "Delete empty page or add required visuals to save storage.",
        estimatedImpact: "Slight layout clutter reduction",
        confidenceScore: 95,
        affectedResource: 'Draft_Scratchpad',
      },
    ],
  });

  const filteredFindings = report.findings.filter(
    (f: any) => selectedSeverity === 'ALL' || f.severity === selectedSeverity
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Validation Engine Findings</h1>
          <p className="text-sm text-slate-400 mt-1">Pre-packaging report inspection & automated linting analysis.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Export Markdown Report</Button>
          <a href="/import" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
            Proceed to Optimization →
          </a>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MetricCard title="Validation Score" value={`${report.overallScore} / 100`} change="NEEDS REVIEW" changeType="neutral" />
        <MetricCard title="Critical" value={report.criticalCount} changeType="negative" />
        <MetricCard title="High" value={report.highCount} changeType="negative" />
        <MetricCard title="Medium" value={report.mediumCount} changeType="neutral" />
        <MetricCard title="Low / Info" value={report.lowCount + report.infoCount} changeType="positive" />
      </div>

      {/* Severity Filter Controls */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSelectedSeverity(sev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedSeverity === sev
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {sev} ({sev === 'ALL' ? report.findings.length : report.findings.filter((f: any) => f.severity === sev).length})
          </button>
        ))}
      </div>

      {/* Findings List & Detail Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {filteredFindings.map((finding: any) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFinding(finding)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedFinding?.id === finding.id
                  ? 'border-indigo-500 bg-slate-900/90 shadow-lg'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant={finding.severity === 'CRITICAL' || finding.severity === 'HIGH' ? 'error' : 'warning'}>
                    {finding.severity}
                  </Badge>
                  <span className="text-xs font-mono text-slate-500">[{finding.category}]</span>
                </div>
                <span className="text-xs text-indigo-400 font-medium">Confidence: {finding.confidenceScore}%</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{finding.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{finding.problemDescription}</p>
            </div>
          ))}
        </div>

        {/* Selected Finding Detail Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit sticky top-24 space-y-4">
          {selectedFinding ? (
            <>
              <div>
                <Badge variant={selectedFinding.severity === 'CRITICAL' ? 'error' : 'warning'}>
                  {selectedFinding.severity}
                </Badge>
                <h3 className="text-base font-bold text-white mt-2">{selectedFinding.title}</h3>
                <span className="text-xs font-mono text-slate-500">{selectedFinding.affectedResource}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Problem Description</h4>
                <p className="text-xs text-slate-300 mt-1">{selectedFinding.problemDescription}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Root Cause Analysis</h4>
                <p className="text-xs text-slate-300 mt-1">{selectedFinding.rootCause}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">AI Recommendation</h4>
                <p className="text-xs text-indigo-300 mt-1 bg-indigo-950/40 border border-indigo-800/40 p-3 rounded-lg">
                  💡 {selectedFinding.recommendation}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase">Estimated Impact</h4>
                <p className="text-xs text-emerald-400 mt-1">{selectedFinding.estimatedImpact}</p>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              Select a validation finding to view detailed AI analysis & root cause recommendation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
