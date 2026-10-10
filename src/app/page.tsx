'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Share2, 
  Cpu, 
  Play, 
  FileCheck,
  X,
  Info,
  Loader2,
  Layers,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { parseReportFile, ParseReportResult } from '@/lib/parser';
import { saveActiveReport } from '@/lib/parser/report-store';

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseReportResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleReports = [
    {
      name: 'Forecast_Analysis_Dashboard.pbix',
      size: '3.3 MB',
      description: 'Enterprise time-series forecasting, variance metrics, and predictive visual analytics.',
      demoParam: 'forecast',
    },
    {
      name: 'customer_behavior_dashboard.pbix',
      size: '108 KB',
      description: 'Customer segmentation, cohort lifetime value, and behavioral transaction telemetry.',
      demoParam: 'customer',
    },
  ];

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setParseResult(null);
    setParsing(true);

    try {
      const result = await parseReportFile(file);

      if (!result.success || result.status === 'error') {
        const errorText = result.errors.length > 0
          ? result.errors.join(' ')
          : 'Could not extract valid Power BI report structures from this file.';
        setErrorMessage(errorText);
        setParseResult(null);
      } else {
        setParseResult(result);
        if (result.report) {
          saveActiveReport(result.report);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while parsing the file.');
      setParseResult(null);
    } finally {
      setParsing(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClear = () => {
    setParseResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero & Upload Centerpiece (iLovePDF inspired) */}
        <section className="bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Turn your Power BI reports into <br className="hidden sm:inline" />
              <span className="text-[#e5322d]">interactive dashboards</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.
            </p>

            {/* Upload Area */}
            <div className="pt-6 max-w-2xl mx-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pbix,.pbit"
                onChange={handleFileInputChange}
                className="hidden"
                id="pbix-file-input"
              />

              {parsing ? (
                /* Parsing / Loading State */
                <div className="border-2 border-dashed border-[#e5322d] rounded-2xl p-12 bg-red-50/30 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#e5322d] flex items-center justify-center animate-pulse">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Inspecting Power BI Archive...
                    </h3>
                    <p className="text-xs text-slate-600">
                      Reading container entries, decoding layout metadata, and normalizing visual AST structures.
                    </p>
                  </div>
                </div>
              ) : !parseResult ? (
                /* Idle Drag-and-Drop Area */
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    dragOver
                      ? 'border-[#e5322d] bg-red-50/50 scale-[1.01]'
                      : 'border-slate-300 hover:border-[#e5322d] bg-slate-50/60 hover:bg-slate-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  aria-label="Upload Power BI report area"
                >
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#e5322d] flex items-center justify-center mb-5 shadow-sm border border-red-100">
                    <UploadCloud className="w-9 h-9" />
                  </div>

                  {/* Prominent Red Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="btn-primary text-lg px-8 py-4 mb-3 shadow-md hover:shadow-lg transform active:scale-[0.99] transition-all"
                  >
                    Select PBIX File
                  </button>

                  <p className="text-sm text-slate-500 font-medium">
                    or drop your Power BI report here
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-600">Supported formats:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">.pbix</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-700">.pbit</span>
                    <span>(Max: 250 MB)</span>
                  </div>
                </div>
              ) : (
                /* Extracted Report Result Summary Card */
                <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-left space-y-5 shadow-sm animate-in fade-in-50">
                  <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-[#e5322d] flex items-center justify-center shrink-0">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-base break-all">
                            {parseResult.validation.sanitizedFilename}
                          </h3>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                            parseResult.status === 'success'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-amber-700 bg-amber-50 border-amber-200'
                          }`}>
                            {parseResult.status === 'success' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                            )}
                            {parseResult.status === 'success' ? 'Fully Parsed' : 'Partially Supported'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Format: <span className="uppercase font-mono font-semibold">{parseResult.validation.format}</span> • Size: {(parseResult.validation.sizeBytes / (1024 * 1024)).toFixed(2)} MB • Container: {parseResult.container?.entryCount || 0} files
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleClear}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                      title="Clear file"
                      aria-label="Clear parsed file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Summary Metrics */}
                  {parseResult.report && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Report Pages</span>
                        <span className="text-xl font-bold text-slate-900">{parseResult.report.totalPages}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-500 block">Visual Containers</span>
                        <span className="text-xl font-bold text-slate-900">{parseResult.report.totalVisuals}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                        <span className="text-[11px] text-slate-500 block">Visual Types Recognized</span>
                        <span className="text-xl font-bold text-slate-900">{parseResult.report.supportedVisualTypes.length}</span>
                      </div>
                    </div>
                  )}

                  {/* Detected Pages Breakdown */}
                  {parseResult.report?.pages && parseResult.report.pages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        Extracted Report Pages ({parseResult.report.pages.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {parseResult.report.pages.map((p, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-slate-800 truncate mr-2">
                              {idx + 1}. {p.displayName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                              {p.visualCount} visuals
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings & Partial Support Explanation */}
                  {parseResult.warnings.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-950">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Parser Notices & Limitations:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-amber-800 pl-1 text-[11px]">
                        {parseResult.warnings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => router.push(`/studio?file=${encodeURIComponent(parseResult.validation.sanitizedFilename)}`)}
                      className="btn-primary w-full sm:w-auto text-sm py-2.5 px-6 flex items-center justify-center gap-2"
                    >
                      <span>Explore in Studio Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleClear}
                      className="btn-secondary w-full sm:w-auto text-sm py-2.5 px-4 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Upload Another File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-3 text-left animate-in fade-in-50">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Ingestion Error</p>
                    <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-red-700 p-1"
                    aria-label="Dismiss error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Separate Demo Entry Point */}
            <div className="pt-6">
              <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                <span className="font-medium text-slate-600">Want to test without uploading a file?</span>
                <Link
                  href="/studio?demo=true"
                  className="inline-flex items-center gap-1.5 font-semibold text-[#e5322d] hover:text-[#cc241f] underline-offset-4 hover:underline"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Explore Sample Report in Demo Mode</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Sample Files Section */}
        <section className="py-12 bg-slate-50/70 border-b border-slate-200 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Pre-Loaded PBIX Sample Models
              </h2>
              <p className="text-xs text-slate-500">
                Verified models included with the repository for instant simulation testing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleReports.map((sample, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-[#e5322d]" />
                        <h3 className="font-mono text-xs font-bold text-slate-900 break-all">
                          {sample.name}
                        </h3>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {sample.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sample.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-medium">Ready for Ingestion & AST Extraction</span>
                    <Link
                      href={`/studio?sample=${sample.demoParam}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#e5322d] hover:text-[#cc241f]"
                    >
                      <span>Load in Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                How Power BI Report Simulator Works
              </h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto">
                A simple workflow to view and slice Power BI models on the web without software licensing barriers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-[#e5322d] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">1. Safe Ingestion & AST Parsing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose a `.pbix` or `.pbit` report. Report metadata, visual types, and layout coordinates are read safely in the browser without server transmission.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-[#e5322d] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">2. Interactive Simulation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore multi-dimensional filters, test responsive slicers, and model what-if variance scenarios in real time.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-[#e5322d] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">3. Share via Public Link</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generate a lightweight, view-only web link. Stakeholders can open and explore simulated dashboards on any device with no installations required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
