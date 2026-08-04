'use client';

import React from 'react';
import { Card, Button } from '@dcaps/ui';

export default function ProjectsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces & Projects</h1>
          <p className="text-sm text-slate-400 mt-1">Organize reports by department or client project.</p>
        </div>
        <Button variant="primary">+ Create Workspace</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Global Supply Chain" subtitle="12 Capsules • 4 Members">
          <p className="text-xs text-slate-400 mt-2">Logistics performance, carrier metrics, and regional transit times.</p>
        </Card>

        <Card title="Financial Planning & Analysis" subtitle="8 Capsules • 6 Members">
          <p className="text-xs text-slate-400 mt-2">Executive P&L statements, margin analysis, and quarterly revenue forecasting.</p>
        </Card>

        <Card title="People Ops & HR" subtitle="5 Capsules • 2 Members">
          <p className="text-xs text-slate-400 mt-2">Headcount retention, recruitment funnel, and compensation reviews.</p>
        </Card>
      </div>
    </div>
  );
}
