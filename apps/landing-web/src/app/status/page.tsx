import React from 'react';

export default function StatusPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
        <h1 className="text-3xl font-bold text-white">All Systems Operational</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
        <div className="p-4 flex justify-between items-center text-sm">
          <span className="font-medium text-white">WASM Viewer CDN Global Edge</span>
          <span className="text-emerald-400 font-semibold">100.0% Uptime</span>
        </div>
        <div className="p-4 flex justify-between items-center text-sm">
          <span className="font-medium text-white">API Gateway Cluster</span>
          <span className="text-emerald-400 font-semibold">99.99% Uptime</span>
        </div>
        <div className="p-4 flex justify-between items-center text-sm">
          <span className="font-medium text-white">AI Core & Vector Search</span>
          <span className="text-emerald-400 font-semibold">100.0% Uptime</span>
        </div>
      </div>
    </div>
  );
}
