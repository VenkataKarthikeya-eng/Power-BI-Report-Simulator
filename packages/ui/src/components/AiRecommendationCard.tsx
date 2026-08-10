import React from 'react';

export interface AiRecommendationCardProps {
  title: string;
  description: string;
  impact: string;
  actionLabel: string;
  onAction: () => void;
}

export function AiRecommendationCard({
  title,
  description,
  impact,
  actionLabel,
  onAction,
}: AiRecommendationCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
          🤖
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">{title}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {impact}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <button
        onClick={onAction}
        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/20 shrink-0 transition-all"
      >
        {actionLabel} →
      </button>
    </div>
  );
}
