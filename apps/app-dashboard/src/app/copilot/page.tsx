'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

export default function CopilotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello Alex! I am your AI Dashboard Copilot. Ask any question about your active `.dcaps` dataset schema or DAX measures.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const quickPrompts = [
    'Summarize this dashboard',
    'What caused transit delays to spike?',
    'Explain Freight Margin KPI',
    'Show top 5 carriers by revenue',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: query },
      {
        role: 'assistant',
        text: `Analyzing active DataModel AST vectors for "${query}"...\nResult: Total Freight Cost increased +14.2% primarily driven by 54.1 transit delay hours on DHL Express regional routes.`,
      },
    ]);
    setInput('');
  };

  const handleVoiceTrigger = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleSend('What caused transit delays to spike?');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Dashboard Copilot & Natural Language Query</h1>
          <p className="text-sm text-slate-400 mt-1">RAG-powered conversational analytics over active `.dcaps` data models.</p>
        </div>
        <Button variant="outline" onClick={() => setSummaryOpen(!summaryOpen)}>
          📊 Executive Summary Panel
        </Button>
      </div>

      {/* Executive Summary Drawer */}
      {summaryOpen && (
        <Card title="AI Executive Summary (1-Minute Briefing)">
          <div className="space-y-3 text-xs text-slate-300">
            <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200">
              ⚡ <strong>1-Minute Summary:</strong> Q3 Logistics global operations delivered $1.48M in freight margin. FedEx Freight maintains the lowest transit delay (12.4h).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg">
                <h4 className="font-bold text-emerald-400 mb-1">Key Opportunity</h4>
                <p>Renegotiating regional carrier rates with DHL Express could yield an additional +$140k in quarterly margin.</p>
              </div>
              <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-lg">
                <h4 className="font-bold text-rose-400 mb-1">Identified Risk</h4>
                <p>Unmasked PII detected in raw DriverSSN dictionary column before RLS filtering was applied.</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl text-xs text-indigo-300 font-medium transition-colors"
          >
            💬 {prompt}
          </button>
        ))}
      </div>

      {/* Main Conversational Window */}
      <Card className="h-[550px] flex flex-col justify-between p-6">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none font-medium'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar with Speech-to-Text Voice Trigger */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="mt-4 flex space-x-3 pt-4 border-t border-slate-800"
        >
          <button
            type="button"
            onClick={handleVoiceTrigger}
            className={`p-3 rounded-xl border transition-colors ${
              isListening ? 'bg-rose-600 text-white border-rose-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Speech-to-Text Voice Query"
          >
            🎤
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a business query (e.g. 'Explain Freight Margin KPI')..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
          />

          <Button type="submit" variant="primary">
            Send Prompt →
          </Button>
        </form>
      </Card>
    </div>
  );
}
