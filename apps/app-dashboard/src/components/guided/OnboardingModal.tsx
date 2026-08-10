'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export function OnboardingModal() {
  const { onboardingStep, completeOnboardingStep, dismissOnboarding, openModal } = useApp();
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState('Business Analyst');
  const [selectedIntent, setSelectedIntent] = useState('Upload Dashboard');

  if (onboardingStep === null) return null;

  const roles = [
    { name: 'Business Analyst', desc: 'Build reports, DAX queries, and dashboard capsules', icon: '📊' },
    { name: 'Data Scientist', desc: 'Train ML models and run Monte Carlo simulations', icon: '🧪' },
    { name: 'Manager / Executive', desc: 'Track revenue, profit KPIs, and AI recommendations', icon: '💼' },
    { name: 'Enterprise Admin', desc: 'Manage users, security audits, and subscription seats', icon: '🛡️' },
  ];

  const intents = [
    { name: 'Upload Dashboard', desc: 'Upload Power BI (.pbix) files for AI parsing', icon: '📥', route: '/import' },
    { name: 'Analyze Performance', desc: 'Detect DAX bottlenecks & security risks', icon: '🩺', route: '/health' },
    { name: 'Generate Insights', desc: 'Ask AI Copilot plain-English questions', icon: '🤖', route: '/copilot' },
    { name: 'Monitor Business', desc: 'Executive Revenue & Profit KPIs', icon: '📈', route: '/dashboard' },
  ];

  const handleStep1Next = () => completeOnboardingStep(2);
  const handleStep2Next = () => completeOnboardingStep(3);
  const handleStep3Next = () => completeOnboardingStep(4);
  const handleStep4Finish = () => {
    completeOnboardingStep(4);
    dismissOnboarding();
    const targetIntent = intents.find((i) => i.name === selectedIntent);
    if (targetIntent) {
      router.push(targetIntent.route);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Step {onboardingStep} of 4 • Guided Setup
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Welcome to Dashboard Capsule AI
            </h2>
          </div>
          <button
            onClick={dismissOnboarding}
            className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-800"
          >
            Skip Setup ✕
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`h-2 rounded-full transition-all duration-300 ${
                stepNum <= onboardingStep ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Welcome */}
        {onboardingStep === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-950/80 border border-indigo-700/80 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🚀
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Transform Your Dashboards Into AI Capsules</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                We help you convert traditional Power BI dashboards into intelligent, secure, and zero-latency AI analytics capsules powered by DuckDB WebAssembly.
              </p>
            </div>
            <button
              onClick={handleStep1Next}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              Get Started →
            </button>
          </div>
        )}

        {/* Step 2: Role Selection */}
        {onboardingStep === 2 && (
          <div className="space-y-4 py-2">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">What is your role?</h3>
              <p className="text-xs text-slate-400">Select your profile to customize your AI workspace interface.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roles.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => setSelectedRole(r.name)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedRole === r.name
                      ? 'bg-indigo-950/60 border-indigo-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-lg">{r.icon}</span>
                    <span className="text-xs font-bold text-white">{r.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">{r.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <button
                onClick={() => completeOnboardingStep(1)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleStep2Next}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Intent Selection */}
        {onboardingStep === 3 && (
          <div className="space-y-4 py-2">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white">What do you want to do today?</h3>
              <p className="text-xs text-slate-400">Choose your primary action to launch the guided workflow.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {intents.map((i) => (
                <button
                  key={i.name}
                  type="button"
                  onClick={() => setSelectedIntent(i.name)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedIntent === i.name
                      ? 'bg-purple-950/60 border-purple-500 text-white'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-lg">{i.icon}</span>
                    <span className="text-xs font-bold text-white">{i.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">{i.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <button
                onClick={() => completeOnboardingStep(2)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleStep3Next}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Create Workspace */}
        {onboardingStep === 4 && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-center text-3xl mx-auto shadow-inner">
              🏢
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Setup Your Workspace</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Your workspace <strong className="text-white">Global Analytics Team</strong> is initialized and ready for team collaboration.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Role:</span>
                <span className="font-bold text-indigo-400">{selectedRole}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Primary Goal:</span>
                <span className="font-bold text-purple-400">{selectedIntent}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Security Engine:</span>
                <span className="font-bold text-emerald-400">ECDSA P-384 Encrypted</span>
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => completeOnboardingStep(3)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleStep4Finish}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25"
              >
                Enter My Workspace →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
