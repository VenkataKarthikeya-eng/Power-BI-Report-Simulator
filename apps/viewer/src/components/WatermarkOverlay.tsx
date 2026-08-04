'use client';

import React from 'react';

interface WatermarkOverlayProps {
  userName?: string;
  email?: string;
  ipAddress?: string;
}

export const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  userName = 'Alex Rivera',
  email = 'alex.rivera@enterprise.com',
  ipAddress = '192.0.2.45',
}) => {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden flex items-center justify-center select-none opacity-[0.07]">
      <div className="transform -rotate-25 text-center font-mono font-bold text-slate-100 text-lg space-y-1">
        <div>DASHBOARD CAPSULE AI — SECURE ENCRYPTED WATERMARK</div>
        <div>CONFIDENTIAL • FOR AUTHORIZED VIEWING ONLY</div>
        <div>
          USER: {userName} ({email})
        </div>
        <div>
          IP: {ipAddress} • TIME: {timestamp} UTC
        </div>
      </div>
    </div>
  );
};
