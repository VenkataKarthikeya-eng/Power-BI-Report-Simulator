'use client';

import React, { useState } from 'react';
import './globals.css';
import { ThemeProvider, CommandPalette } from '@dcaps/ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <ThemeProvider defaultTheme="dark">
          <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
          
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex">
              <div>
                <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                      DC
                    </div>
                    <span className="font-bold text-base tracking-tight text-white">Capsule AI</span>
                  </div>
                </div>

                {/* Workspace Switcher Stub */}
                <div className="mb-4 px-2 py-2 bg-slate-800/60 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">Global Supply Chain</div>
                    <div className="text-[10px] text-slate-500">Enterprise Workspace</div>
                  </div>
                  <span className="text-slate-400">↕</span>
                </div>

                <nav className="space-y-1 text-sm font-medium">
                  <a href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-400">
                    <span>📊</span><span>Dashboard</span>
                  </a>
                  <a href="/projects" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>📁</span><span>Projects</span>
                  </a>
                  <a href="/import" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>📥</span><span>Import PBIX</span>
                  </a>
                  <a href="/capsules" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>📦</span><span>Capsules (.dcaps)</span>
                  </a>
                  <a href="/copilot" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>🤖</span><span>AI Copilot</span>
                  </a>
                  <a href="/agents" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>🧠</span><span>AI Agents Swarm</span>
                  </a>
                  <a href="/realtime" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>📡</span><span>Live Collaboration</span>
                  </a>
                  <a href="/builder" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>✨</span><span>AI Dashboard Builder</span>
                  </a>
                  <a href="/digital-twin" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>🔮</span><span>Digital Twin Platform</span>
                  </a>
                  <a href="/intelligence" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-rose-400 bg-rose-950/60 border border-rose-800/60 font-semibold">
                    <span>🤖</span><span>Autonomous Intelligence</span>
                  </a>
                  <a href="/health" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>🩺</span><span>Health Score</span>
                  </a>
                  <a href="/analytics" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>📈</span><span>Telemetry</span>
                  </a>
                  <a href="/sharing" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                    <span>🔗</span><span>Sharing & Links</span>
                  </a>
                </nav>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4">
                <a href="/org/settings" className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-white">
                  🏢 Org & IAM Settings
                </a>
                <a href="/billing" className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-white">
                  💳 Billing & Plan
                </a>
                <a href="/help" className="block px-3 py-2 text-xs font-medium text-slate-400 hover:text-white">
                  ❓ Help & Docs
                </a>
              </div>
            </aside>

            {/* Main Application Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Top Navigation Bar */}
              <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-md">
                <button
                  onClick={() => setCmdOpen(true)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 border border-slate-700/80 rounded-lg text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <span>🔍 Search workspace...</span>
                  <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-[10px] font-mono">⌘K</kbd>
                </button>

                <div className="flex items-center space-x-4">
                  <a href="/notifications" className="p-2 text-slate-400 hover:text-white relative">
                    <span>🔔</span>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
                  </a>
                  <a href="/user/profile" className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-slate-800">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      AR
                    </div>
                    <span className="text-xs font-medium text-slate-200 hidden sm:inline">Alex Rivera</span>
                  </a>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
