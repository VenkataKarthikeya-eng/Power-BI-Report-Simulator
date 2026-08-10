'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

export default function AIBuilderPage() {
  const { addCapsule } = useApp();
  const { showToast } = useToast();
  const router = useRouter();

  const [prompt, setPrompt] = useState('Create a sales and freight logistics dashboard for the last 12 months.');
  const [domain, setDomain] = useState('SUPPLY_CHAIN');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDash, setGeneratedDash] = useState<any>(null);

  const samplePrompts = [
    { label: '📈 Sales T12M', prompt: 'Create a sales revenue and rep quota dashboard for the last 12 months.', domain: 'SALES' },
    { label: '👥 HR Attrition', prompt: 'Build an HR dashboard showing attrition, hiring and department performance.', domain: 'HR' },
    { label: '🚚 Freight Logistics', prompt: 'Create a logistics freight margin and transit delay dashboard for Q3.', domain: 'SUPPLY_CHAIN' },
  ];

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDash({
        id: `dash_ai_${Date.now()}`,
        name: `AI ${domain} Executive Dashboard`,
        domain,
        kpis: [
          { name: 'Total Revenue Margin', expressionDax: 'SUM(Fact_Sales[FreightCost])', description: 'Aggregated net revenue margin.' },
          { name: 'Delayed Shipments Count', expressionDax: 'CALCULATE(COUNTROWS(Fact_Shipments), KEEPFILTERS(TransitDelayHours > 48))', description: 'Refactored KEEPFILTERS delayed count.' }
        ],
        visualContainers: [
          { id: 'vis_101', visualType: 'cardKPI', title: 'Total Revenue Margin', fields: ['FreightCost'] },
          { id: 'vis_102', visualType: 'cardKPI', title: 'Delayed Shipments Count', fields: ['TransitDelayHours'] },
        ],
      });
      showToast({
        type: 'success',
        title: 'Dashboard Synthesized',
        message: 'AI Multi-Agent Swarm generated complete dashboard structure!',
      });
    }, 1000);
  };

  const handleCompileCapsule = () => {
    if (!generatedDash) return;
    addCapsule({
      name: `${generatedDash.name.replace(/\s+/g, '_')}.dcaps`,
      version: 'v1.0.0',
      size: '18.4 MB',
      hash: '9f8101...cc20',
      signature: 'ECDSA P-384',
      status: 'PUBLISHED',
      healthScore: 98,
      savings: '-62% Size Reduction',
    });
    showToast({
      type: 'success',
      title: 'Encrypted Capsule Compiled',
      message: 'Added compiled capsule to workspace repository.',
    });
    router.push('/capsules');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Guidance Header */}
      <div className="border-b border-slate-800 pb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Natural Language Dashboard Builder</h1>
            <Badge variant="info">Prompt-to-Dashboard</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Transform natural language prompts into complete, production-ready analytics dashboards automatically.
          </p>
        </div>
      </div>

      {/* Prompt Form */}
      <Card title="Natural Language Prompt & Intent Configuration">
        <form onSubmit={handleGenerate} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Prompt Input</label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'Create a sales dashboard for the last 12 months'..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Quick Prompts:</span>
            {samplePrompts.map((sp) => (
              <button
                key={sp.label}
                type="button"
                onClick={() => { setPrompt(sp.prompt); setDomain(sp.domain); }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-indigo-300 transition-colors font-medium"
              >
                {sp.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50"
            >
              {isGenerating ? '⚡ AI Synthesizing...' : '✨ Generate AI Dashboard'}
            </button>
          </div>
        </form>
      </Card>

      {/* Generated Result */}
      {generatedDash && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white tracking-tight">{generatedDash.name}</h2>
            <button
              onClick={handleCompileCapsule}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md"
            >
              📦 Compile to Encrypted Capsule (.dcaps) →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedDash.kpis.map((kpi: any, idx: number) => (
              <Card key={idx} title={kpi.name}>
                <p className="text-xs text-slate-300 mt-1">{kpi.description}</p>
                <div className="mt-2 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-300">
                  {kpi.expressionDax}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
