'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const demoAccounts = [
    {
      role: 'Business Analyst',
      email: 'analyst@demo.com',
      password: 'demo123',
      badge: 'Analyst Access',
      desc: 'Dashboard, Import, AI Copilot & Reports',
      color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      role: 'Enterprise Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      badge: 'Admin Access',
      desc: 'Users, Security, Billing & Telemetry',
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      role: 'CEO / Executive',
      email: 'ceo@demo.com',
      password: 'ceo123',
      badge: 'Executive Access',
      desc: 'Revenue, Profit, KPIs & Insights',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
  ];

  const handleSelectDemo = (account: typeof demoAccounts[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setLoading(true);
    setSuccess(`Logging in as ${account.role}... Redirecting to Executive Workspace.`);
    setTimeout(() => {
      window.location.href = `/dashboard?role=${account.email.split('@')[0]}`;
    }, 600);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(`Authenticated successfully as ${email.split('@')[0] || 'User'}`);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white text-xl mx-auto mb-4 shadow-lg shadow-indigo-500/20">
          DC
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Sign in to Dashboard Capsule AI</h2>
        <p className="mt-2 text-sm text-slate-400">Zero-Trust Enterprise BI Platform</p>
      </div>

      <div className="w-full max-w-xl space-y-6">
        {/* Quick Demo Account Selector */}
        <Card className="border-indigo-500/30 bg-slate-900/90 p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            1-Click Demo Profiles (No Registration Required)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => handleSelectDemo(account)}
                className="text-left p-3 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 transition-all group"
              >
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mb-1.5 ${account.color}`}>
                  {account.badge}
                </span>
                <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {account.role}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {account.desc}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Regular Login Form */}
        <Card className="p-6">
          {success && (
            <div className="mb-4 p-3 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-medium">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex.rivera@company.com"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <a href="/auth/forgot-password" className="text-xs text-indigo-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </Button>

            <div className="pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <a href="/auth/signup" className="text-indigo-400 font-medium hover:underline">
                  Register Organization Workspace
                </a>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
