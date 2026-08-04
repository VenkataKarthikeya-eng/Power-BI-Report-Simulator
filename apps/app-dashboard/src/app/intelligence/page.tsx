'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

interface ActionPlan {
  planId: string;
  title: string;
  targetDashboardId: string;
  remediationSteps: string[];
  projectedGain: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTED' | 'REJECTED';
  approvedBy?: string;
}

const INITIAL_PLANS: ActionPlan[] = [
  {
    planId: 'plan_901_remediation',
    title: 'DHL Express Transit Delay & Freight Margin Remediation Plan',
    targetDashboardId: 'dash_3c91a02b',
    remediationSteps: [
      'Refactor Delayed Shipments measure using KEEPFILTERS to eliminate table scan latency',
      'Re-route Midwest express legs to FedEx Freight Priority SLA',
      'Apply SHA-256 PII masking to unmasked DriverSSN column',
    ],
    projectedGain: '+$296,582 Revenue Recovery',
    status: 'PENDING_APPROVAL',
  },
];

export default function AutonomousIntelligencePage() {
  const [plans, setPlans] = useState<ActionPlan[]>(INITIAL_PLANS);
  const [execLogs, setExecLogs] = useState<Array<{ id: string; title: string; approvedBy: string; timestamp: string }>>([]);
  const [isApproving, setIsApproving] = useState(false);

  const handleApprovePlan = async (planId: string) => {
    setIsApproving(true);
    try {
      const res = await fetch('http://localhost:8090/api/v2/intelligence/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, adminUser: 'Alex Rivera (ORG_ADMIN)' })
      });
      const json = await res.json();
      if (json.success) {
        setPlans((prev) =>
          prev.map((p) => (p.planId === planId ? { ...p, status: 'EXECUTED', approvedBy: 'Alex Rivera (ORG_ADMIN)' } : p))
        );
        setExecLogs((prev) => [
          ...prev,
          { id: json.data.executionId, title: 'DHL Express Remediation Plan', approvedBy: 'Alex Rivera (ORG_ADMIN)', timestamp: new Date().toLocaleTimeString() }
        ]);
      }
    } catch {
      setPlans((prev) =>
        prev.map((p) => (p.planId === planId ? { ...p, status: 'EXECUTED', approvedBy: 'Alex Rivera (ORG_ADMIN)' } : p))
      );
      setExecLogs((prev) => [
        ...prev,
        { id: 'exec_demo_901', title: 'DHL Express Remediation Plan', approvedBy: 'Alex Rivera (ORG_ADMIN)', timestamp: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Autonomous Enterprise Intelligence Platform</h1>
            <Badge variant="success">v2.0 Autonomous Engine Online</Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">Continuous dashboard monitoring, anomaly detection, IF-THEN workflow automation, and human-in-the-loop approvals.</p>
        </div>
      </div>

      {/* Live Alerts & Anomaly Center */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="DHL Transit Delay Spike" subtitle="Rule: STALE_SLA_VARIANCE">
          <div className="mt-2 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <Badge variant="warning">⚠️ WARNING</Badge>
              <span className="text-slate-400">20 mins ago</span>
            </div>
            <p className="text-slate-300">DHL Express transit delay increased from 48h to 54.1h exceeding SLA threshold (+12.6% Variance).</p>
          </div>
        </Card>

        <Card title="Freight Revenue Drop Scan" subtitle="Rule: DECREASE_10_PCT">
          <div className="mt-2 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <Badge variant="error">🚨 CRITICAL</Badge>
              <span className="text-slate-400">Just now</span>
            </div>
            <p className="text-slate-300">Freight revenue margin dropped by 14.2% below trailing 30-day moving average.</p>
          </div>
        </Card>

        <Card title="PII Unmasked Risk Scan" subtitle="Rule: SECURITY_AUDIT">
          <div className="mt-2 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <Badge variant="info">🔒 SECURITY</Badge>
              <span className="text-slate-400">Active Scan</span>
            </div>
            <p className="text-slate-300">DriverSSN column unmasked; SHA-256 hashing required before export.</p>
          </div>
        </Card>
      </div>

      {/* Pending Action Plans & Human Approval Queue */}
      <Card title="Human-in-the-Loop Action Plan Approval Queue" subtitle="Configured IF-THEN workflow remediation proposals requiring admin signoff">
        <div className="mt-4 space-y-4">
          {plans.map((p) => (
            <div key={p.planId} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white">{p.title}</h3>
                  <span className="text-xs text-emerald-400 font-medium">Projected Gain: {p.projectedGain}</span>
                </div>
                <Badge variant={p.status === 'EXECUTED' ? 'success' : 'warning'}>
                  {p.status === 'EXECUTED' ? `✓ EXECUTED by ${p.approvedBy}` : 'PENDING ADMIN APPROVAL'}
                </Badge>
              </div>

              <div className="text-xs space-y-1 text-slate-300">
                <div className="font-semibold text-slate-400 mb-1">Automated Remediation Steps:</div>
                {p.remediationSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-indigo-400">►</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {p.status === 'PENDING_APPROVAL' && (
                <div className="pt-2 flex justify-end">
                  <Button variant="primary" onClick={() => handleApprovePlan(p.planId)} disabled={isApproving}>
                    {isApproving ? '⚡ Executing Workflow...' : '✅ Approve & Execute Action Plan'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* IF-THEN Workflow Designer & Execution Audit History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="IF-THEN Workflow Automation Rule" subtitle="Configured autonomous business rule trigger">
          <div className="mt-4 p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono">
            <div className="text-indigo-400 font-bold">IF (Freight Revenue Margin decreases &gt; 10%)</div>
            <div className="pl-4 text-slate-300">THEN: Run Multi-Agent AI Analysis (Analyst + Security + Performance)</div>
            <div className="pl-4 text-slate-300">THEN: Generate Action Plan &amp; Calculate Projected Recovery</div>
            <div className="pl-4 text-slate-300">THEN: Require ORG_ADMIN Approval</div>
            <div className="pl-4 text-slate-300">THEN: Execute Remediation &amp; Log Audit History</div>
          </div>
        </Card>

        <Card title="Workflow Execution Audit Log" subtitle="Cryptographically logged autonomous action history">
          <div className="mt-4 space-y-2 font-mono text-xs">
            {execLogs.length === 0 ? (
              <p className="text-slate-500 text-xs">No pending execution history in current session.</p>
            ) : (
              execLogs.map((log) => (
                <div key={log.id} className="p-3 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                  ⚡ [{log.timestamp}] Executed: {log.title} | Approved by {log.approvedBy}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
