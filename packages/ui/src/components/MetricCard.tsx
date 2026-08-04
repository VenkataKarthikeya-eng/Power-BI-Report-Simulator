'use client';

import React from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
}) => {
  const changeColors = {
    positive: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    negative: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    neutral: 'text-slate-400 bg-slate-800/60 border-slate-700/60',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-5 shadow-lg hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {icon && <div className="text-slate-400 text-lg">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-white tracking-tight">{value}</div>
        {change && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
};
