'use client';

import React from 'react';
import { Card, Badge, SmartEmptyState } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function CapsulesPage() {
  const { capsules, openViewer } = useApp();
  const router = useRouter();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Compiled Capsules (.dcaps)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Repository of cryptographically signed and AES-256 encrypted report artifacts.
          </p>
        </div>

        <button
          onClick={() => router.push('/import')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all"
        >
          + Import New PBIX
        </button>
      </div>

      <Card>
        {capsules.length === 0 ? (
          <SmartEmptyState
            title="No dashboard capsules yet."
            description="Capsules are secure AI-powered versions of your BI reports."
            primaryActionLabel="Create Your First Capsule"
            onPrimaryAction={() => router.push('/import')}
          />
        ) : (
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Capsule Name</th>
                  <th className="px-4 py-3">Version</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">SHA-256 Hash</th>
                  <th className="px-4 py-3">Signature</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {capsules.map((capsule) => (
                  <tr key={capsule.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-sans font-medium text-white">{capsule.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">{capsule.version}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{capsule.size}</td>
                    <td className="px-4 py-3 text-slate-500">{capsule.hash}</td>
                    <td className="px-4 py-3 text-emerald-400">{capsule.signature}</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => openViewer(capsule.id, capsule.name)}
                        className="text-indigo-400 font-semibold hover:underline text-xs"
                      >
                        View Runtime →
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
