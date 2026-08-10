'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';

export default function SecurityCenterPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'AUDIT' | 'SECURITY' | 'VERIFICATION'>('AUDIT');

  const auditLogs = [
    { timestamp: '2026-08-10 19:42:10', user: 'Alex Rivera', event: 'LOGIN_SUCCESS', details: 'Authenticated via SSO (CEO Profile)', status: 'SUCCESS' },
    { timestamp: '2026-08-10 19:40:15', user: 'Sarah Chen', event: 'REPORT_ACCESS', details: 'Opened global-logistics.dcaps viewer', status: 'SUCCESS' },
    { timestamp: '2026-08-10 19:35:22', user: 'Marcus Vance', event: 'SHARE_LINK_CREATED', details: 'Created passcode-protected token link', status: 'SUCCESS' },
    { timestamp: '2026-08-10 19:12:04', user: 'Unknown IP', event: 'INVALID_PASSCODE', details: 'Failed token entry attempt', status: 'BLOCKED' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security & Verification Center</h1>
            <Badge variant="success">Zero-Trust Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time data security, dashboard verification badges, cryptographic signatures, and audit logs.
          </p>
        </div>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Dashboard Verification</div>
            <Badge variant="success">Verified Badge</Badge>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">ECDSA P-384 Signed</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All compiled dashboard capsules carry cryptographic hardware signatures guaranteeing dataset integrity and origin authenticity.
          </p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Data Security</div>
            <Badge variant="info">Encrypted</Badge>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">AWS KMS Envelope AES-256</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            VertiPaq datasets and DAX formulas are encrypted with dedicated KMS keys before client storage or link distribution.
          </p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Access Control</div>
            <Badge variant="info">Active</Badge>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Row-Level Security (RLS)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fine-grained role-based column masking automatically hides PII (e.g. SSNs, salaries) based on active user context.
          </p>
        </Card>
      </div>

      {/* Audit Logs Section */}
      <Card title="Organization Audit Logs" subtitle="Real-time security trail tracking login history, report access, and share links">
        <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User / Identity</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Audit Details</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-400">{log.timestamp}</td>
                  <td className="px-4 py-3 font-sans font-medium text-white">{log.user}</td>
                  <td className="px-4 py-3 text-indigo-400 font-semibold">{log.event}</td>
                  <td className="px-4 py-3 text-slate-300">{log.details}</td>
                  <td className="px-4 py-3 text-right font-sans">
                    <Badge variant={log.status === 'SUCCESS' ? 'success' : 'error'}>
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
