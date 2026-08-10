'use client';

import React, { useState } from 'react';
import { Card, Badge, SmartEmptyState, useToast } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';

export default function SharingPage() {
  const { openModal } = useApp();
  const { showToast } = useToast();

  const [shareTokens, setShareTokens] = useState([
    {
      id: 'tok_1',
      dashboard: 'Q3_Logistics_Global.dcaps',
      token: 'v98f21a09b',
      passcode: 'PROTECTED',
      domain: 'partnercorp.com',
      permissions: 'View • Copilot',
      expires: 'In 14 days',
    },
  ]);

  const handleRevoke = (id: string, token: string) => {
    setShareTokens((prev) => prev.filter((t) => t.id !== id));
    showToast({
      type: 'info',
      title: 'Token Revoked',
      message: `Share token ${token} access was immediately revoked.`,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Level Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Active Share Links & Access Tokens</h1>
            <Badge variant="info">Step 4 of 4</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage external passcodes, domain whitelists, and granular permission matrices for external viewers.
          </p>
        </div>

        <button
          onClick={() => openModal('createShareLink')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
        >
          + Create Secure Share Link
        </button>
      </div>

      {/* Active Share Links Table */}
      <Card title="Active External Share Tokens">
        {shareTokens.length === 0 ? (
          <SmartEmptyState
            title="No active share links yet."
            description="Create secure passcode-protected access tokens to distribute interactive dashboard capsules."
            primaryActionLabel="Create First Share Link"
            onPrimaryAction={() => openModal('createShareLink')}
          />
        ) : (
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Dashboard</th>
                  <th className="px-4 py-3">Share Token</th>
                  <th className="px-4 py-3">Passcode</th>
                  <th className="px-4 py-3">Domain Whitelist</th>
                  <th className="px-4 py-3">Permissions</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-mono">
                {shareTokens.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-sans font-medium text-white">{st.dashboard}</td>
                    <td className="px-4 py-3 text-indigo-400">{st.token}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">{st.passcode}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{st.domain}</td>
                    <td className="px-4 py-3 text-slate-400 font-sans">{st.permissions}</td>
                    <td className="px-4 py-3 text-slate-400">{st.expires}</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => handleRevoke(st.id, st.token)}
                        className="text-rose-400 hover:text-rose-300 font-semibold text-xs"
                      >
                        Revoke Access
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
