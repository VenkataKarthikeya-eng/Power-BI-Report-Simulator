'use client';

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dcaps/ui';

interface PresenceUser {
  userId: string;
  userName: string;
  avatarUrl: string;
  role: string;
  pageId: string;
  cursorX: number;
  cursorY: number;
  status: 'ONLINE' | 'IDLE' | 'PRESENTING';
}

interface CommentItem {
  id: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: string;
  isResolved: boolean;
}

const INITIAL_USERS: PresenceUser[] = [
  {
    userId: 'usr_demo_10921',
    userName: 'Alex Rivera (Owner)',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'ORG_ADMIN',
    pageId: 'Section_Q3_Overview',
    cursorX: 180,
    cursorY: 140,
    status: 'PRESENTING',
  },
  {
    userId: 'usr_demo_10922',
    userName: 'Priya Sharma',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    role: 'BUSINESS_ANALYST',
    pageId: 'Section_Q3_Overview',
    cursorX: 520,
    cursorY: 280,
    status: 'ONLINE',
  },
];

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'comm_101',
    userName: 'Alex Rivera',
    userRole: 'ORG_ADMIN',
    content: '@Priya Check the DHL Express transit delay spike in week 32. DAX Agent refactored Delayed Shipments measure.',
    timestamp: '10 mins ago',
    isResolved: false,
  },
  {
    id: 'comm_102',
    userName: 'Priya Sharma',
    userRole: 'BUSINESS_ANALYST',
    content: 'Reviewing regional routes now. FedEx Freight remains stable at 99.2% on-time delivery.',
    timestamp: '5 mins ago',
    isResolved: false,
  },
];

export default function RealtimeWorkspacePage() {
  const [users] = useState<PresenceUser[]>(INITIAL_USERS);
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [isPresenting, setIsPresenting] = useState(true);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replayProgress, setReplayProgress] = useState(35);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const item: CommentItem = {
      id: `comm_${Date.now()}`,
      userName: 'Alex Rivera',
      userRole: 'ORG_ADMIN',
      content: newComment,
      timestamp: 'Just now',
      isResolved: false,
    };
    setComments((prev) => [...prev, item]);
    setNewComment('');
  };

  const toggleResolve = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isResolved: !c.isResolved } : c))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Real-time Workspace Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Real-Time Live Collaboration & Replay</h1>
            <Badge variant="success">● WebSocket Connected</Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">Simultaneous multi-user dashboard filtering, live cursors, presenter mode, and session replay timeline.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={isPresenting ? 'primary' : 'outline'} onClick={() => setIsPresenting(!isPresenting)}>
            {isPresenting ? '📺 Presenter Mode: ON' : '📺 Presenter Mode: OFF'}
          </Button>
        </div>
      </div>

      {/* Live Presence Bar */}
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase text-slate-400">Live Active Collaborators ({users.length}):</span>
            <div className="flex items-center -space-x-2">
              {users.map((u) => (
                <div key={u.userId} className="relative group">
                  <img
                    src={u.avatarUrl}
                    alt={u.userName}
                    className="w-9 h-9 rounded-full border-2 border-slate-900 bg-indigo-950 p-0.5"
                  />
                  <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${u.status === 'PRESENTING' ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Current Page: <strong className="text-white">Q3 Overview</strong></span>
            <span className="text-slate-400">Active Filters: <strong className="text-indigo-400">DHL Express (Regional)</strong></span>
            <span className="text-slate-400">Broadcasting Latency: <strong className="text-emerald-400">12ms</strong></span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Canvas & Cursor Overlay */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Live Interactive Canvas & Presenter Overlay" subtitle={isPresenting ? '⭐ Presenting to 2 live collaborators' : 'Independent view mode'}>
            <div className="relative mt-4 h-96 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden p-6">
              {/* Visual Containers Mock Mockup */}
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-300">Freight Margin KPI</div>
                  <div className="text-2xl font-extrabold text-indigo-400">$1,482,910</div>
                  <div className="text-[10px] text-emerald-400">↑ +14.2% vs Q2 target</div>
                </div>
                <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-lg flex flex-col justify-between">
                  <div className="text-xs font-semibold text-slate-300">DHL Transit Delay Spike</div>
                  <div className="text-2xl font-extrabold text-rose-400">54.1 Hours</div>
                  <div className="text-[10px] text-rose-300">⚠️ Exceeds 48h SLA limit</div>
                </div>
              </div>

              {/* Simulated Live User Cursors */}
              <div
                className="absolute transition-all duration-300 pointer-events-none flex items-center gap-1 text-xs"
                style={{ top: `${users[0].cursorY}px`, left: `${users[0].cursorX}px` }}
              >
                <span className="text-indigo-400 text-lg">↖</span>
                <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-medium shadow-md">
                  Alex Rivera (Presenting)
                </span>
              </div>

              <div
                className="absolute transition-all duration-300 pointer-events-none flex items-center gap-1 text-xs"
                style={{ top: `${users[1].cursorY}px`, left: `${users[1].cursorX}px` }}
              >
                <span className="text-emerald-400 text-lg">↖</span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-medium shadow-md">
                  Priya Sharma
                </span>
              </div>
            </div>
          </Card>

          {/* Session Replay Player Controls */}
          <Card title="Session Replay & Event Timeline" subtitle="Play back collaboration history frame-by-frame">
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setIsPlayingReplay(!isPlayingReplay)}>
                  {isPlayingReplay ? '⏸️ Pause Replay' : '▶️ Play Replay'}
                </Button>
                <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative">
                  <div className="bg-indigo-500 h-full transition-all" style={{ width: `${replayProgress}%` }}></div>
                </div>
                <span className="text-xs font-mono text-slate-400">00:42 / 02:00</span>
              </div>

              <div className="flex gap-2 text-xs font-mono">
                <button onClick={() => setReplayProgress(15)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  📍 [00:18] Filter: DHL Express
                </button>
                <button onClick={() => setReplayProgress(50)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  📍 [01:00] Bookmark: Q3 Executive
                </button>
                <button onClick={() => setReplayProgress(85)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                  📍 [01:42] AI Swarm Triggered
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Threaded Comments & Mentions */}
        <div className="space-y-6">
          <Card title="Threaded Comments & Mentions" subtitle="Live discussion and resolution workflow">
            <div className="mt-4 space-y-4 max-h-80 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className={`p-3 rounded-lg border text-xs ${c.isResolved ? 'bg-slate-900/50 border-slate-800/50 text-slate-500' : 'bg-slate-800/80 border-slate-700 text-slate-200'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-indigo-300">{c.userName}</span>
                    <span className="text-[10px] text-slate-400">{c.timestamp}</span>
                  </div>
                  <p className="mb-2">{c.content}</p>
                  <button onClick={() => toggleResolve(c.id)} className="text-[10px] text-slate-400 hover:text-emerald-400 font-medium">
                    {c.isResolved ? '↩️ Reopen Thread' : '✓ Mark Resolved'}
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostComment} className="mt-4 space-y-2">
              <textarea
                rows={2}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a live comment or mention (@user)..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <Button type="submit" variant="primary" className="w-full">
                Post Live Comment
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
