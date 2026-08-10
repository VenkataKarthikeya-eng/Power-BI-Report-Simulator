'use client';

import React, { useState } from 'react';
import { Card, Badge, useToast } from '@dcaps/ui';
import { useRouter } from 'next/navigation';

export default function CopilotPage() {
  const { showToast } = useToast();
  const router = useRouter();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Alex! I am your AI Business Copilot. Ask any question about your revenue, profit margins, or regional performance.',
      chartSuggestion: null as string | null,
      recommendedAction: null as string | null,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const examplePrompts = [
    'Why did profit decrease?',
    'Which region has highest growth?',
    'Find unusual sales patterns.',
    'Summarize this dashboard in 1 minute',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', text: query, chartSuggestion: null, recommendedAction: null }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      let explanation = `Analyzing 12,840 dataset rows for "${query}"...\nResult: Total revenue expanded to $25.4M with +18.4% YoY growth.`;
      let chart = 'Bar Chart: Regional Revenue Breakdown (North America vs Europe)';
      let action = 'Reallocate 15% transit volume to FedEx Freight to optimize margin.';

      if (query.toLowerCase().includes('profit decrease') || query.toLowerCase().includes('profit')) {
        explanation = 'Profit decreased by 8.4% during August because regional shipping costs increased by 14.2% due to carrier surcharges on DHL Express routes.';
        chart = 'Waterfall Chart: Revenue to Net Profit Margin Variance ($7.8M)';
        action = 'Apply 1-Click Auto-Fix to refactor carrier contract routing.';
      } else if (query.toLowerCase().includes('region') || query.toLowerCase().includes('growth')) {
        explanation = 'North America Logistics is your highest-performing region, generating $5.2M in quarterly revenue with +22.0% YoY growth.';
        chart = 'Line Chart: Monthly Growth Trajectory across North America vs APAC';
        action = 'Expand North America regional warehouse distribution capacity by 20%.';
      } else if (query.toLowerCase().includes('unusual') || query.toLowerCase().includes('pattern')) {
        explanation = 'Detected unusual +34% order spikes in the Asia Pacific transit corridor between 2 AM and 5 AM UTC, driven by automated API restocking orders.';
        chart = 'Heatmap: Order Volume Distribution by Hour & Timezone';
        action = 'Enable automated inventory pre-allocation for APAC regional hubs.';
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: explanation,
          chartSuggestion: chart,
          recommendedAction: action,
        },
      ]);

      showToast({
        type: 'info',
        title: 'AI Business Explanation Generated',
        message: 'Calculated insight over 12,840 record rows.',
      });
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">ChatGPT for Enterprise Business</h1>
            <Badge variant="info">AI Swarm RAG Active</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ask plain-English business queries and receive instant explanations, chart visualizations, and recommended actions.
          </p>
        </div>

        <button
          onClick={() => handleSend('Summarize this dashboard in 1 minute')}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-md"
        >
          ⚡ 1-Minute Executive Summary
        </button>
      </div>

      {/* Example Prompt Chips */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
          Suggested Business Queries:
        </span>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-semibold transition-colors"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <Card className="h-[540px] flex flex-col justify-between p-6">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-2xl space-y-3">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none font-semibold ml-auto max-w-lg shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  <div className="font-bold mb-1 text-[11px] text-slate-400">
                    {m.role === 'user' ? 'You' : '🤖 AI Business Assistant'}
                  </div>
                  <div>{m.text}</div>
                </div>

                {/* Structured Explanation Card */}
                {m.role === 'assistant' && m.chartSuggestion && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                    <div className="flex items-center gap-2 text-indigo-400 font-bold">
                      <span>📊 Suggested Visualization:</span>
                      <span className="text-white font-normal">{m.chartSuggestion}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-purple-300 font-semibold">💡 Recommended Action: {m.recommendedAction}</span>
                      <button
                        onClick={() => router.push('/health')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold text-[11px] shadow shrink-0"
                      >
                        Execute Action →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl bg-slate-800 text-indigo-400 border border-slate-700 text-xs animate-pulse">
                🤖 AI Assistant processing query & synthesizing chart recommendations...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 flex space-x-3 pt-4 border-t border-slate-800"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a business query (e.g. 'Why did profit decrease?')..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-40"
          >
            Send Question →
          </button>
        </form>
      </Card>
    </div>
  );
}
