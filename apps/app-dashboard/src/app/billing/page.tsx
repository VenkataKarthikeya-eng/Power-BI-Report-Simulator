'use client';

import React from 'react';
import { Card, Badge, Button } from '@dcaps/ui';

export default function BillingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Subscription & Billing Management</h1>
        <p className="text-sm text-slate-400 mt-1">Manage seat allocations, storage tier limits, and payment methods.</p>
      </div>

      <Card title="Current Subscription Tier">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xl font-bold text-white">Enterprise Plan</div>
            <p className="text-xs text-slate-400 mt-1">50 Seats • 500GB Object Storage • Custom KMS Key Management</p>
          </div>
          <Badge variant="success">ACTIVE SUBSCRIPTION</Badge>
        </div>
      </Card>

      <Card title="Usage Metering">
        <div className="space-y-4 text-xs text-slate-300">
          <div>
            <div className="flex justify-between mb-1">
              <span>Active Seats</span>
              <span>42 / 50</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full w-[84%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Capsule Object Storage</span>
              <span>128 GB / 500 GB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div className="bg-cyan-500 h-2 rounded-full w-[25%]"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
