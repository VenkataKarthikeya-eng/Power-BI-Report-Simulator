import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Dashboard Capsule AI — Secure BI Packaging Platform',
  description: 'Convert Power BI reports into secure, interactive, zero-trust .dcaps containers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col justify-between">
        {/* Main Navbar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">
                DC
              </div>
              <span className="font-bold text-lg text-white tracking-tight">Dashboard Capsule AI</span>
            </a>

            <nav className="hidden md:flex items-center space-x-8 text-sm text-slate-300 font-medium">
              <a href="/features" className="hover:text-indigo-400 transition-colors">Features</a>
              <a href="/solutions" className="hover:text-indigo-400 transition-colors">Solutions</a>
              <a href="/ai-features" className="hover:text-indigo-400 transition-colors">AI Engine</a>
              <a href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
              <a href="/docs" className="hover:text-indigo-400 transition-colors">Docs</a>
            </nav>

            <div className="flex items-center space-x-4">
              <a href="http://localhost:3001/auth/login" className="text-sm font-medium text-slate-300 hover:text-white">
                Sign In
              </a>
              <a href="http://localhost:3001/auth/signup" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all">
                Get Started
              </a>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1">{children}</div>

        {/* Public Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <span className="font-bold text-white text-base">Dashboard Capsule AI</span>
              <p className="text-xs text-slate-500 mt-2 max-w-sm">
                Proprietary .dcaps file specification & zero-trust WebAssembly interactive runtime.
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Product</span>
              <ul className="mt-3 space-y-2 text-xs">
                <li><a href="/features" className="hover:underline">Features</a></li>
                <li><a href="/ai-features" className="hover:underline">AI Validation Engine</a></li>
                <li><a href="/pricing" className="hover:underline">Pricing Plans</a></li>
                <li><a href="/status" className="hover:underline">System Status</a></li>
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Company</span>
              <ul className="mt-3 space-y-2 text-xs">
                <li><a href="/about" className="hover:underline">About Us</a></li>
                <li><a href="/blog" className="hover:underline">Engineering Blog</a></li>
                <li><a href="/careers" className="hover:underline">Careers</a></li>
                <li><a href="/contact" className="hover:underline">Contact Sales</a></li>
              </ul>
            </div>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">Legal & Compliance</span>
              <ul className="mt-3 space-y-2 text-xs">
                <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
                <li><a href="/faq" className="hover:underline">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800/80 text-center text-xs text-slate-600">
            © 2026 Dashboard Capsule AI, Inc. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
