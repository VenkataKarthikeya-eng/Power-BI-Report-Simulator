'use client';

import React from 'react';
import { PageAST } from '@dcaps/types';
import { VisualChart } from './VisualChart';
import { WatermarkOverlay } from './WatermarkOverlay';

interface CanvasRendererProps {
  page: PageAST;
  activeFilter?: string;
  onCrossFilter: (visualId: string, value: string) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({ page, activeFilter, onCrossFilter }) => {
  return (
    <div
      className="relative mx-auto bg-slate-950 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden p-6 select-none"
      style={{
        width: '100%',
        maxWidth: `${page.width || 1280}px`,
        minHeight: `${page.height || 720}px`,
      }}
    >
      <WatermarkOverlay />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[660px]">
        {page.visuals.map((visual, idx) => (
          <div
            key={visual.id || idx}
            className={`relative ${
              visual.type === 'kpiCard' || visual.type === 'card'
                ? 'md:col-span-4 h-36'
                : visual.type === 'barChart' || visual.type === 'lineChart'
                ? 'md:col-span-6 h-80'
                : 'md:col-span-12 h-96'
            }`}
          >
            <VisualChart visual={visual} activeFilter={activeFilter} onCrossFilter={onCrossFilter} />
          </div>
        ))}
      </div>
    </div>
  );
};
