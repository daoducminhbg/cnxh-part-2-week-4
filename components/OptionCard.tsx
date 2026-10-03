'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { OptionItem, OptionId } from '@/lib/types';

interface OptionCardProps {
  option: OptionItem;
  isSelected: boolean;
  isAnswerRevealed: boolean;
  isCorrect: boolean;
  isClickable?: boolean;
  onSelect?: (id: OptionId) => void;
  referendumPercent?: number | null;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  isAnswerRevealed,
  isCorrect,
  isClickable = false,
  onSelect,
  referendumPercent = null,
}) => {
  // Strip any accidental hint from label
  const cleanLabel = option.label.replace(/\s*\(CHÍNH XÁC\)/gi, '').trim();

  // Determine card style based on state
  let cardClass = 'glass-parliament hover:border-emblem-gold/50';
  let badgeClass = 'bg-granite-900 border-emblem-gold/40 text-emblem-gold';

  if (isAnswerRevealed) {
    if (isCorrect) {
      cardClass = 'glass-parliament-emerald shadow-emerald-glow';
      badgeClass = 'bg-republic-emerald border-emerald-300 text-white shadow-emerald-glow';
    } else if (isSelected && !isCorrect) {
      cardClass = 'glass-parliament-crimson shadow-crimson-glow';
      badgeClass = 'bg-socialist-crimson border-red-300 text-white';
    } else {
      cardClass = 'opacity-50 glass-parliament border-gray-800';
    }
  } else if (isSelected) {
    cardClass = 'glass-parliament-gold shadow-gold-glow animate-border-glow';
    badgeClass = 'bg-emblem-gold border-amber-200 text-granite-950 font-black shadow-gold-glow';
  }

  return (
    <motion.div
      whileHover={isClickable && !isAnswerRevealed ? { scale: 1.015, y: -2 } : {}}
      whileTap={isClickable && !isAnswerRevealed ? { scale: 0.985 } : {}}
      onClick={() => isClickable && !isAnswerRevealed && onSelect?.(option.id)}
      className={`relative rounded-2xl p-5 md:p-6 transition-all duration-300 cursor-pointer ${cardClass}`}
    >
      {/* Top Banner if Selected or Correct */}
      {isSelected && !isAnswerRevealed && (
        <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-emblem-gold text-granite-950 text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-gold-glow">
          <Sparkles className="w-3 h-3 text-granite-950" />
          Phương án được Đại biểu đề xuất
        </div>
      )}

      {isAnswerRevealed && isCorrect && (
        <div className="absolute -top-3 right-5 px-3.5 py-0.5 rounded-full bg-republic-emerald text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-emerald-glow">
          <CheckCircle2 className="w-3.5 h-3.5" />
          QUYẾT NGHỊ CHÍNH XÁC
        </div>
      )}

      {isAnswerRevealed && isSelected && !isCorrect && (
        <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-socialist-crimson text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-crimson-glow">
          <AlertCircle className="w-3.5 h-3.5" />
          CHƯA PHÙ HỢP NGUYÊN TẮC
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Letter Badge (A, B) */}
        <div
          className={`flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-300 ${badgeClass}`}
        >
          {option.id}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold tracking-widest text-emblem-gold/90 uppercase">
              {cleanLabel}
            </span>

            {/* Referendum Percentage Tag if available */}
            {referendumPercent !== null && (
              <span className="px-2.5 py-0.5 rounded-md bg-granite-900 border border-emblem-gold/40 text-xs font-mono font-bold text-amber-300">
                {referendumPercent}% Cử tri tán thành
              </span>
            )}
          </div>

          <p className="text-sm md:text-base font-medium text-gray-100 leading-relaxed">
            {option.text}
          </p>

          {/* Subtext Rationale ONLY shown after answer is revealed */}
          {isAnswerRevealed && option.subtext && (
            <p className="mt-2.5 text-xs text-amber-200/90 border-t border-gray-800/80 pt-2 italic">
              {option.subtext}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
