import React from 'react';

export default function DocsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-white mb-4">Documentation & Technical Guides</h1>
      <p className="text-slate-400 mb-8">Comprehensive guides for .dcaps compilation, API integration, and security controls.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">Getting Started Guide</h3>
          <p className="text-xs text-slate-400 mb-4">Learn how to upload your first .pbix report and compile a secure .dcaps file.</p>
          <a href="/docs/getting-started" className="text-xs text-indigo-400 font-semibold hover:underline">Read Guide →</a>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">REST API & SDK Reference</h3>
          <p className="text-xs text-slate-400 mb-4">Explore OpenAPI endpoints for automated CI/CD dashboard packaging.</p>
          <a href="/docs/api-reference" className="text-xs text-indigo-400 font-semibold hover:underline">View API Specs →</a>
        </div>
      </div>
    </div>
  );
}
