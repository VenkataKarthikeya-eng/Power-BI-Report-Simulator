'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '@dcaps/ui';

export function CreateShareLinkModal() {
  const { modals, closeModal } = useApp();
  const { showToast } = useToast();

  const [passcode, setPasscode] = useState('Partner2026!');
  const [domain, setDomain] = useState('partnercorp.com');
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowAiCopilot, setAllowAiCopilot] = useState(true);
  const [generatedLink, setGeneratedLink] = useState('');

  if (!modals.createShareLink) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const token = Math.random().toString(36).substring(2, 10);
    const link = `https://app.capsuleai.com/viewer?token=${token}`;
    setGeneratedLink(link);
    showToast({
      type: 'success',
      title: 'Share Token Created',
      message: 'Secure passcode-protected link generated successfully!',
    });
  };

  const copyToClipboard = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    showToast({
      type: 'info',
      title: 'Link Copied',
      message: 'Copied share link to clipboard!',
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Create Secure Share Link</h3>
            <p className="text-xs text-slate-400 mt-0.5">Generate passcode-protected external access token</p>
          </div>
          <button onClick={() => closeModal('createShareLink')} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {!generatedLink ? (
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Passcode Protection</label>
              <input
                type="text"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Allowed Email Domain Whitelist</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. partnercorp.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block font-bold text-slate-200">Permission Options</label>
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                />
                <span>Allow Binary Capsule Download (.dcaps)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={allowAiCopilot}
                  onChange={(e) => setAllowAiCopilot(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded bg-slate-800 border-slate-700"
                />
                <span>Enable AI Copilot Natural Language Query</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => closeModal('createShareLink')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
              >
                Generate Token →
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-2xl space-y-2">
              <div className="font-bold text-emerald-400">✅ Share Link Generated!</div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-200 truncate">
                {generatedLink}
              </div>
              <p className="text-[11px] text-slate-400">Passcode: <strong className="text-white">{passcode}</strong> | Whitelist: {domain}</p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow"
              >
                📋 Copy Link to Clipboard
              </button>
              <button
                onClick={() => {
                  setGeneratedLink('');
                  closeModal('createShareLink');
                }}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
