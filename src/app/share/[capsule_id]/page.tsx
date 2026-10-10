'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  ArrowLeft, 
  Share2, 
  Copy, 
  Check, 
  Info, 
  Lock, 
  Eye, 
  Sliders, 
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getFallbackShareUrl, getClientShareUrl } from '@/lib/share/share-url';

export default function SharePage({
  params,
}: {
  params: { capsule_id: string };
}) {
  const [copied, setCopied] = useState(false);
  const capsuleId = params?.capsule_id || 'demo';

  // Hydration-safe initial state: server and client initial render both use getFallbackShareUrl
  const [shareUrl, setShareUrl] = useState<string>(() => getFallbackShareUrl(capsuleId));

  // Synchronize with client window origin after hydration completes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(getClientShareUrl(capsuleId, window.location.origin));
    }
  }, [capsuleId]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Top Breadcrumb & Return Action */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#e5322d]" />
              <span>Public Recipient Preview</span>
            </span>
          </div>
        </div>

        {/* Share Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#e5322d]" />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Power BI Report Simulator: <span className="font-mono text-slate-600 font-normal">{capsuleId}</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.
              </p>
            </div>

            <Link
              href="/studio"
              className="btn-outline-red text-xs py-2 px-4 self-start sm:self-auto shrink-0"
            >
              Open in Studio Editor
            </Link>
          </div>

          {/* Share Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              Shareable Web Link (Demonstration)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate select-all">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              * In later phases, shareable links will be cryptographically signed and stored in PostgreSQL.
            </p>
          </div>
        </div>

        {/* Informative Phase Boundary Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              Shared Dashboard Retrieval Coming in Later Phases
            </p>
            <p className="leading-relaxed text-amber-800">
              This page displays the frontend structure of public report links. Actual shared-dashboard retrieval, permissions validation, and interactive report rendering from Supabase / PostgreSQL will be connected in subsequent phases.
            </p>
          </div>
        </div>

        {/* Report Canvas with Empty State */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-5 min-h-[420px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
            <BarChart3 className="w-8 h-8 text-slate-500" />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Public Dashboard Viewport
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When a report is published and shared, recipients will see the responsive visual canvas here, complete with configured slicers and permission-controlled what-if sliders.
            </p>
          </div>

          {/* Wireframe Preview Box */}
          <div className="w-full max-w-xl p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-3 text-left">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-semibold">Simulated Visual Layout: 1280 × 720</span>
              <span className="font-mono">Read-Only Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 bg-slate-200/60 rounded" />
              <div className="h-10 bg-slate-200/60 rounded" />
              <div className="h-10 bg-slate-200/60 rounded" />
            </div>
            <div className="h-28 bg-slate-200/40 rounded flex items-center justify-center text-[11px] text-slate-400 font-mono">
              [Visual Chart Container]
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="btn-primary text-xs py-2.5 px-5"
            >
              Upload Your Own Power BI Report
            </Link>
            <Link
              href="/studio?demo=true"
              className="btn-secondary text-xs py-2.5 px-4"
            >
              Test Demo Studio
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
