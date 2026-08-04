'use client';

import React, { useState } from 'react';
import { Card, Badge, Button } from '@dcaps/ui';

export default function SharingPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [replayDrawerOpen, setReplayDrawerOpen] = useState(false);
  const [activeReplayStep, setActiveReplayStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const [passcode, setPasscode] = useState('Partner2026!');
  const [allowedDomain, setAllowedDomain] = useState('partnercorp.com');
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowExportData, setAllowExportData] = useState(false);
  const [allowAiCopilot, setAllowAiCopilot] = useState(true);

  const replaySteps = [
    { step: 1, time: '00:00.000', event: 'Opened Page: Q3 Executive Logistics', detail: 'User session initialized' },
    { step: 2, time: '00:04.250', event: 'Cross-Filtered Visual: vis_bar_1', detail: 'Selected FedEx Freight slice' },
    { step: 3, time: '00:12.800', event: 'AI Copilot Query', detail: 'Prompt: "What caused transit delays to spike?"' },
  ];

  const handleCreateShareLink = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Active Share Links & Replay Sessions</h1>
          <p className="text-sm text-slate-400 mt-1">Manage external passcodes, domain whitelists, and event-based session replays.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setReplayDrawerOpen(!replayDrawerOpen)}>
            🎬 Semantic Replay Player
          </Button>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            + Create Secure Share Link
          </Button>
        </div>
      </div>

      {/* Replay Player Drawer */}
      {replayDrawerOpen && (
        <Card title="Semantic Dashboard Replay Player" subtitle="Lightweight event-based interactive session recording">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div>
                  <div className="font-bold text-white text-xs">Replay Session #sess_9012a8</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Step {activeReplayStep} of {replaySteps.length} • {replaySteps[activeReplayStep - 1].time}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                {replaySteps.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setActiveReplayStep(s.step)}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      activeReplayStep === s.step
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Step {s.step}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-indigo-400">{replaySteps[activeReplayStep - 1].event}</div>
              <p className="text-slate-300 font-mono">{replaySteps[activeReplayStep - 1].detail}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Active Share Links Table */}
      <Card title="Active External Share Tokens">
        <div className="border border-slate-800 rounded-lg overflow-hidden">
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
              <tr>
                <td className="px-4 py-3 font-sans font-medium text-white">Q3_Logistics_Global.dcaps</td>
                <td className="px-4 py-3 text-indigo-400">v98f21a09b</td>
                <td className="px-4 py-3"><Badge variant="success">PROTECTED</Badge></td>
                <td className="px-4 py-3 text-slate-400">partnercorp.com</td>
                <td className="px-4 py-3 text-slate-400 font-sans">View • Copilot</td>
                <td className="px-4 py-3 text-slate-400">In 14 days</td>
                <td className="px-4 py-3 text-right font-sans">
                  <button className="text-rose-400 hover:text-rose-300 text-xs font-medium">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Share Link Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">Create Secure External Share Link</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateShareLink} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Passcode Protection</label>
                <input
                  type="text"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Allowed Email Domain Whitelist</label>
                <input
                  type="text"
                  value={allowedDomain}
                  onChange={(e) => setAllowedDomain(e.target.value)}
                  placeholder="e.g. partnercorp.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block font-bold text-slate-200">Permission Matrix</label>
                <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={allowDownload}
                    onChange={(e) => setAllowDownload(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                  <span>Allow Binary Capsule Download (.dcaps)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={allowExportData}
                    onChange={(e) => setAllowExportData(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                  <span>Allow Raw CSV/Excel Data Exports</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={allowAiCopilot}
                    onChange={(e) => setAllowAiCopilot(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                  />
                  <span>Enable AI Copilot Natural Language Query</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Generate Share Token →</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
