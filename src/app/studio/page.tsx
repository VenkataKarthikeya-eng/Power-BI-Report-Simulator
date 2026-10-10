'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  BarChart3, 
  ArrowLeft, 
  Share2, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Info, 
  FileSpreadsheet, 
  ShieldCheck, 
  Play, 
  LogIn, 
  AlertTriangle,
  Loader2,
  Filter,
  CheckCircle2,
  Database,
  Sparkles
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/client';
import { getActiveReport } from '@/lib/parser/report-store';
import type { NormalizedReport, NormalizedPage, NormalizedVisual } from '@/lib/parser/types';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  SimulationState,
  initializeSimulationState,
  recalculateSimulation,
  toggleSlicerFilter,
  createInitialFilterState,
  resetWhatIfParameter,
  getActiveFilterSummary,
} from '@/lib/simulation';
import { VisualRenderer } from '@/components/visuals/VisualRenderer';
import { OnboardingWizard } from '@/components/guided/OnboardingWizard';

function StudioContent() {
  const searchParams = useSearchParams();
  const isDemoParam = searchParams.get('demo') === 'true';
  const sampleParam = searchParams.get('sample');
  const fileParam = searchParams.get('file');

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [report, setReport] = useState<NormalizedReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [simulation, setSimulation] = useState<SimulationState | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const isDemoMode = isDemoParam || !user;

  // 1. Resolve Auth User
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // 2. Resolve Report AST
  useEffect(() => {
    const stored = getActiveReport();
    if (stored && (!fileParam || stored.filename === fileParam)) {
      setReport(stored);
      setLoadingReport(false);
      return;
    }

    if (sampleParam || isDemoParam || fileParam) {
      const sampleKey = sampleParam === 'customer' || fileParam?.includes('customer')
        ? 'customer'
        : 'forecast';

      fetch(`/api/sample-report?sample=${sampleKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.report) {
            setReport(data.report);
          }
        })
        .catch((err) => {
          console.error('Failed to load sample report AST:', err);
        })
        .finally(() => {
          setLoadingReport(false);
        });
    } else {
      setLoadingReport(false);
    }
  }, [sampleParam, isDemoParam, fileParam]);

  // 3. Initialize or update Simulation State when active page or report changes
  useEffect(() => {
    if (!report) return;
    const activePage = report.pages[activePageIndex] || report.pages[0];
    if (activePage) {
      const sim = initializeSimulationState(report, activePage.id, isDemoMode);
      setSimulation(sim);
    }
  }, [report, activePageIndex, isDemoMode]);

  const activePage: NormalizedPage | undefined = report?.pages[activePageIndex];

  // 4. Handle Slicer Toggling
  const handleToggleSlicer = (field: string, value: string) => {
    if (!simulation) return;
    const updatedFilters = toggleSlicerFilter(simulation.filters, field, value);
    const updatedSim = recalculateSimulation(simulation, report, updatedFilters);
    setSimulation(updatedSim);
  };

  // 5. Handle Slicer Clear
  const handleClearSlicer = (field: string) => {
    if (!simulation) return;
    const updatedCategorical = { ...simulation.filters.categorical };
    delete updatedCategorical[field];
    const updatedFilters = { ...simulation.filters, categorical: updatedCategorical };
    const updatedSim = recalculateSimulation(simulation, report, updatedFilters);
    setSimulation(updatedSim);
  };

  // 6. Handle What-If Parameter Change
  const handleWhatIfChange = (val: number) => {
    if (!simulation) return;
    const updatedWhatIf = { ...simulation.whatIf, currentValue: val };
    const updatedSim = recalculateSimulation(simulation, report, undefined, updatedWhatIf);
    setSimulation(updatedSim);
  };

  // 7. Handle Global Reset
  const handleResetSimulation = () => {
    if (!simulation) return;
    const cleanFilters = createInitialFilterState();
    const resetWhatIf = resetWhatIfParameter(simulation.whatIf);
    const updatedSim = recalculateSimulation(simulation, report, cleanFilters, resetWhatIf);
    setSimulation(updatedSim);
  };

  const activeFiltersSummary = simulation ? getActiveFilterSummary(simulation.filters) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      <Header />

      {/* Studio Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>

              <div className="h-5 w-px bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#e5322d]" />
                <h1 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {report ? report.filename : 'Untitled Power BI Report'}
                </h1>
                {report && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                    .{report.format} ({report.totalPages} Pages)
                  </span>
                )}
              </div>
            </div>

            {/* Right: Actions & Mode Indicator */}
            <div className="flex items-center gap-2">
              {isDemoMode ? (
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-semibold">
                    <Play className="w-3 h-3 text-amber-600 fill-current" />
                    <span>Demo Mode (Interactive)</span>
                  </span>
                  <Link
                    href="/login?redirectTo=/studio"
                    className="btn-outline-red text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                </div>
              ) : (
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated: {user?.email}</span>
                </span>
              )}

              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                title="Open Power BI Report Simulator Guided Tour"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#e5322d]" />
                <span className="hidden sm:inline">Tour</span>
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                title="Reset simulation parameters and active filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <Link
                href="/share/demo"
                className="btn-outline-red text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Preview</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Working Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
        {loadingReport ? (
          /* Loading State */
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3 min-h-[460px]">
            <Loader2 className="w-8 h-8 text-[#e5322d] animate-spin" />
            <p className="text-sm font-semibold text-slate-800">Loading Report & Simulation Engine...</p>
          </div>
        ) : !report ? (
          /* Empty State when no report is selected */
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[460px]">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#e5322d] flex items-center justify-center border border-red-100">
              <FileSpreadsheet className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-1">
              <h2 className="text-lg font-bold text-slate-900">No Report Selected</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Please upload a Power BI report (.pbix or .pbit) from the homepage, or explore one of the pre-loaded sample models in Demo Mode.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link href="/" className="btn-primary text-xs py-2.5 px-5">
                Upload Report on Homepage
              </Link>
              <Link href="/studio?sample=forecast&demo=true" className="btn-secondary text-xs py-2.5 px-4">
                Explore Demo Simulation
              </Link>
            </div>
          </div>
        ) : (
          /* Report Loaded View */
          <>
            {/* Left Sidebar: Pages, Active Slicers, What-If Sensitivity Controls */}
            <aside className="w-full lg:w-80 shrink-0 space-y-5">
              {/* Ingestion & Simulation Status Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Simulation Engine
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    simulation?.isDemoMode
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {simulation?.isDemoMode ? 'Demo Dataset' : 'AST Preserved'}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Active Page:</span>
                    <strong className="text-slate-900">{activePage?.displayName || 'None'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Visuals on Page:</span>
                    <strong className="text-slate-900">{activePage?.visualCount || 0}</strong>
                  </div>
                  {simulation?.isDemoMode ? (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Rows Active:</span>
                      <span>{simulation.summary.filteredRows} / {simulation.summary.totalRows}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-amber-700 font-medium">
                      <span>Data Rows:</span>
                      <span>Binary VertiPaq</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Real Extracted Pages Tabs */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    Report Pages ({report.pages.length})
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">Select Page</span>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {report.pages.map((page, idx) => (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => setActivePageIndex(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                        activePageIndex === idx
                          ? 'bg-red-50 text-[#e5322d] border border-red-200 font-semibold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          activePageIndex === idx ? 'bg-[#e5322d]' : 'bg-slate-300'
                        }`} />
                        <span className="truncate">{page.displayName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                        {page.visualCount} visuals
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slicers & Active Filters Panel */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    Interactive Slicers
                  </h2>
                  {activeFiltersSummary.length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetSimulation}
                      className="text-[10px] text-[#e5322d] hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {simulation?.isDemoMode ? (
                  <div className="space-y-3">
                    {/* Region Slicer */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Region Slicer</span>
                        {simulation.filters.categorical['Region']?.length ? (
                          <span className="text-[10px] text-purple-700 font-mono">
                            {simulation.filters.categorical['Region'].length} selected
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['North America', 'EMEA', 'APAC', 'LATAM'].map((reg) => {
                          const isSel = simulation.filters.categorical['Region']?.includes(reg);
                          return (
                            <button
                              key={reg}
                              type="button"
                              onClick={() => handleToggleSlicer('Region', reg)}
                              className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                                isSel
                                  ? 'bg-[#e5322d] text-white border-[#e5322d]'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              {reg}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Category Slicer */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>Product Category</span>
                        {simulation.filters.categorical['Category']?.length ? (
                          <span className="text-[10px] text-purple-700 font-mono">
                            {simulation.filters.categorical['Category'].length} selected
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {['Cloud Services', 'Software', 'Hardware'].map((cat) => {
                          const isSel = simulation.filters.categorical['Category']?.includes(cat);
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleToggleSlicer('Category', cat)}
                              className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                                isSel
                                  ? 'bg-[#e5322d] text-white border-[#e5322d]'
                                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg leading-relaxed">
                    Slicers are identified in report layout. Data filtering operates in Demo Mode or when tabular rows are provided.
                  </p>
                )}
              </div>

              {/* What-If Scenario Slider */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    What-If Variance Multiplier
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#e5322d]">
                    {simulation?.whatIf.currentValue && simulation.whatIf.currentValue > 0
                      ? `+${simulation.whatIf.currentValue}%`
                      : `${simulation?.whatIf.currentValue || 0}%`}
                  </span>
                </div>

                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="5"
                  value={simulation?.whatIf.currentValue || 0}
                  disabled={!simulation?.whatIf.supported}
                  onChange={(e) => handleWhatIfChange(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#e5322d] disabled:opacity-50"
                  aria-label="What-if simulation variance percentage"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>-30%</span>
                  <span>Baseline (0%)</span>
                  <span>+50%</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {simulation?.whatIf.supported
                    ? 'Dynamically adjusts revenue metrics and dependent chart series in real-time.'
                    : 'What-If sensitivity requires an active tabular dataset.'}
                </p>
              </div>
            </aside>

            {/* Main Canvas Viewport: Rendering Interactive Visual Containers */}
            <main className="flex-1 flex flex-col space-y-4">
              {/* Simulation Status Alert Banner */}
              {simulation?.isDemoMode ? (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-sm">
                  <Play className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-950">
                      Interactive Simulation Mode Active (Illustrative Demo Model)
                    </p>
                    <p className="mt-0.5 leading-relaxed text-amber-800">
                      The cards, charts, and tables below are fully wired to the client-side simulation engine. Click slicer pills or drag the What-If variance slider to recalculate aggregations in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3 shadow-sm">
                  <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-950">
                      Report Layout & Visual AST Preserved from {report.filename}
                    </p>
                    <p className="mt-0.5 leading-relaxed text-blue-800">
                      Visual containers and layout coordinates were successfully extracted. Because the proprietary binary VertiPaq tabular model is not executed in browser memory, visuals indicate unexecuted data model rather than fabricating fake numbers.
                    </p>
                  </div>
                </div>
              )}

              {/* Canvas Container */}
              <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col space-y-6 min-h-[560px]">
                {/* Canvas Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e5322d]" />
                    <span className="text-sm font-bold text-slate-900">
                      Page Viewport: {activePage?.displayName}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({activePage?.visualCount} Visual Containers)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Virtual Size: {activePage?.width || 1280} × {activePage?.height || 720}</span>
                    <span>•</span>
                    <span>Active Filters: {simulation?.summary.activeFilterCount || 0}</span>
                  </div>
                </div>

                {/* Visual Containers Grid */}
                {activePage && activePage.visuals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activePage.visuals.map((visual, vIdx) => {
                      const visualData = simulation?.computedVisuals[visual.id];
                      return (
                        <div
                          key={visual.id || vIdx}
                          className="min-h-[180px] flex flex-col"
                        >
                          <VisualRenderer
                            visual={visual}
                            data={visualData}
                            onToggleSlicer={handleToggleSlicer}
                            onClearSlicer={handleClearSlicer}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No visuals detected on this page.
                  </div>
                )}

                {/* Bottom Source & Actions Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Source:</span>
                    <span className="font-mono text-slate-600">{report.filename}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/"
                      className="font-semibold text-[#e5322d] hover:text-[#cc241f] hover:underline"
                    >
                      Upload a different report
                    </Link>
                    <span>•</span>
                    <Link
                      href="/share/demo"
                      className="font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                    >
                      Preview Public Share View
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Studio Guided Onboarding Wizard */}
      <OnboardingWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        autoPrompt={false}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm">
        Loading Studio Workspace...
      </div>
    }>
      <StudioContent />
    </Suspense>
  );
}
