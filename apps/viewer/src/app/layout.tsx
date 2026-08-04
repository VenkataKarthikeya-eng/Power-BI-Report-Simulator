import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Secure WASM Viewer — Dashboard Capsule AI',
  description: 'Zero-trust WebAssembly interactive dashboard viewer shell.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
