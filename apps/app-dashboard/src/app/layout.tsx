'use client';

import React, { useState } from 'react';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeProvider, CommandPalette, ToastProvider } from '@dcaps/ui';
import { AppProvider, useApp } from '../context/AppContext';

// Guided & Modal components
import { OnboardingModal } from '../components/guided/OnboardingModal';
import { ProductTourOverlay } from '../components/guided/ProductTourOverlay';
import { GuidedWorkflowPanel } from '../components/guided/GuidedWorkflowPanel';
import { FloatingAiGuide } from '../components/guided/FloatingAiGuide';
import { CreateWorkspaceModal } from '../components/modals/CreateWorkspaceModal';
import { CreateShareLinkModal } from '../components/modals/CreateShareLinkModal';
import { AutoFixModal } from '../components/modals/AutoFixModal';
import { ViewerModal } from '../components/modals/ViewerModal';
import { UpgradePlanModal } from '../components/modals/UpgradePlanModal';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const pathname = usePathname();
  const { activeWorkspace, openModal, startTour } = useApp();

  const isLinkActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname.startsWith(path);
  };

  const navGroups = [
    {
      title: 'Dashboard',
      items: [{ href: '/dashboard', label: 'Business Overview', icon: '📊' }],
    },
    {
      title: 'AI Analytics',
      items: [
        { href: '/copilot', label: 'AI Copilot', icon: '🤖' },
        { href: '/builder', label: 'Dashboard Builder', icon: '✨' },
        { href: '/digital-twin', label: 'Digital Twin', icon: '🔮' },
        { href: '/agents', label: 'AI Agents Swarm', icon: '🧠' },
      ],
    },
    {
      title: 'Reports & Capsules',
      items: [
        { href: '/import', label: 'Import Dashboard', icon: '📥' },
        { href: '/capsules', label: 'My Capsules (.dcaps)', icon: '📦' },
        { href: '/sharing', label: 'Sharing & Access', icon: '🔗' },
      ],
    },
    {
      title: 'Team & Security',
      items: [
        { href: '/settings', label: 'Users & IAM', icon: '👥' },
        { href: '/health', label: 'Verification & Quality', icon: '🩺' },
        { href: '/telemetry', label: 'Audit Logs & Security', icon: '🔒' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { href: '/projects', label: 'Organization Workspaces', icon: '🏢' },
        { href: '/billing', label: 'Subscription Billing', icon: '💳' },
        { href: '/user/profile', label: 'User Profile', icon: '👤' },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans antialiased">
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* Modals & Overlays */}
      <OnboardingModal />
      <ProductTourOverlay />
      <CreateWorkspaceModal />
      <CreateShareLinkModal />
      <AutoFixModal />
      <ViewerModal />
      <UpgradePlanModal />
      <FloatingAiGuide />

      {/* Redesigned Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 px-2 py-2 border-b border-slate-800 pb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-xs">
              DC
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block leading-none">Capsule AI</span>
              <span className="text-[10px] text-indigo-400 font-mono">Global Supply Chain</span>
            </div>
          </div>

          {/* Workspace Switcher Component */}
          <div
            id="nav-workspace-switcher"
            onClick={() => openModal('createWorkspace')}
            className="px-3 py-2 bg-slate-800/70 hover:bg-slate-800 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs cursor-pointer transition-colors"
          >
            <div>
              <div className="font-bold text-slate-200 truncate max-w-[140px]">{activeWorkspace.name}</div>
              <div className="text-[10px] text-slate-400 truncate">250 Employees • 48 Dashboards</div>
            </div>
            <span className="text-slate-400 text-xs">↕</span>
          </div>

          {/* Nav Groups */}
          <nav className="space-y-5 text-xs font-medium">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const active = isLinkActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                        active
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30 shadow-sm'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Help */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={startTour}
            className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-indigo-300 font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <span>💡 Start Product Tour</span>
          </button>
        </div>
      </aside>

      {/* Main App Content View Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Assistant Banner */}
        <GuidedWorkflowPanel />

        {/* Top Header */}
        <header className="h-16 bg-slate-900/80 border-b border-slate-800/80 px-6 flex items-center justify-between backdrop-blur-md shrink-0">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>🔍 Search workspace...</span>
            <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-[10px] font-mono">⌘K</kbd>
          </button>

          <div className="flex items-center space-x-3">
            <Link href="/user/profile" className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
                AR
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-semibold text-slate-200 block text-xs leading-none">Alex Rivera</span>
                <span className="text-[10px] text-indigo-400 font-mono">CEO / Executive</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Main View Scroll */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <ThemeProvider defaultTheme="dark">
          <ToastProvider>
            <AppProvider>
              <AppLayoutContent>{children}</AppLayoutContent>
            </AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
