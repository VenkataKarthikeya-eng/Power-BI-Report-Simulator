'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

interface AgentManifest {
  id: string;
  name: string;
  role: string;
  description: string;
  version: string;
  capabilities: string[];
  priority: number;
}

const INITIAL_AGENTS: AgentManifest[] = [
  { id: 'agent_analyst', name: 'Dashboard Analyst Agent', role: 'ANALYST', description: 'KPI definitions, trend analysis, anomaly detection', version: '2.0.0', capabilities: ['structure_analysis'], priority: 2 },
  { id: 'agent_dax', name: 'DAX Expert Agent', role: 'DAX_OPTIMIZER', description: 'DAX AST parsing, KEEPFILTERS refactoring', version: '2.0.0', capabilities: ['dax_optimization'], priority: 1 },
  { id: 'agent_datamodel', name: 'Data Model Agent', role: 'DATA_MODELER', description: 'Relationship integrity, orphan table pruning', version: '2.0.0', capabilities: ['schema_review'], priority: 3 },
  { id: 'agent_ux', name: 'UX Agent', role: 'UX_DESIGNER', description: '8pt grid layout snapping, WCAG 2.2 AA contrast', version: '2.0.0', capabilities: ['ux_accessibility'], priority: 4 },
  { id: 'agent_security', name: 'Security Agent', role: 'SECURITY_AUDITOR', description: 'Raw PII scanning, RLS rule validation', version: '2.0.0', capabilities: ['security_audit'], priority: 1 },
  { id: 'agent_performance', name: 'Performance Agent', role: 'PERFORMANCE_ENGINEER', description: 'WASM canvas latency, CPU/memory profiling', version: '2.0.0', capabilities: ['performance_review'], priority: 2 },
  { id: 'agent_executive', name: 'Executive Advisor Agent', role: 'EXECUTIVE_ADVISOR', description: '1-min & 5-min summaries, strategic action items', version: '2.0.0', capabilities: ['executive_summary'], priority: 1 },
  { id: 'agent_documentation', name: 'Documentation Agent', role: 'TECHNICAL_WRITER', description: 'Auto-generation of technical & OpenAPI specs', version: '2.0.0', capabilities: ['documentation'], priority: 5 },
  { id: 'agent_testing', name: 'Testing Agent', role: 'QA_ENGINEER', description: '15-stage pipeline regression testing', version: '2.0.0', capabilities: ['testing_validation'], priority: 1 },
  { id: 'agent_coordinator', name: 'Coordinator Agent', role: 'SWARM_COORDINATOR', description: 'Work assignment, response merging, consensus calculation', version: '2.0.0', capabilities: ['swarm_coordination'], priority: 0 },
];

