'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users } from 'lucide-react';
import { VoteTally, OptionId } from '@/lib/types';

interface ResultBarChartProps {
  tally: VoteTally;
  options: { id: OptionId; label: string; text: string }[];
}

export const ResultBarChart: React.FC<ResultBarChartProps> = ({ tally, options }) => {
  const [animatedPercentages, setAnimatedPercentages] = useState<Record<OptionId, number>>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  });

  // Ticker animation from 0 to real percent
  useEffect(() => {
    const duration = 1200; // ms
    const steps = 30;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const factor = Math.min(1, step / steps);
      // easeOutQuad
      const eased = factor * (2 - factor);

      setAnimatedPercentages({
        A: Math.round((tally.percentages.A || 0) * eased),
        B: Math.round((tally.percentages.B || 0) * eased),
        C: Math.round((tally.percentages.C || 0) * eased),
        D: Math.round((tally.percentages.D || 0) * eased),
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedPercentages({ ...tally.percentages });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [tally]);

  // Determine highest voted option
  const highestOptionId = Object.entries(tally.counts).reduce(
    (max, [opt, count]) => (count > (tally.counts[max as OptionId] || 0) ? opt : max),
    'A'
  ) as OptionId;

  return (
    <div className="w-full space-y-5">
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-b border-gray-800 pb-2">
        <span className="flex items-center gap-1.5 text-emblem-gold font-semibold uppercase">
          <Users className="w-3.5 h-3.5" />
          Tổng số cử tri tham gia: {tally.totalVotes}
        </span>
        <span className="text-gray-400">
          Cơ chế biểu quyết Dân chủ trực tiếp
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((opt) => {
          const percent = animatedPercentages[opt.id] || 0;
          const votes = tally.counts[opt.id] || 0;
          const isHighest = opt.id === highestOptionId && tally.totalVotes > 0;
          const cleanLabel = opt.label.replace(/\s*\(CHÍNH XÁC\)/gi, '').trim();

          return (
            <div
              key={opt.id}
              className={`p-4 rounded-xl border transition-all duration-500 ${
                isHighest
                  ? 'bg-granite-900/95 border-emblem-gold/60 shadow-gold-glow'
                  : 'bg-granite-900/70 border-gray-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border ${
                      isHighest
                        ? 'bg-emblem-gold border-amber-300 text-granite-950 font-black'
                        : 'bg-granite-800 border-gray-700 text-gray-300'
                    }`}
                  >
                    {opt.id}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-200">
                      {cleanLabel}
                    </span>
                    {isHighest && (
                      <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-socialist-crimson text-emblem-pale border border-emblem-gold/40">
                        <Award className="w-3 h-3 text-emblem-light" />
                        Đa số tán thành
                      </span>
                    )}
                  </div>
                </div>

                {/* Percentage Ticker Display */}
                <div className="text-right">
                  <span className="text-2xl font-black font-mono tracking-tight text-amber-200">
                    {percent}%
                  </span>
                  <span className="block text-[11px] font-mono text-gray-400">
                    ({votes} phiếu)
                  </span>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="relative h-4 rounded-full bg-granite-950 border border-gray-800 overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full transition-all duration-300 relative ${
                    isHighest
                      ? 'bg-gradient-to-r from-socialist-crimson via-emblem-amber to-emblem-light shadow-gold-glow'
                      : 'bg-gradient-to-r from-gray-700 to-gray-500'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
