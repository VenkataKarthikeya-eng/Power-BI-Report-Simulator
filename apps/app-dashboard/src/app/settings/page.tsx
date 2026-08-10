'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';

interface UserMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  lastActive: string;
}

const INITIAL_USERS: UserMember[] = [
  { id: 'usr_1', name: 'Alex Rivera', email: 'alex.rivera@enterprise.com', role: 'Enterprise Admin', department: 'Executive AI Team', status: 'ACTIVE', lastActive: '2 minutes ago' },
  { id: 'usr_2', name: 'Sarah Chen', email: 'sarah.chen@enterprise.com', role: 'Business Analyst', department: 'Global Logistics', status: 'ACTIVE', lastActive: '1 hour ago' },
  { id: 'usr_3', name: 'Marcus Vance', email: 'marcus.vance@enterprise.com', role: 'Data Scientist', department: 'AI & Data Science', status: 'ACTIVE', lastActive: '3 hours ago' },
  { id: 'usr_4', name: 'Elena Rostova', email: 'elena.rostova@enterprise.com', role: 'Manager / Executive', department: 'Supply Chain Operations', status: 'PENDING', lastActive: 'Invited today' },
];

export default function SettingsPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserMember[]>(INITIAL_USERS);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Business Analyst');
  const [department, setDepartment] = useState('Global Analytics');

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newUser: UserMember = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role,
      department,
      status: 'PENDING',
      lastActive: 'Just now',
    };

    setUsers((prev) => [...prev, newUser]);
    showToast({
      type: 'success',
      title: 'User Invitation Sent',
      message: `Sent workspace invitation email to ${email} as ${role}!`,
    });
    setEmail('');
  };

  const handleChangeRole = (id: string, newRole: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    showToast({
      type: 'info',
      title: 'User Role Updated',
      message: `Updated team member role to ${newRole}.`,
    });
  };

  const handleToggleDeactivate = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus as any } : u)));
    showToast({
      type: 'warning',
      title: `User Account ${nextStatus}`,
      message: `Updated account status to ${nextStatus}.`,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Guidance Header */}
      <div className="border-b border-slate-800 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise User Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization members, assign role-based access controls, and track user activity.
          </p>
        </div>
      </div>

      {/* Invite User Form */}
      <Card title="Invite Team Member" subtitle="Add new members to your enterprise workspace">
        <form onSubmit={handleInviteUser} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end mt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena.rostova@enterprise.com"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="Business Analyst">Business Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Manager / Executive">Manager / Executive</option>
              <option value="Enterprise Admin">Enterprise Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all shrink-0"
          >
            Invite User →
          </button>
        </form>
      </Card>

      {/* User Management Table */}
      <Card title="Organization Users & Roles" subtitle="Active user directory and granted roles">
        <div className="mt-4 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Name & Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white capitalize">{user.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                    >
                      <option value="Business Analyst">Business Analyst</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="Manager / Executive">Manager / Executive</option>
                      <option value="Enterprise Admin">Enterprise Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{user.department}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'PENDING' ? 'warning' : 'error'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{user.lastActive}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {user.email.includes('alex.rivera') ? (
                      <span className="text-slate-500 font-mono text-[10px]">Primary Owner</span>
                    ) : (
                      <button
                        onClick={() => handleToggleDeactivate(user.id, user.status)}
                        className={`text-xs font-semibold ${user.status === 'ACTIVE' ? 'text-rose-400 hover:text-rose-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                      >
                        {user.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
