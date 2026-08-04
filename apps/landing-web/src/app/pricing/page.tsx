import React from 'react';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Transparent Enterprise Pricing</h1>
        <p className="text-slate-400 mt-4 text-lg">Scalable plans for growing teams and global enterprise organizations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Starter</h3>
          <div className="text-4xl font-extrabold text-white">$49 <span className="text-sm text-slate-500 font-normal">/ mo</span></div>
          <p className="text-xs text-slate-400">Perfect for small teams ingesting up to 25 dashboards/mo.</p>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold">Start Starter Trial</button>
        </div>

        <div className="bg-slate-900 border-2 border-indigo-500 rounded-2xl p-8 space-y-6 relative shadow-2xl">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase rounded-full">Most Popular</div>
          <h3 className="text-xl font-bold text-white">Professional</h3>
          <div className="text-4xl font-extrabold text-white">$199 <span className="text-sm text-slate-500 font-normal">/ mo</span></div>
          <p className="text-xs text-slate-400">Full AI optimization, unlimited capsules, and passcode sharing.</p>
          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold">Start Professional</button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-white">Enterprise</h3>
          <div className="text-4xl font-extrabold text-white">Custom</div>
          <p className="text-xs text-slate-400">Dedicated HSM KMS keys, SAML 2.0 SSO, SCIM 2.0, and 99.99% SLA.</p>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold">Contact Enterprise Sales</button>
        </div>
      </div>
    </div>
  );
}
