import React from 'react';

export default function AIFeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold text-white mb-6">AI Dashboard Intelligence Engine</h1>
      <p className="text-slate-400 mb-12 max-w-2xl">Automated DAX refactoring, visual layout auto-adjustment, RAG Copilot, and Whisper Voice assistant.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">🤖 Automated DAX Linter</h3>
          <p className="text-sm text-slate-400">Traverses VertiPaq query ASTs to find unreferenced columns and scalar Bottlenecks.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">🗣️ Whisper Voice Navigation</h3>
          <p className="text-sm text-slate-400">Ask conversational voice queries to slice & dice dashboard charts client-side.</p>
        </div>
      </div>
    </div>
  );
}
