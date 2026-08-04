'use client';

import React, { useEffect, useState } from 'react';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const links = [
    { title: 'Workspace Dashboard', url: '/dashboard', category: 'Navigation' },
    { title: 'Import PBIX File', url: '/import', category: 'Actions' },
    { title: 'Capsule Repository', url: '/capsules', category: 'Navigation' },
    { title: 'AI Copilot Assistant', url: '/copilot', category: 'AI Tools' },
    { title: 'Organization IAM Settings', url: '/org/settings', category: 'Admin' },
    { title: 'Telemetry & Analytics', url: '/analytics', category: 'Analytics' },
  ];

  const filteredLinks = links.filter((link) =>
    link.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace... (Esc to close)"
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredLinks.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No matching commands found</div>
          ) : (
            filteredLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/80 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {item.title}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
