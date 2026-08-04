import React from 'react';
import './globals.css';
import { ThemeProvider } from '@dcaps/ui';

export const metadata = {
  title: 'Enterprise Admin Portal — Dashboard Capsule AI',
  description: 'Enterprise IAM, SSO, Security Policy & Audit Logging Administration.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <ThemeProvider defaultTheme="dark">
          <div className="flex h-screen overflow-hidden">
            <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-3 px-2 py-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white">
                    AD
                  </div>
                  <span className="font-bold text-base tracking-tight text-white">Admin Portal</span>
                </div>
                <nav className="space-y-1">
                  <a href="/" className="block px-3 py-2 rounded-lg bg-rose-600/20 text-rose-400 font-medium text-sm">
                    Tenant Overview
                  </a>
                  <a href="/users" className="block px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm">
                    User Directory & IAM
                  </a>
                  <a href="/security" className="block px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm">
                    Security & KMS Keys
                  </a>
                  <a href="/audit-logs" className="block px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm">
                    ClickHouse Audit Logs
                  </a>
                  <a href="/billing" className="block px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white font-medium text-sm">
                    Subscriptions & Usage
                  </a>
                </nav>
              </div>
              <div className="px-2 py-3 border-t border-slate-800 text-xs text-slate-500">
                Super Admin Access
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
