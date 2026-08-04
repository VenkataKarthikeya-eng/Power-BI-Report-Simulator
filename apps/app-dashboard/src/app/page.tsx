import React from 'react';
import { Card, Badge, Button } from '@dcaps/ui';

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive BI Workspace</h1>
          <p className="text-sm text-slate-400 mt-1">Manage, optimize, and distribute secure dashboard capsules.</p>
        </div>
        <Button variant="primary" size="md">
          + Import PBIX Report
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Total Capsules">
          <div className="text-3xl font-extrabold text-white">128</div>
          <p className="text-xs text-emerald-400 mt-1">↑ +12 this week</p>
        </Card>
        <Card title="Active Shares">
          <div className="text-3xl font-extrabold text-white">45</div>
          <p className="text-xs text-slate-400 mt-1">3 passcode protected</p>
        </Card>
        <Card title="Avg Health Score">
          <div className="text-3xl font-extrabold text-emerald-400">94 / 100</div>
          <p className="text-xs text-slate-400 mt-1">Optimized by AI</p>
        </Card>
        <Card title="Total Views">
          <div className="text-3xl font-extrabold text-indigo-400">14,200</div>
          <p className="text-xs text-slate-400 mt-1">Telemetry active</p>
        </Card>
      </div>

      {/* Recent Capsules Table */}
      <Card title="Recent Dashboard Capsules" subtitle="Ingested & compiled Power BI reports">
        <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Dashboard Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Health Index</th>
                <th className="px-4 py-3">Size Savings</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium text-white">Q3_Logistics_Global.pbix</td>
                <td className="px-4 py-3"><Badge variant="success">PUBLISHED</Badge></td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">96 / 100</td>
                <td className="px-4 py-3 text-slate-400">-58% (42MB)</td>
                <td className="px-4 py-3 text-right">
                  <a href="http://localhost:3003" className="text-indigo-400 hover:text-indigo-300 font-medium">Launch Viewer →</a>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40">
                <td className="px-4 py-3 font-medium text-white">HR_Compensation_2026.pbix</td>
                <td className="px-4 py-3"><Badge variant="info">ENCRYPTED</Badge></td>
                <td className="px-4 py-3 text-emerald-400 font-semibold">92 / 100</td>
                <td className="px-4 py-3 text-slate-400">-64% (18MB)</td>
                <td className="px-4 py-3 text-right">
                  <a href="http://localhost:3003" className="text-indigo-400 hover:text-indigo-300 font-medium">Launch Viewer →</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
