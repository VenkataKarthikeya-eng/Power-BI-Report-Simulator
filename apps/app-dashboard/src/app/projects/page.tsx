'use client';

import React from 'react';
import { Card, SmartEmptyState } from '@dcaps/ui';
import { useApp } from '../../context/AppContext';

export default function ProjectsPage() {
  const { workspaces, setActiveWorkspace, activeWorkspace, openModal } = useApp();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Guidance Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workspaces & Projects</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize reports, team members, and AI data models by department or client project.
          </p>
        </div>

        <button
          onClick={() => openModal('createWorkspace')}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-all shrink-0"
        >
          + Create Workspace
        </button>
      </div>

      {workspaces.length === 0 ? (
        <SmartEmptyState
          title="No workspaces created yet."
          description="Workspaces store dashboards, team members, and AI model configurations."
          primaryActionLabel="Create Your First Workspace"
          onPrimaryAction={() => openModal('createWorkspace')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => setActiveWorkspace(ws)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeWorkspace.id === ws.id
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">{ws.type}</span>
                {activeWorkspace.id === ws.id && (
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-semibold">
                    ACTIVE
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mt-2">{ws.name}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ws.description}</p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
                <span>{ws.capsulesCount} Capsules</span>
                <span>{ws.membersCount} Members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
