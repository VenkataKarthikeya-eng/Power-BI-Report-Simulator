'use client';

import React from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

export default function LandingPage() {
  const handleLaunchDemo = (role = 'analyst') => {
    window.location.href = `http://localhost:3001/dashboard?demo=true&role=${role}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              DC
            </div>
            <div>
              <span className="font-bold text-lg text-white tracking-tight">Dashboard Capsule AI</span>
              <span className="ml-2 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                SaaS v2.0
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
            <a href="#enterprise" className="hover:text-white transition-colors">Enterprise</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3001/auth/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign In
            </a>
            <Button
              variant="primary"
              onClick={() => handleLaunchDemo('ceo')}
              className="shadow-lg shadow-indigo-600/25"
            >
              Start Free Demo →
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next-Generation BI Modernization Engine
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Transform Your Business Dashboards Into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Intelligent AI Analytics Capsules
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload your Power BI reports, analyze performance bottlenecks, generate instant executive insights, and securely share optimized zero-latency dashboards using AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleLaunchDemo('ceo')}
              className="w-full sm:w-auto text-base px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-500/25"
            >
              🚀 Start Free Demo
            </Button>
            <a
              href="#workflow"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:text-white hover:bg-slate-800 transition-all text-center"
            >
              Explore How It Works
            </a>
          </div>

          {/* Interactive Workflow Graphic */}
          <div className="p-2 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/40 border border-slate-800 backdrop-blur-xl shadow-2xl">
            <div className="bg-slate-950/90 rounded-xl p-6 md:p-8 text-left border border-slate-800/80">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-500 font-mono ml-2">global-supply-chain.pbix — AI Capsule Analysis</span>
                </div>
                <Badge variant="success">AI Optimization Score: 94/100</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Step 1: Upload</div>
                  <div className="text-sm font-bold text-white mb-2">Power BI (.pbix)</div>
                  <div className="text-xs text-emerald-400 font-mono">✓ 12,840 Records</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Step 2: AI Analysis</div>
                  <div className="text-sm font-bold text-white mb-2">DAX & Security Audit</div>
                  <div className="text-xs text-indigo-400 font-mono">✓ 3 Issues Auto-Fixed</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Step 3: Capsule Engine</div>
                  <div className="text-sm font-bold text-white mb-2">DuckDB WASM</div>
                  <div className="text-xs text-purple-400 font-mono">⚡ 18ms Query Latency</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 mb-1">Step 4: Insights</div>
                  <div className="text-sm font-bold text-white mb-2">Executive Decision</div>
                  <div className="text-xs text-emerald-400 font-mono">+$3.8M Profit Forecast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section id="product" className="py-20 px-6 border-t border-slate-800/60 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              Reinventing Business Intelligence for the AI Era
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Traditional dashboards require constant manual maintenance and slow desktop software. Dashboard Capsule AI converts legacy reports into self-contained, AI-assisted analytics capsules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-rose-900/30 bg-rose-950/10 p-6">
              <div className="text-rose-400 font-semibold text-sm mb-2">⚠️ Traditional BI Workflow</div>
              <h3 className="text-xl font-bold text-white mb-4">Manual, Slow & Fragmented</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span> Requires expensive desktop licensing per viewer seat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span> Unoptimized DAX formulas slow down executive decision-making
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">✕</span> Business users struggle to interpret complex charts without an analyst
                </li>
              </ul>
            </Card>

            <Card className="border-indigo-500/30 bg-indigo-950/10 p-6">
              <div className="text-indigo-400 font-semibold text-sm mb-2">✨ Dashboard Capsule AI Workflow</div>
              <h3 className="text-xl font-bold text-white mb-4">Autonomous, Fast & Guided</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span> Runs zero-latency queries client-side via DuckDB WebAssembly
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span> 1-Click AI Health Fix automatically resolves security & performance risks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span> Conversational AI Copilot answers plain-English business questions instantly
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Guided 4-Step Process Section */}
      <section id="workflow" className="py-20 px-6 border-t border-slate-800/60 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
              4 Steps to Intelligent Business Analytics
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm">
              Our guided workflow acts like a personal BI assistant leading you step-by-step from raw file to strategic decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">1</div>
              <h4 className="text-lg font-bold text-white mb-2">Upload Dashboard</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Upload your Power BI (.pbix) report file. Our ingestion engine parses dataset models and visuals automatically.
              </p>
              <div className="text-xs text-indigo-400 font-mono">Action: Upload My Dashboard</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-4">2</div>
              <h4 className="text-lg font-bold text-white mb-2">AI Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Specialized AI agents perform security auditing, DAX query optimization, and accessibility verification.
              </p>
              <div className="text-xs text-purple-400 font-mono">Action: Run 1-Click Auto-Fix</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">3</div>
              <h4 className="text-lg font-bold text-white mb-2">Create Capsule</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Compile into a standalone, encrypted .dcaps capsule bundle protected with ECDSA digital signatures.
              </p>
              <div className="text-xs text-emerald-400 font-mono">Action: Create AI Dashboard</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
              <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-sm mb-4">4</div>
              <h4 className="text-lg font-bold text-white mb-2">Executive Insights</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Query data conversationally via AI Copilot or share encrypted passcode-protected links securely.
              </p>
              <div className="text-xs text-amber-400 font-mono">Action: Ask AI Copilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 Dashboard Capsule AI Inc. All rights reserved.</div>
          <div className="flex gap-6 text-slate-400">
            <a href="http://localhost:3001/auth/login" className="hover:text-white">Business Analyst Demo</a>
            <a href="http://localhost:3001/auth/login" className="hover:text-white">Enterprise Admin Demo</a>
            <a href="http://localhost:3001/auth/login" className="hover:text-white">CEO Executive Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
