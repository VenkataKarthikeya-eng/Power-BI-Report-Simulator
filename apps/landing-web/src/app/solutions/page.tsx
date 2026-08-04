import React from 'react';

export default function SolutionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-extrabold text-white mb-6">Enterprise Solutions by Industry</h1>
      <p className="text-slate-400 mb-12 max-w-2xl">Tailored dashboard packaging and compliance for Financial Services, Healthcare, Logistics, and SaaS.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-2">Financial Services</h3>
          <p className="text-sm text-slate-400">Protect proprietary financial models and DAX calculations from competitor reverse-engineering.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-white mb-2">Healthcare & Life Sciences</h3>
          <p className="text-sm text-slate-400">HIPAA compliant zero-trust data watermarking and encrypted row-level security enforcement.</p>
        </div>
      </div>
    </div>
  );
}
