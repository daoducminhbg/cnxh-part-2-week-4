'use client';

import React from 'react';

export const BackgroundTextures: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Granite Gradient & Guilloché Wave Matrix */}
      <div className="absolute inset-0 granite-noise opacity-95" />
      <div className="absolute inset-0 guilloche-pattern opacity-80" />

      {/* 2. Top-center Ambient Crimson Light */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-socialist-crimson/25 via-socialist-darkred/10 to-transparent rounded-full blur-[100px]" />

      {/* 3. Emblem Gold Radial Core */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial-emblem blur-[90px] opacity-70" />

      {/* 4. Bottom Corner Highlights */}
      <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] bg-socialist-deep/40 rounded-full blur-[90px]" />
      <div className="absolute -bottom-24 -right-24 w-[450px] h-[450px] bg-emblem-dark/20 rounded-full blur-[90px]" />

      {/* 5. Dong Son Bronze Drum & Star Geometric Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] opacity-[0.045] pointer-events-none">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-[spin_180s_linear_infinite]">
          {/* Outer Ring Concentric Circles */}
          <circle cx="250" cy="250" r="240" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="250" cy="250" r="225" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="250" cy="250" r="210" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="250" cy="250" r="185" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="150" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="8 6" />
          <circle cx="250" cy="250" r="100" stroke="#F59E0B" strokeWidth="2" />
          <circle cx="250" cy="250" r="50" stroke="#F59E0B" strokeWidth="1.5" />

          {/* 14-Pointed Solar Star (Dong Son Sun) */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14;
            return (
              <g key={i} transform={`rotate(${angle} 250 250)`}>
                <polygon
                  points="250,150 242,240 258,240"
                  fill="#F59E0B"
                  opacity="0.9"
                />
                <circle cx="250" cy="180" r="3" fill="#F59E0B" />
                <line x1="250" y1="185" x2="250" y2="215" stroke="#F59E0B" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Stylized Lac Bird / Crane Geometrics */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 360) / 8 + 15;
            return (
              <g key={`bird-${i}`} transform={`rotate(${angle} 250 250)`}>
                <path
                  d="M250,75 Q260,85 270,78 Q255,100 245,95 Z"
                  fill="#F59E0B"
                  opacity="0.75"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 6. Subtle Vignette Border Framing */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(7,10,16,0.95)]" />
    </div>
  );
};
