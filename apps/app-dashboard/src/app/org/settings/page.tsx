'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

export default function OrgSettingsPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [inviteStatus, setInviteStatus] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus('');
    try {
      const res = await fetch('http://localhost:8081/api/v1/org/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('access_token') || 'active_session_token' : 'active_session_token'}`,
        },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to send invite');
      }
      setInviteStatus(`Invitation dispatched to ${email} as ${role}!`);
      setEmail('');
    } catch (err: any) {
      setInviteStatus(`⚠️ ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings & IAM</h1>
        <p className="text-sm text-slate-400 mt-1">Manage team members, RBAC roles, and security policies.</p>
      </div>

      <Card title="Invite Team Member" subtitle="Grant role-based permissions">
        {inviteStatus && (
          <div className="mb-4 p-3 rounded-md bg-indigo-950/80 border border-indigo-800 text-indigo-300 text-xs font-medium">
            {inviteStatus}
          </div>
        )}
        <form onSubmit={handleInvite} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-300 mb-1">User Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya.sharma@company.com"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ORG_ADMIN">Organization Admin</option>
              <option value="DEVELOPER">Developer</option>
              <option value="BUSINESS_ANALYST">Business Analyst</option>
              <option value="VIEWER">Viewer</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <Button type="submit" variant="primary">
            Send Invitation
          </Button>
        </form>
      </Card>

      <Card title="Organization Members" subtitle="Active users and granted roles">
        <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">Alex Rivera</div>
                  <div className="text-xs text-slate-400">alex.rivera@acme.com</div>
                </td>
                <td className="px-4 py-3"><Badge variant="info">DEVELOPER</Badge></td>
                <td className="px-4 py-3"><Badge variant="success">ACTIVE</Badge></td>
                <td className="px-4 py-3 text-right text-xs text-slate-500">Owner</td>
              </tr>
              <tr>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">Priya Sharma</div>
                  <div className="text-xs text-slate-400">priya.sharma@acme.com</div>
                </td>
                <td className="px-4 py-3"><Badge variant="neutral">BUSINESS_ANALYST</Badge></td>
                <td className="px-4 py-3"><Badge variant="success">ACTIVE</Badge></td>
                <td className="px-4 py-3 text-right">
                  <button className="text-rose-400 hover:text-rose-300 text-xs font-medium">Revoke</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
