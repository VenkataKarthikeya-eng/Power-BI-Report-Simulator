'use client';

import React from 'react';
import { Card, Badge } from '@dcaps/ui';

export default function CapsulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Compiled Capsules (.dcaps)</h1>
        <p className="text-sm text-slate-400 mt-1">Repository of all cryptographically signed and encrypted report artifacts.</p>
      </div>

      <Card>
        <div className="border border-slate-800 rounded-lg overflow-hidden">
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
              <tr>
                <td className="px-4 py-3 font-sans font-medium text-white">Q3_Logistics_Global.dcaps</td>
                <td className="px-4 py-3"><Badge variant="info">v1.2.0</Badge></td>
                <td className="px-4 py-3 text-slate-400">42 MB</td>
                <td className="px-4 py-3 text-slate-500">8f9102...ab30</td>
                <td className="px-4 py-3 text-emerald-400">ECDSA P-384</td>
                <td className="px-4 py-3 text-right font-sans">
                  <a href="http://localhost:3003" className="text-indigo-400 font-medium hover:underline">View Runtime →</a>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-sans font-medium text-white">HR_Compensation_2026.dcaps</td>
                <td className="px-4 py-3"><Badge variant="info">v1.0.0</Badge></td>
                <td className="px-4 py-3 text-slate-400">18 MB</td>
                <td className="px-4 py-3 text-slate-500">3c91a0...1111</td>
                <td className="px-4 py-3 text-emerald-400">ECDSA P-384</td>
                <td className="px-4 py-3 text-right font-sans">
                  <a href="http://localhost:3003" className="text-indigo-400 font-medium hover:underline">View Runtime →</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
