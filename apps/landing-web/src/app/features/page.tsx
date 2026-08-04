import React from 'react';

export default function FeaturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Enterprise Feature Architecture</h1>
        <p className="text-slate-400 mt-4 text-lg">
          Explore the technology behind .dcaps binary packaging, zero-trust WASM execution, and AI optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl font-bold">📦</div>
          <h3 className="text-xl font-bold text-white">.dcaps Capsule Packaging</h3>
          <p className="text-sm text-slate-400">
            Converts Power BI reports into compressed, cryptographically signed binaries. Reduces file size by up to 65%.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-2xl font-bold">⚡</div>
          <h3 className="text-xl font-bold text-white">Client WASM / DuckDB Viewer</h3>
          <p className="text-sm text-slate-400">
            Executes analytical queries directly in WebAssembly at sub-50ms latency with zero Power BI Desktop dependency.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl font-bold">🤖</div>
          <h3 className="text-xl font-bold text-white">AI DAX Optimizer</h3>
          <p className="text-sm text-slate-400">
            Automatically refactors scalar DAX bottlenecks, removes unreferenced columns, and scores dashboard health (0-100).
          </p>
        </div>
      </div>
    </div>
  );
}
