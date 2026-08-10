'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';

export default function BillingPage() {
  const { openModal } = useApp();
  const { showToast } = useToast();

  const [seats, setSeats] = useState(25);

  const plans = [
    {
      name: 'Free Plan',
      price: '$0',
      period: 'forever free',
      desc: 'For individuals exploring dashboard capsules.',
      features: ['1 Workspace', 'Basic AI Copilot', 'Up to 3 Dashboards', 'Community Support'],
      badge: 'Starter',
      isCurrent: false,
    },
    {
      name: 'Professional',
      price: '$49',
      period: 'per month',
      desc: 'For growing teams requiring advanced analytics.',
      features: ['Unlimited Dashboards', 'Advanced AI Swarm', 'Passcode Share Links', 'Standard Support'],
      badge: 'Popular',
      isCurrent: false,
    },
    {
      name: 'Enterprise',
      price: `$${199 + seats * 10}`,
      period: 'per month',
      desc: 'For organizations demanding security & telemetry.',
      features: ['Team Access & User Management', 'ECDSA P-384 Security Center', 'Real-Time ClickHouse Telemetry', 'Dedicated Account Manager'],
      badge: 'CURRENT PLAN',
      isCurrent: true,
    },
  ];

  const handleUpgrade = (planName: string) => {
    openModal('upgradePlan');
    showToast({
      type: 'info',
      title: 'Plan Selection Updated',
      message: `Selected ${planName}. Adjust seat allocation slider below.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">SaaS Subscription & Plans</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your organization's subscription tier, active seat count, and usage limits.
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
              plan.isCurrent
                ? 'bg-slate-900 border-indigo-500 shadow-xl ring-1 ring-indigo-500/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan.name}</span>
                <Badge variant={plan.isCurrent ? 'success' : 'info'}>{plan.badge}</Badge>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">/ {plan.period}</span>
              </div>

              <p className="text-xs text-slate-300 mb-6 leading-relaxed">{plan.desc}</p>

              <div className="space-y-2 border-t border-slate-800 pt-4 mb-6">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={plan.isCurrent}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                plan.isCurrent
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
              }`}
            >
              {plan.isCurrent ? 'Current Active Tier' : 'Upgrade Plan →'}
            </button>
          </div>
        ))}
      </div>

      {/* Usage & Seat Allocation Slider */}
      <Card title="Seat Allocation & Usage Metering" subtitle="Scale team member seats dynamically">
        <div className="space-y-6 pt-2">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
              <span className="font-semibold text-white">Active Seats Allocated: {seats} Seats</span>
              <span className="font-mono text-indigo-400">${199 + seats * 10} / month</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Active Users Utilized</span>
                <span className="font-bold text-white">18 / {seats}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${(18 / seats) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Object Storage Container Limit</span>
                <span className="font-bold text-white">128 GB / 500 GB</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full w-[25%]" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
