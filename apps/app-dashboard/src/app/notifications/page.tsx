'use client';

import React from 'react';
import { Card, Badge } from '@dcaps/ui';

export default function NotificationsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
        <p className="text-sm text-slate-400 mt-1">Real-time alerts for compilation results, share accesses, and AI health scores.</p>
      </div>

      <Card>
        <div className="space-y-4 divide-y divide-slate-800">
          <div className="pt-3 flex justify-between items-center text-sm">
            <div>
              <div className="font-medium text-white">Q3_Logistics_Global.dcaps compiled successfully</div>
              <p className="text-xs text-slate-400 mt-1">ECDSA signature verified • Size reduced by 58%</p>
            </div>
            <Badge variant="success">JUST NOW</Badge>
          </div>

          <div className="pt-3 flex justify-between items-center text-sm">
            <div>
              <div className="font-medium text-white">External Share Link Accessed</div>
              <p className="text-xs text-slate-400 mt-1">Passcode verified for partnercorp.com (IP 192.0.2.45)</p>
            </div>
            <Badge variant="info">2 HOURS AGO</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
