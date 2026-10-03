'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Vote, Sparkles, Lock, Users } from 'lucide-react';
import { LifelinesConfig } from '@/lib/types';

interface LifelinePanelProps {
  lifelines: LifelinesConfig;
  onUseDelegateVoter: () => void;
  onUseReferendum: () => void;
  isAnswerRevealed: boolean;
  isAdmin?: boolean;
}

export const LifelinePanel: React.FC<LifelinePanelProps> = ({
  lifelines,
  onUseDelegateVoter,
  onUseReferendum,
  isAnswerRevealed,
  isAdmin = false,
}) => {
  const delegateAvailable = lifelines.delegateVoter.remaining > 0 && !isAnswerRevealed;
  const referendumAvailable = lifelines.referendum.remaining > 0 && !isAnswerRevealed;

  return (
    <div className="rounded-2xl glass-parliament p-5 flex flex-col gap-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emblem-gold" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-100">
            QUYỀN TRỢ GIÚP DÂN CHỦ
          </h3>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          Hiến định 2 cơ chế
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {/* Lifeline 1: Dân chủ đại diện (Ủy quyền cử tri - Chọn 1 bạn dưới lớp phát biểu) */}
        <motion.button
          whileHover={delegateAvailable ? { scale: 1.02, x: 2 } : {}}
          whileTap={delegateAvailable ? { scale: 0.98 } : {}}
          disabled={!delegateAvailable}
          onClick={onUseDelegateVoter}
          className={`relative p-4 rounded-xl text-left border transition-all duration-300 flex items-start gap-3.5 ${
            delegateAvailable
              ? 'bg-gradient-to-r from-granite-900 via-granite-800 to-granite-900 border-emblem-gold/40 hover:border-emblem-gold hover:shadow-gold-glow cursor-pointer'
              : 'bg-granite-950/60 border-gray-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-socialist-crimson/20 border border-socialist-crimson/40 text-emblem-light flex-shrink-0">
            <Mic className="w-5 h-5 text-emblem-gold" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-gray-100 uppercase tracking-wide">
                ỦY QUYỀN CỬ TRI
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-granite-950 border border-emblem-gold/30 text-emblem-gold">
                {lifelines.delegateVoter.remaining}/{lifelines.delegateVoter.max}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-tight">
              Phát huy <strong className="text-amber-200 font-semibold">Dân chủ đại diện</strong>: Chỉ định 01 cử tri đại diện dưới hội trường đứng dậy phát biểu, hiến kế trực tiếp cho Đoàn Đại biểu.
            </p>
          </div>

          {lifelines.delegateVoter.remaining === 0 && (
            <div className="absolute top-2 right-2 text-gray-500">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </motion.button>

        {/* Lifeline 2: Dân chủ trực tiếp (Trưng cầu ý dân - 60 sinh viên quét QR) */}
        <motion.button
          whileHover={referendumAvailable ? { scale: 1.02, x: 2 } : {}}
          whileTap={referendumAvailable ? { scale: 0.98 } : {}}
          disabled={!referendumAvailable}
          onClick={onUseReferendum}
          className={`relative p-4 rounded-xl text-left border transition-all duration-300 flex items-start gap-3.5 ${
            referendumAvailable
              ? 'bg-gradient-to-r from-granite-900 via-socialist-crimson/15 to-granite-900 border-socialist-crimson/50 hover:border-emblem-gold hover:shadow-gold-glow cursor-pointer'
              : 'bg-granite-950/60 border-gray-800 opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-emblem-gold/20 border border-emblem-gold/40 text-emblem-gold flex-shrink-0">
            <Vote className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-bold text-gray-100 uppercase tracking-wide">
                TRƯNG CẦU Ý DÂN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-granite-950 border border-socialist-crimson/50 text-socialist-bright">
                {lifelines.referendum.remaining}/{lifelines.referendum.max}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-tight">
              Kích hoạt <strong className="text-socialist-bright font-semibold">Dân chủ trực tiếp</strong>: Phát mã QR để toàn bộ cử tri trong hội trường biểu quyết thời gian thực.
            </p>
          </div>

          {lifelines.referendum.remaining === 0 && (
            <div className="absolute top-2 right-2 text-gray-500">
              <Lock className="w-3.5 h-3.5" />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
};
