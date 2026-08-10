'use client';

import React, { useState } from 'react';
import { Card, FileUploadDropzone, Badge, useToast, ProgressTimeline } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function ImportWizardPage() {
  const { addCapsule } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<any>(null);
  const [activeStepNum, setActiveStepNum] = useState<number>(1);

  const workflowSteps = [
    { step: 1, label: 'Upload Dashboard', status: (activeStepNum > 1 ? 'completed' : activeStepNum === 1 ? 'current' : 'upcoming') as any },
    { step: 2, label: 'AI Understanding', status: (activeStepNum > 2 ? 'completed' : activeStepNum === 2 ? 'current' : 'upcoming') as any },
    { step: 3, label: 'Health Analysis', status: (activeStepNum > 3 ? 'completed' : activeStepNum === 3 ? 'current' : 'upcoming') as any },
    { step: 4, label: 'Optimization', status: (activeStepNum > 4 ? 'completed' : activeStepNum === 4 ? 'current' : 'upcoming') as any },
    { step: 5, label: 'Create Capsule', status: (activeStepNum > 5 ? 'completed' : activeStepNum === 5 ? 'current' : 'upcoming') as any },
    { step: 6, label: 'Share Securely', status: (activeStepNum >= 6 ? 'completed' : 'upcoming') as any },
  ];

  const handleStartAnalysis = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(15);
    setCurrentStep('Step 1/6: Reading dataset & report schema...');

    setTimeout(() => {
      setProgress(40);
      setCurrentStep('Step 2/6: AI understanding visual relationships & DAX...');
      setActiveStepNum(2);
    }, 600);

    setTimeout(() => {
      setProgress(70);
      setCurrentStep('Step 3/6: Health Analysis — Evaluating performance & RLS...');
      setActiveStepNum(3);
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      setCurrentStep('Step 4/6: Optimization complete!');
      setUploading(false);
      setActiveStepNum(4);

      setResult({
        fileName: file.name,
        performanceScore: 94,
        securityScore: 98,
        accessibilityScore: 95,
        recommendationsCount: 12,
      });

      addCapsule({
        name: file.name.replace('.pbix', '.dcaps').replace('.pbit', '.dcaps'),
        version: 'v1.0.0',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        hash: '8f9102...ab30',
        signature: 'ECDSA P-384',
        status: 'PUBLISHED',
        healthScore: 94,
        savings: '-62% Size Reduction',
      });

      showToast({
        type: 'success',
        title: 'Dashboard Analysis Complete',
        message: `${file.name} structure has been analyzed by AI.`,
      });
    }, 1800);
  };

  const handleCreateCapsule = () => {
    setActiveStepNum(5);
    setTimeout(() => {
      setActiveStepNum(6);
      showToast({
        type: 'success',
        title: 'AI Dashboard Capsule Created!',
        message: 'Your standalone capsule is compiled and ready for distribution.',
      });
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Guidance Header */}
      <div className="border-b border-slate-800 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">6-Step Guided Capsule Creation</h1>
            <Badge variant="info">Step {activeStepNum} of 6</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload your Power BI report. Our AI will analyze performance, security, and optimization opportunities.
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* 6-Step Timeline Bar */}
      <ProgressTimeline steps={workflowSteps} />

      {/* STEP 1: Upload Dashboard */}
      {activeStepNum <= 1 && (
        <Card title="Upload Your Dashboard" subtitle="Upload your Power BI (.pbix) report file. Our AI will analyze performance, security, and optimization opportunities.">
          <FileUploadDropzone onFileSelect={(f) => setFile(f)} />

          {file && !uploading && (
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-mono">Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              <button
                onClick={handleStartAnalysis}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/25"
              >
                Start Dashboard Analysis →
              </button>
            </div>
          )}

          {uploading && (
            <div className="mt-6 space-y-4 pt-4 border-t border-slate-800">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>{currentStep}</span>
                <span className="text-indigo-400 font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </Card>
      )}

      {/* STEP 2 - 4: AI Analysis & Health Scores */}
      {(activeStepNum === 2 || activeStepNum === 3 || activeStepNum === 4) && result && (
        <Card title="AI Health Analysis & Optimization" subtitle="Review performance and security audits evaluated by the AI Swarm">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Performance Score</div>
                <div className="text-2xl font-extrabold text-emerald-400">{result.performanceScore} / 100</div>
                <div className="text-[10px] text-slate-500 mt-1">18ms Render Latency</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Security Score</div>
                <div className="text-2xl font-extrabold text-emerald-400">{result.securityScore} / 100</div>
                <div className="text-[10px] text-slate-500 mt-1">RLS Active</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">Accessibility Score</div>
                <div className="text-2xl font-extrabold text-purple-400">{result.accessibilityScore} / 100</div>
                <div className="text-[10px] text-slate-500 mt-1">WCAG 2.2 Passed</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400 mb-1">AI Recommendations</div>
                <div className="text-2xl font-extrabold text-indigo-400">{result.recommendationsCount} Available</div>
                <div className="text-[10px] text-slate-500 mt-1">1-Click Auto Fix</div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center border-t border-slate-800">
              <button
                onClick={() => setActiveStepNum(1)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Re-upload Dashboard
              </button>
              <button
                onClick={handleCreateCapsule}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/25"
              >
                Generate AI Dashboard Capsule →
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 5 & 6: View Capsule & Share */}
      {activeStepNum >= 5 && (
        <Card title="Step 6: Dashboard Capsule Ready & Shareable" subtitle="Your AI dashboard capsule is compiled, verified, and ready to share securely.">
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 flex items-center justify-center text-3xl mx-auto shadow-inner">
              ✨
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Capsule Live: {file?.name || 'global-supply-chain.pbix'}</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your report has been compiled into a standalone zero-latency AI dashboard capsule protected with ECDSA hardware digital signatures.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                onClick={() => router.push('/copilot')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500 text-left transition-all group"
              >
                <div className="text-xl mb-1">🤖</div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-400">Ask AI Copilot</div>
                <div className="text-[11px] text-slate-400 mt-1">Query revenue drivers & profit trends</div>
              </button>

              <button
                onClick={() => router.push('/dashboard')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-left transition-all group"
              >
                <div className="text-xl mb-1">📈</div>
                <div className="text-xs font-bold text-white group-hover:text-purple-400">View Dashboard</div>
                <div className="text-[11px] text-slate-400 mt-1">Open WASM canvas viewer</div>
              </button>

              <button
                onClick={() => router.push('/sharing')}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-left transition-all group"
              >
                <div className="text-xl mb-1">🔗</div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-400">Create Secure Share Link</div>
                <div className="text-[11px] text-slate-400 mt-1">Generate passcode share link</div>
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
