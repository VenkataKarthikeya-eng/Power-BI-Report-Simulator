import React from 'react';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 py-20 text-center">
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
        <span>🚀 Enterprise AI-Powered BI Platform</span>
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent mb-6">
        Transform Power BI Reports into Secure Interactive Capsules
      </h1>

      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
        Convert heavy PBIX files into lightweight, encrypted, zero-trust <code className="text-indigo-400 font-mono">.dcaps</code> containers. View, optimize, and share interactive dashboards client-side with zero desktop dependencies.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="http://localhost:3001"
          className="px-8 py-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg transition-all"
        >
          Launch Platform Workspace →
        </a>
        <a
          href="/docs"
          className="px-8 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium transition-all"
        >
          Documentation & API Docs
        </a>
      </div>
    </main>
  );
}
