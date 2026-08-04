'use client';

import React, { useState } from 'react';
import { Card, MetricCard, Badge, Button } from '@dcaps/ui';

export default function AdminPortalPage() {
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const [featureFlags, setFeatureFlags] = useState([
    { id: 'ff_01', key: 'ai_copilot_v2', name: 'AI Copilot RAG V2 Engine', isEnabled: true, rollout: 100 },
    { id: 'ff_02', key: 'wasm_simd_canvas', name: 'WebAssembly SIMD Visual Canvas', isEnabled: true, rollout: 50 },
    { id: 'ff_03', key: 'custom_kms_envelope', name: 'Custom AWS KMS Envelope Keys', isEnabled: false, rollout: 0 },
  ]);

  const toggleFlag = (id: string) => {
    setFeatureFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isEnabled: !f.isEnabled } : f))
    );
  };

  const handleTriggerBackup = () => {
    setBackupStatus('Creating point-in-time snapshot...');
    setTimeout(() => {
      setBackupStatus('✅ Backup created: dcaps_prod_backup_20260803.sql.gz (482 MB)');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
            DC
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Administration & Control Portal</h1>
            <p className="text-xs text-slate-400">Global SaaS governance, SOC2/GDPR compliance, metering, and disaster recovery.</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleTriggerBackup}>
            💾 Trigger Disaster Recovery Backup
          </Button>
          <Button variant="primary" onClick={() => alert('Generating SOC2 Type II Compliance Report...')}>
            📜 Export SOC2 / ISO Report
          </Button>
        </div>
      </div>

      {backupStatus && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-mono">
          {backupStatus}
        </div>
      )}

      {/* Infrastructure Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Cluster CPU Usage" value="18.4%" change="Normal Load" changeType="positive" />
        <MetricCard title="API P99 Latency" value="24 ms" change="Sub-50ms Target" changeType="positive" />
        <MetricCard title="Active WASM Sessions" value="142" change="12 Tenants" changeType="positive" />
        <MetricCard title="Database Pool" value="48 / 100" change="Healthy Connections" changeType="positive" />
      </div>

      {/* Organization License Metering & Governance */}
      <Card title="Organization License & Seat Metering">
        <div className="border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Organization</th>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Active Seats</th>
                <th className="p-3">Storage Used</th>
                <th className="p-3">Compliance</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              <tr>
                <td className="p-3 font-sans font-bold text-white">Global Supply Chain Corp</td>
                <td className="p-3"><Badge variant="info">ENTERPRISE</Badge></td>
                <td className="p-3 text-slate-300">42 / 50</td>
                <td className="p-3 text-slate-300">128 GB / 500 GB</td>
                <td className="p-3 text-emerald-400">SOC2 • GDPR • HIPAA</td>
                <td className="p-3 text-right font-sans">
                  <button className="text-indigo-400 font-semibold hover:underline text-xs">Manage IAM →</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Feature Flags Management */}
      <Card title="Global Feature Flags & Progressive Rollouts">
        <div className="space-y-4 divide-y divide-slate-800">
          {featureFlags.map((flag) => (
            <div key={flag.id} className="pt-4 flex justify-between items-center text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{flag.name}</span>
                  <code className="text-[10px] text-slate-500 font-mono">[{flag.key}]</code>
                </div>
                <span className="text-slate-400 block mt-0.5">Target Rollout: {flag.rollout}% of enterprise tenants</span>
              </div>
              <button
                onClick={() => toggleFlag(flag.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  flag.isEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {flag.isEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
