'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function CreateWorkspaceModal() {
  const { modals, closeModal, createWorkspace } = useApp();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('SUPPLY_CHAIN');
  const [description, setDescription] = useState('');

  if (!modals.createWorkspace) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWorkspace(name, description, department);
    setName('');
    setDescription('');
    closeModal('createWorkspace');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">Create New Workspace</h3>
            <p className="text-xs text-slate-400 mt-0.5">Organize dashboards, capsules, and team permissions</p>
          </div>
          <button onClick={() => closeModal('createWorkspace')} className="text-slate-400 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Workspace Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Regional Operations"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department / Business Unit</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="SUPPLY_CHAIN">Supply Chain & Logistics</option>
              <option value="FINANCE">Corporate Finance & P&L</option>
              <option value="HR">People Ops & HR</option>
              <option value="SALES">Sales & Marketing</option>
              <option value="OPERATIONS">Global Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Workspace Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose, KPIs, or reports managed within this workspace..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => closeModal('createWorkspace')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md"
            >
              Create Workspace →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
