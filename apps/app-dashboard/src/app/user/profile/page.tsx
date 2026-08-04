'use client';

import React from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

export default function ProfilePage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account & Security Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your personal profile, credentials, and multi-factor authentication.</p>
      </div>

      <Card title="User Profile" subtitle="Personal details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400">Full Name</label>
            <div className="text-sm font-medium text-white mt-1">Alex Rivera</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">Work Email</label>
            <div className="text-sm font-medium text-white mt-1">alex.rivera@acme.com</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">System Role</label>
            <div className="mt-1"><Badge variant="info">DEVELOPER</Badge></div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">Organization</label>
            <div className="text-sm font-medium text-white mt-1">Acme Global Enterprise</div>
          </div>
        </div>
      </Card>

      <Card title="Multi-Factor Authentication (MFA)" subtitle="Enhanced security policy">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-white">TOTP Authenticator App</div>
            <p className="text-xs text-slate-400">Use Google Authenticator or 1Password for 2FA verification.</p>
          </div>
          <Button variant="outline" size="sm">
            Enable 2FA
          </Button>
        </div>
      </Card>
    </div>
  );
}
