'use client';

import React, { useState } from 'react';
import { Card, Badge } from '@dcaps/ui';

export default function BusinessAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'sales' | 'profit' | 'customer' | 'ops'>('revenue');

  const regionalData = [
    { region: 'North America', revenue: '$5.2M', profit: '$1.6M', margin: '30.7%', growth: '+22%' },
    { region: 'Europe Logistics', revenue: '$3.8M', profit: '$1.1M', margin: '28.9%', growth: '+15%' },
    { region: 'Asia Pacific Transit', revenue: '$2.4M', profit: '$0.8M', margin: '33.3%', growth: '+19%' },
    { region: 'Latin America Supply', revenue: '$1.0M', profit: '$0.3M', margin: '30.0%', growth: '+11%' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Business Analytics Module</h1>
            <Badge variant="success">Live Enterprise Telemetry</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Explore multi-dimensional financial, operational, and customer analytics generated from your dashboard capsules.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'revenue', label: 'Revenue Analytics' },
          { id: 'sales', label: 'Sales Analytics' },
          { id: 'profit', label: 'Profit Analytics' },
          { id: 'customer', label: 'Customer Analytics' },
          { id: 'ops', label: 'Operational Analytics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-5">
          <div className="text-xs font-medium text-slate-400">Quarterly Revenue</div>
          <div className="text-3xl font-extrabold text-white mt-1">$12.4M</div>
          <div className="text-xs text-emerald-400 mt-1">↑ +18% QoQ</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-5">
          <div className="text-xs font-medium text-slate-400">Gross Margin</div>
          <div className="text-3xl font-extrabold text-white mt-1">30.6%</div>
          <div className="text-xs text-emerald-400 mt-1">↑ +2.4% vs benchmark</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-5">
          <div className="text-xs font-medium text-slate-400">Total Customer Accounts</div>
          <div className="text-3xl font-extrabold text-purple-400 mt-1">45,230</div>
          <div className="text-xs text-purple-300 mt-1">98.4% Retention</div>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-5">
          <div className="text-xs font-medium text-slate-400">WASM Query Speed</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-1">18 ms</div>
          <div className="text-xs text-indigo-300 mt-1">DuckDB Sub-50ms SLA</div>
        </Card>
      </div>

      {/* Regional Performance Table */}
      <Card title="Regional Performance Breakdown" subtitle="Financial analytics segmented by geographical territory">
        <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Revenue</th>
                <th className="px-4 py-3">Net Profit</th>
                <th className="px-4 py-3">Profit Margin</th>
                <th className="px-4 py-3">Growth Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {regionalData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-sans font-medium text-white">{row.region}</td>
                  <td className="px-4 py-3 text-white font-bold">{row.revenue}</td>
                  <td className="px-4 py-3 text-emerald-400">{row.profit}</td>
                  <td className="px-4 py-3 text-indigo-400">{row.margin}</td>
                  <td className="px-4 py-3 text-purple-400">{row.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