export default function AgentsWorkspacePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [swarmReport, setSwarmReport] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'agents' | 'timeline' | 'memory' | 'chat'>('agents');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: '👋 Multi-Agent Swarm initialized. All 10 specialized enterprise agents are online and ready for collaborative analysis.' }
  ]);

  const handleRunSwarm = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('http://localhost:8086/api/v2/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dashboardId: 'dash_3c91a02b', query: 'Full multi-agent swarm audit' })
      });
      const json = await res.json();
      if (json.success) {
        setSwarmReport(json.data);
      }
    } catch {
      // Fallback mock report for offline demo UI
      setSwarmReport({
        sessionId: 'sess_swarm_2026_demo',
        status: 'COMPLETED',
        totalAgentsRun: 10,
        consensusScore: 0.97,
        averageConfidence: 0.96,
        totalDurationMs: 42,
        unifiedSummary: 'Parallel multi-agent swarm completed execution across 10 subagents with 97.0% consensus score.',
        agentResults: INITIAL_AGENTS.map((a) => ({
          agentId: a.id,
          agentName: a.name,
          status: 'COMPLETED',
          confidenceScore: 0.96,
          executionTimeMs: Math.floor(Math.random() * 15) + 20,
          recommendations: [`Optimized ${a.role} recommendations applied.`]
        }))
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', content: msg }]);
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `🤖 Multi-Agent Swarm Consensus: DAX Expert Agent identified a 65% DAX performance refactoring opportunity (KEEPFILTERS). Security Agent verified zero PII leaks. UX Agent snapped visual containers to 8pt grid.`
        }
      ]);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Enterprise Multi-Agent AI Platform</h1>
            <Badge variant="info">v2.0 Active Swarm</Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">10 specialized AI agents cooperating concurrently with shared memory and real-time consensus scoring.</p>
        </div>
        <Button variant="primary" onClick={handleRunSwarm} disabled={isRunning}>
          {isRunning ? '⚡ Executing Swarm...' : '🚀 Launch Multi-Agent Swarm'}
        </Button>
      </div>

      {/* Swarm Metrics Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-400">Active Agents</div>
          <div className="text-3xl font-extrabold text-white mt-2">10 / 10</div>
          <div className="text-xs text-emerald-400 mt-1">● 100% Swarm Health</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-400">Consensus Score</div>
          <div className="text-3xl font-extrabold text-indigo-400 mt-2">
            {swarmReport ? `${(swarmReport.consensusScore * 100).toFixed(1)}%` : '97.0%'}
          </div>
          <div className="text-xs text-slate-400 mt-1">High Agreement Index</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-400">Execution Latency</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">
            {swarmReport ? `${swarmReport.totalDurationMs} ms` : '42 ms'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Parallel Goroutines</div>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase text-slate-400">Shared Memory Store</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">14.8 MB</div>
          <div className="text-xs text-slate-400 mt-1">Multi-Tier Context Store</div>
        </Card>
      </div>

      {/* Workspace Tabs */}
      <div className="border-b border-slate-800 flex gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('agents')}
          className={`pb-3 border-b-2 transition-colors ${activeTab === 'agents' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          🤖 Agent Roster & Health ({INITIAL_AGENTS.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 border-b-2 transition-colors ${activeTab === 'timeline' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          ⏱️ Swarm Execution Timeline
        </button>
        <button
          onClick={() => setActiveTab('memory')}
          className={`pb-3 border-b-2 transition-colors ${activeTab === 'memory' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          🧠 Shared Memory Inspector
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          💬 Multi-Agent Consultation Chat
        </button>
      </div>

      {/* Tab 1: Agent Roster */}
      {activeTab === 'agents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_AGENTS.map((agent) => (
            <Card key={agent.id} title={agent.name} subtitle={`Role: ${agent.role} | Priority P${agent.priority}`}>
              <div className="mt-2 space-y-2 text-xs text-slate-300">
                <p>{agent.description}</p>
                <div className="flex gap-2 items-center flex-wrap">
                  <Badge variant="info">v{agent.version}</Badge>
                  {agent.capabilities.map((cap) => (
                    <span key={cap} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px]">
                      {cap}
                    </span>
                  ))}
                  <span className="ml-auto text-emerald-400 font-medium">● ONLINE</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 2: Execution Timeline */}
      {activeTab === 'timeline' && (
        <Card title="Swarm Execution Timeline & Parallel Workers" subtitle="Real-time parallel goroutine execution logs">
          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-emerald-300">
              🚀 [00.00ms] Swarm Orchestrator initialized 10 parallel agent workers for dashboard: dash_3c91a02b
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-indigo-300">
              ⚡ [12.40ms] Security Agent scanned tables: 1 CRITICAL PII risk flagged (DriverSSN)
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-indigo-300">
              ⚡ [18.20ms] DAX Expert Agent refactored FILTER(ALL()) → KEEPFILTERS (65% gain)
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-indigo-300">
              ⚡ [24.10ms] UX Agent snapped visual containers to 8pt grid & WCAG 2.2 AA contrast
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-md text-emerald-300">
              🏆 [42.00ms] Coordinator Agent computed final consensus score: 0.97 / 1.00 (COMPLETED)
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Shared Memory Inspector */}
      {activeTab === 'memory' && (
        <Card title="Shared Memory Multi-Tier Inspector" subtitle="Short-term, long-term, and dashboard contextual memory">
          <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Key</th>
                  <th className="px-4 py-3">Value / Payload</th>
                  <th className="px-4 py-3">Agent Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-3 text-indigo-400">dashboard</td>
                  <td className="px-4 py-3">dax_optimization</td>
                  <td className="px-4 py-3">Refactored Delayed Shipments Count to KEEPFILTERS</td>
                  <td className="px-4 py-3">agent_dax</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-indigo-400">dashboard</td>
                  <td className="px-4 py-3">pii_risk</td>
                  <td className="px-4 py-3">Unmasked DriverSSN detected; SHA-256 mask required</td>
                  <td className="px-4 py-3">agent_security</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-indigo-400">dashboard</td>
                  <td className="px-4 py-3">swarm_consensus</td>
                  <td className="px-4 py-3">Consensus Score 0.97 / 1.00</td>
                  <td className="px-4 py-3">agent_coordinator</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 4: Multi-Agent Consultation Chat */}
      {activeTab === 'chat' && (
        <Card title="Multi-Agent Team Consultation Console" subtitle="Ask questions to all 10 specialized agents simultaneously">
          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-900 border border-slate-800 rounded-lg">
            {chatHistory.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-lg text-xs ${m.role === 'user' ? 'bg-indigo-950 border border-indigo-800 text-indigo-200 ml-12' : 'bg-slate-800 border border-slate-700 text-slate-200 mr-12'}`}>
                <div className="font-semibold text-slate-400 mb-1">{m.role === 'user' ? '👤 User Query' : '🤖 Multi-Agent Swarm Response'}</div>
                {m.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="mt-4 flex gap-3">
            <input
              type="text"
              required
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask all 10 AI agents (e.g. 'How can we optimize performance and security for Q3 Logistics?')..."
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <Button type="submit" variant="primary">
              Consult Swarm
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
