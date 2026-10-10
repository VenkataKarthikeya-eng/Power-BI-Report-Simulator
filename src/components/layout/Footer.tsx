import React from 'react';
import Link from 'next/link';
import { BarChart3, ShieldCheck, Zap, FileSpreadsheet } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#e5322d] flex items-center justify-center text-white">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                Power BI <span className="text-[#e5322d]">Report Simulator</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#e5322d] transition-colors">
                  Upload Report
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#e5322d] transition-colors">
                  Studio Editor
                </Link>
              </li>
              <li>
                <Link href="/studio?demo=true" className="hover:text-[#e5322d] transition-colors">
                  Explore Demo
                </Link>
              </li>
              <li>
                <Link href="/share/demo" className="hover:text-[#e5322d] transition-colors">
                  Shared Dashboard Preview
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Access & Auth</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/login" className="hover:text-[#e5322d] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#e5322d] transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Supabase Auth (Phase 3)</span>
              </li>
            </ul>
          </div>

          {/* Architecture Status */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Supported Formats</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                <FileSpreadsheet className="w-3 h-3 text-[#e5322d]" />
                .PBIX
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                <FileSpreadsheet className="w-3 h-3 text-slate-500" />
                .PBIT
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Phase 2: Complete UI & frontend navigation. Native PBIX parsing and simulation logic will be implemented in later phases.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Power BI Report Simulator. Practical, private dashboard sharing.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Local File Parsing
            </span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Fast Web Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
