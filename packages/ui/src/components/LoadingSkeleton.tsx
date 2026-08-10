import React from 'react';

export function LoadingSkeleton({ className = 'h-6 w-full' }: { className?: string }) {
  return (
    <div className={`bg-slate-800/80 animate-pulse rounded-lg ${className}`} />
  );
}
