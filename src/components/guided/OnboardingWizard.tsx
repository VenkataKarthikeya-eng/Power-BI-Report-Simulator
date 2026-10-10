'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  UploadCloud, 
  Sliders, 
  Share2, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen?: boolean;
  onClose?: () => void;
  autoPrompt?: boolean;
}

export function OnboardingWizard({ 
  isOpen: controlledIsOpen, 
  onClose: controlledOnClose,
  autoPrompt = true 
}: OnboardingWizardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  useEffect(() => {
    if (!isControlled && autoPrompt) {
      if (typeof window !== 'undefined') {
        const hasSeen = localStorage.getItem('power_bi_simulator_onboarding_seen');
        if (!hasSeen) {
          setInternalOpen(true);
        }
      }
    }
  }, [isControlled, autoPrompt]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('power_bi_simulator_onboarding_seen', 'true');
    }
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-wizard-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 text-slate-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e5322d] text-white flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e5322d]">
                Step {currentStep} of 4 • Quick Tour
              </span>
              <h2 id="onboarding-wizard-title" className="text-sm font-bold text-slate-900 leading-tight">
                Power BI Report Simulator
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close onboarding wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                stepNum <= currentStep ? 'bg-[#e5322d]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome & Short Description */}
        {currentStep === 1 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#e5322d] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Welcome to Power BI Report Simulator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium max-w-sm mx-auto">
                Upload Power BI reports, explore dashboard layouts, and interact with simulated analytics.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero licensing friction for stakeholders</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% private, client-side archive parsing</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant interactive slicing & What-If scenarios</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload & Parse PBIX */}
        {currentStep === 2 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#e5322d] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                1. Upload & Ingest PBIX Reports
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Drag and drop your <span className="font-mono font-semibold text-slate-800">.pbix</span> or <span className="font-mono font-semibold text-slate-800">.pbit</span> file into the homepage uploader.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs text-slate-600">
              <p className="leading-relaxed">
                The simulator reads the ZIP container directly in your browser, extracting:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 font-medium">
                <li>Page viewports and layout dimensions (16:9 / 1920×1080)</li>
                <li>Visual container positions, types, and titles</li>
                <li>Slicer bindings and categorical dimensions</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Interactive Simulation */}
        {currentStep === 3 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#e5322d] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <Sliders className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                2. Slicers & What-If Simulation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Interact with responsive slicers, filter datasets by region or category, and test business projections.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-800">• Real-Time Slicers:</span>
                <span>Click Region or Product Category pills to recalculate metric cards and chart breakdowns.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-slate-800">• What-If Sliders:</span>
                <span>Model sensitivity variances (-30% to +50%) to project adjusted revenue impact on the fly.</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Shareable Web Dashboards */}
        {currentStep === 4 && (
          <div className="space-y-4 text-center py-2 animate-in fade-in duration-150">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#e5322d] border border-red-100 flex items-center justify-center mx-auto shadow-sm">
              <Share2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                3. Share Web Dashboards Instantly
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Generate clean, shareable web links for stakeholders, executives, and team members.
              </p>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-left space-y-1.5 text-xs text-emerald-950">
              <p className="font-bold text-emerald-900">
                Ready to simulate Power BI dashboards:
              </p>
              <p className="text-emerald-800 leading-relaxed">
                Recipients can open and explore simulated dashboards on any web browser without needing Power BI Desktop installed or paying per-user license fees.
              </p>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-600 py-2 px-2"
            >
              Skip Tour
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-sm"
          >
            <span>{currentStep === 4 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
