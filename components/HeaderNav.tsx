'use client';

import React, { useState, useEffect } from 'react';
import { Scale, Users, Volume2, VolumeX, ShieldCheck, Sparkles } from 'lucide-react';
import { soundManager } from '@/lib/audio';

interface HeaderNavProps {
  currentScenarioCode?: string;
  delegateName?: string;
  totalVoters?: number;
  referendumActive?: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScenarioCode = 'HỒ SƠ SỐ 01',
  delegateName = 'Đoàn Chủ Tịch Khóa 4',
  totalVoters = 0,
  referendumActive = false,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundManager.setMuted(nextMute);
  };

  return (
    <header className="relative z-20 w-full px-6 py-3.5 border-b border-emblem-gold/25 bg-granite-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: State Seal & Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-socialist-crimson to-socialist-deep border-2 border-emblem-gold shadow-gold-glow">
            <Scale className="w-5 h-5 text-emblem-gold" />
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emblem-light flex items-center justify-center">
              <Sparkles className="w-2 h-2 text-granite-950" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-socialist-crimson/60 text-emblem-pale border border-emblem-gold/30 rounded">
                KỲ HỌP NGHỊ TRƯỜNG
              </span>
              <span className="text-[11px] text-gray-400 font-mono tracking-wider">
                NHIỆM VỤ 4 • CNXHKH
              </span>
            </div>
            <h1 className="text-base md:text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-emblem-light to-amber-300">
              XỬ LÝ HỒ SƠ & TRƯNG CẦU Ý DÂN
            </h1>
          </div>
        </div>

        {/* Center: Live Delegate & Scenario Badge */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-granite-900/90 border border-emblem-gold/30 shadow-inner">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emblem-gold" />
            <span className="text-xs text-gray-300">
              Đại biểu điều hành: <strong className="text-emblem-gold font-semibold">{delegateName}</strong>
            </span>
          </div>
          <span className="text-gray-600">|</span>
          <span className="text-xs font-mono font-bold text-socialist-bright">
            {currentScenarioCode}
          </span>
        </div>

        {/* Right: Live Status, Time & Sound Toggle */}
        <div className="flex items-center gap-3">
          {/* Referendum / Voters Counter */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-granite-900/90 border border-gray-800">
            <Users className="w-3.5 h-3.5 text-emblem-gold" />
            <span className="text-xs font-mono text-gray-300 font-medium">
              {totalVoters} <span className="text-[10px] text-gray-500 uppercase">Cử tri</span>
            </span>
            {referendumActive && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-socialist-bright opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-socialist-crimson"></span>
              </span>
            )}
          </div>

          {/* Clock */}
          <div className="hidden sm:block px-3 py-1 rounded-md bg-granite-900/90 border border-gray-800 text-xs font-mono text-amber-200/90">
            {timeStr || '--:--:--'}
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            aria-label="Bật/Tắt âm thanh nghị trường"
            className="p-2 rounded-md bg-granite-900/90 hover:bg-granite-800 border border-emblem-gold/25 text-emblem-gold hover:text-amber-300 transition-colors shadow-sm"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
