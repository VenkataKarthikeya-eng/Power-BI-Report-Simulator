'use client';

import React from 'react';
import { Card } from '@dcaps/ui';

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Help Center & Developer Documentation</h1>
        <p className="text-sm text-slate-400 mt-1">Platform guides, API documentation, and architecture references.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="PBIX Ingestion Guide">
          <p className="text-xs text-slate-400 mt-2">Learn how VertiPaq schema extraction works and how to optimize DAX formulas.</p>
          <a href="http://localhost:3000/docs" className="text-xs text-indigo-400 font-semibold hover:underline mt-4 block">Read Guide →</a>
        </Card>

        <Card title="Security & Envelope Encryption">
          <p className="text-xs text-slate-400 mt-2">Deep dive into AES-256-GCM encryption, ECDSA signatures, and Zero-Trust key exchange.</p>
          <a href="http://localhost:3000/docs" className="text-xs text-indigo-400 font-semibold hover:underline mt-4 block">Read Security Paper →</a>
        </Card>
      </div>
    </div>
  );
}
