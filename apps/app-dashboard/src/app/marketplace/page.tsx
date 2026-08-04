'use client';

import React, { useState } from 'react';
import { Card, Badge, Button } from '@dcaps/ui';

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'CONNECTORS' | 'MARKETPLACE' | 'WEBHOOKS'>('CONNECTORS');

  const [biAdapters, setBiAdapters] = useState([
    { name: 'Microsoft Power BI (.pbix / .pbit)', status: 'ACTIVE', icon: '📊', isNative: true },
    { name: 'Tableau Workbook (.twbx / .twb)', status: 'READY', icon: '📈', isNative: false },
    { name: 'Looker LookML (.lkml)', status: 'READY', icon: '🔍', isNative: false },
    { name: 'Qlik Sense (.qvf)', status: 'READY', icon: '💡', isNative: false },
    { name: 'Apache Superset', status: 'COMMUNITY', icon: '⚡', isNative: false },
    { name: 'Metabase Dashboard', status: 'COMMUNITY', icon: '📦', isNative: false },
  ]);

  const [plugins, setPlugins] = useState([
    {
      id: 'plugin_tableau_adapter',
      name: 'Tableau Workbook Ingestion Adapter',
      version: 'v1.2.0',
      category: 'BI ADAPTER',
      author: 'Capsule AI Core Team',
      description: 'Parses Tableau XML workbooks into standardized Dashboard AST.',
      rating: '4.9 ★',
      installed: true,
    },
    {
      id: 'plugin_slack_notifications',
      name: 'Slack Enterprise Alert Sync',
      version: 'v2.0.1',
      category: 'INTEGRATION',
      author: 'Slack Ecosystem',
      description: 'Sends real-time capsule compilation and health alerts to Slack channels.',
      rating: '4.8 ★',
      installed: true,
    },
    {
      id: 'plugin_sankey_visual',
      name: '3D Sankey Flow Custom Visual',
      version: 'v1.0.4',
      category: 'CUSTOM VISUAL',
      author: 'DataViz Studio Pro',
      description: 'Renders interactive flow transitions on the WASM Viewer canvas.',
      rating: '4.7 ★',
      installed: false,
    },
  ]);

  const toggleInstall = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, installed: !p.installed } : p))
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Multi-BI Platform & Plugin Marketplace</h1>
          <p className="text-sm text-slate-400 mt-1">Universal BI adapters, custom visual plugins, webhooks, and third-party integrations.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => alert('Developer SDK Guide: @dcaps/sdk')}>
            📚 Developer SDK Guide
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('WEBHOOKS')}>
            ⚡ Manage Webhooks
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3">
        {[
          { id: 'CONNECTORS', label: '🔌 Multi-BI Connectors' },
          { id: 'MARKETPLACE', label: '🛍️ Plugin Marketplace' },
          { id: 'WEBHOOKS', label: '⚓ Webhooks & OAuth APIs' },
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

      {/* Multi-BI Connectors Tab */}
      {activeTab === 'CONNECTORS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {biAdapters.map((bi, idx) => (
            <Card key={idx} className="p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{bi.icon}</span>
                <Badge variant={bi.status === 'ACTIVE' ? 'success' : 'info'}>{bi.status}</Badge>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{bi.name}</h3>
              <p className="text-xs text-slate-400">
                {bi.isNative ? 'Native VertiPaq schema & layout AST engine.' : 'Plugin SDK BI Provider Adapter.'}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Plugin Marketplace Tab */}
      {activeTab === 'MARKETPLACE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plugins.map((plugin) => (
            <Card key={plugin.id} className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="neutral">{plugin.category}</Badge>
                  <span className="text-xs font-bold text-amber-400">{plugin.rating}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{plugin.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{plugin.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 font-mono">By {plugin.author}</span>
                <button
                  onClick={() => toggleInstall(plugin.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    plugin.installed
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {plugin.installed ? '✓ INSTALLED' : 'GET PLUGIN'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Webhooks & OAuth APIs Tab */}
      {activeTab === 'WEBHOOKS' && (
        <Card title="Active Webhook Subscriptions">
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Target Endpoint URL</th>
                  <th className="p-3">Subscribed Events</th>
                  <th className="p-3">Secret Token</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                <tr>
                  <td className="p-3 font-sans font-medium text-white">https://hooks.slack.com/services/T00/B00/XXXXX</td>
                  <td className="p-3 text-indigo-400">capsule.built, health.alert</td>
                  <td className="p-3 text-slate-500">whsec_8f9102...30c9</td>
                  <td className="p-3 text-right font-sans">
                    <button className="text-rose-400 hover:text-rose-300 font-medium">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
