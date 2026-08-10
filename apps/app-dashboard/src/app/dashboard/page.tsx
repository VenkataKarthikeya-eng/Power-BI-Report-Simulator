'use client';

import React from 'react';
import { Card, Badge, SmartEmptyState, AiRecommendationCard } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { capsules, openViewer, openModal, isDemoMode } = useApp();
  const router = useRouter();

  const handleApplyOptimization = () => {
    openModal('autoFix');
  };

  const recentActivity = [
    { time: '10 mins ago', user: 'Alex Rivera (CEO)', action: 'Viewed Q3 Freight Margin Executive Briefing', badge: 'REPORT_VIEW' },
    { time: '1 hour ago', user: 'Sarah Chen (Analyst)', action: 'Uploaded global-supply-chain.pbix & created AI capsule', badge: 'CAPSULE_CREATED' },
    { time: '3 hours ago', user: 'Marcus Vance (Data Scientist)', action: 'Ran 1,000-run Monte Carlo scenario simulation', badge: 'SIMULATION_RUN' },
    { time: '5 hours ago', user: 'Elena Rostova (Admin)', action: 'Invited 3 new analytics team members to workspace', badge: 'IAM_INVITE' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Good morning Alex 👋</h1>
            <Badge variant="info">Global Supply Chain Analytics</Badge>
            {isDemoMode && <Badge variant="warning">250 Employees • 48 Dashboards</Badge>}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business performance overview and AI-driven strategic optimization recommendations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/copilot')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 shadow-sm"
          >
            <span>🤖 Ask AI Copilot</span>
          </button>
          <button
            id="btn-import-pbix"
            onClick={() => router.push('/import')}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2"
          >
            <span>+ Upload Dashboard</span>
          </button>
        </div>
      </div>

      {/* AI Recommendation Card */}
      <AiRecommendationCard
        title="AI Optimization Opportunity Detected"
        description="Your logistics & freight dashboard performance can improve by 32% by refactoring unindexed DAX measures and enabling DuckDB WASM columnar caching."
        impact="32% Speed Boost • 12 Recommendations"
        actionLabel="Apply Optimization"
        onAction={handleApplyOptimization}
      />

      {/* Realistic Enterprise Business Metrics Grid */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Business Performance & KPIs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900/90 border-slate-800 p-5">
            <div className="text-xs font-medium text-slate-400">Total Enterprise Revenue</div>
            <div className="text-3xl font-extrabold text-white mt-1">$25.4M</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <span>↑ +18.4% YoY Growth</span>
            </div>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800 p-5">
            <div className="text-xs font-medium text-slate-400">Net Profit Margin</div>
            <div className="text-3xl font-extrabold text-white mt-1">$7.8M</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <span>↑ +30.7% margin efficiency</span>
            </div>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800 p-5">
            <div className="text-xs font-medium text-slate-400">Annual Growth Rate</div>
            <div className="text-3xl font-extrabold text-purple-400 mt-1">+18.4%</div>
            <div className="text-xs font-medium text-purple-300 mt-1 flex items-center gap-1">
              <span>Target +15.0% exceeded</span>
            </div>
          </Card>

          <Card className="bg-slate-900/90 border-slate-800 p-5">
            <div className="text-xs font-medium text-slate-400">Active Customer Accounts</div>
            <div className="text-3xl font-extrabold text-white mt-1">45,230</div>
            <div className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1">
              <span>↑ +2,410 new accounts</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Grid: AI Health & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Health Score Summary */}
        <Card className="md:col-span-1 bg-slate-900/90 border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Health Index</span>
              <Badge variant="success">Verified</Badge>
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Overall Platform Health</h3>
            
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-extrabold text-emerald-400">94</span>
              <span className="text-lg text-slate-400 font-semibold">/ 100</span>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-800 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Dashboards</span>
                <span className="font-bold text-white">48 Dashboards</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total BI Reports</span>
                <span className="font-bold text-white">124 Reports</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">WASM Render Speed</span>
                <span className="font-bold text-emerald-400">18 ms (Sub-50ms)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Optimization Queue</span>
                <span className="font-bold text-purple-400">12 Recommendations</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/health')}
            className="w-full py-2.5 mt-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg transition-all"
          >
            View Full Health Analysis →
          </button>
        </Card>

        {/* Recent Team & Audit Activity */}
        <Card className="md:col-span-2 bg-slate-900/90 border-slate-800 p-6" title="Recent Team Activity" subtitle="Real-time audit log of report uploads, AI sessions, and viewings">
          <div className="space-y-4 mt-4">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-sm font-bold text-indigo-300 shrink-0">
                    👤
                  </div>
                  <div>
                    <div className="font-bold text-white">{act.user}</div>
                    <div className="text-slate-300 mt-0.5">{act.action}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">{act.time}</span>
                  <Badge variant="info">{act.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active AI Dashboard Capsules Table */}
      <Card title="Active Dashboard Capsules" subtitle="Ingested, encrypted, and compiled Power BI reports">
        {capsules.length === 0 ? (
          <SmartEmptyState
            title="No dashboard capsules created yet."
            description="Upload your Power BI report file to convert it into a standalone AI dashboard capsule."
            primaryActionLabel="Upload Your Dashboard"
            onPrimaryAction={() => router.push('/import')}
            secondaryActionLabel="Explore Demo Workspace"
            onSecondaryAction={() => openModal('createWorkspace')}
          />
        ) : (
          <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Dashboard Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Health Score</th>
                  <th className="px-4 py-3">Size Savings</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {capsules.map((capsule) => (
                  <tr key={capsule.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{capsule.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={capsule.status === 'PUBLISHED' ? 'success' : 'info'}>
                        {capsule.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{capsule.healthScore} / 100</td>
                    <td className="px-4 py-3 text-slate-400">{capsule.savings}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openViewer(capsule.id, capsule.name)}
                        className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-colors"
                      >
                        View Dashboard →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
