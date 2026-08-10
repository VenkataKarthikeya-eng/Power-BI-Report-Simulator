'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '@dcaps/ui';

export function UpgradePlanModal() {
  const { modals, closeModal } = useApp();
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'PRO' | 'ENTERPRISE'>('ENTERPRISE');
  const [seats, setSeats] = useState(50);

  if (!modals.upgradePlan) return null;

  const handleUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal('upgradePlan');
    showToast({
      type: 'success',
      title: 'Subscription Updated',
      message: `Upgraded to ${selectedPlan} Plan with ${seats} seat allocations!`,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Upgrade Subscription Plan</h3>
            <p className="text-xs text-slate-400 mt-0.5">Scale workspace seats, storage tiers & custom KMS encryption</p>
          </div>
          <button onClick={() => closeModal('upgradePlan')} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleUpgrade} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setSelectedPlan('PRO')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'PRO'
                  ? 'bg-slate-950 border-indigo-500 shadow-md'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white text-sm">Pro Plan</div>
              <div className="text-xl font-extrabold text-indigo-400 mt-1">$49<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-2">10 Seats • 50GB Storage • AI Copilot RAG</p>
            </div>

            <div
              onClick={() => setSelectedPlan('ENTERPRISE')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedPlan === 'ENTERPRISE'
                  ? 'bg-slate-950 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                  : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white text-sm">Enterprise Plan</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">$299<span className="text-xs font-normal text-slate-400">/mo</span></div>
              <p className="text-[11px] text-slate-400 mt-2">50 Seats • 500GB Storage • Custom KMS & Swarm</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Seat Allocation</span>
              <span className="text-indigo-400 font-bold">{seats} Seats</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => closeModal('upgradePlan')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-md"
            >
              Confirm Subscription Update →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
