'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BookmarkCheck, Scale, Award } from 'lucide-react';
import { Scenario } from '@/lib/types';

interface ScenarioCardProps {
  scenario: Scenario;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative rounded-2xl glass-parliament p-6 md:p-8 overflow-hidden shadow-2xl"
    >
      {/* Top Gold Corner Accent Ornament */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 rotate-45 w-24 h-24 bg-gradient-to-br from-emblem-gold/30 to-transparent border border-emblem-gold/40" />
      </div>

      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-socialist-crimson/25 border border-socialist-crimson/40 text-emblem-light">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-emblem-gold uppercase">
              {scenario.code}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-100 tracking-tight">
              {scenario.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-socialist-deep/50 border border-socialist-crimson/30 text-xs text-amber-200/90 font-medium">
          <BookmarkCheck className="w-3.5 h-3.5 text-emblem-gold" />
          <span>Vấn đề lý luận trọng tâm</span>
        </div>
      </div>

      {/* Case Context Box */}
      <div className="mb-6 p-4 md:p-5 rounded-xl bg-granite-900/80 border border-gray-800/80 text-gray-300 text-sm md:text-base leading-relaxed relative">
        <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-emblem-gold" />
          Bối cảnh thực tiễn nghị trường:
        </div>
        <p className="italic text-gray-200">
          &ldquo;{scenario.caseBackground}&rdquo;
        </p>
      </div>

      {/* Highlighted Question Statement */}
      <div className="relative p-5 rounded-xl bg-gradient-to-r from-socialist-crimson/20 via-granite-900 to-socialist-crimson/10 border-l-4 border-emblem-gold shadow-md">
        <div className="text-xs font-mono font-bold tracking-wider text-emblem-light uppercase mb-1 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-emblem-gold" />
          Nhiệm vụ của Đại biểu Hội đồng:
        </div>
        <p className="text-base md:text-lg font-semibold text-amber-100 leading-snug">
          {scenario.question}
        </p>
      </div>

      {/* Citation footer */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
        <span className="text-gray-400">
          Cơ sở pháp lý & lý luận: <strong className="text-gray-300 font-normal">{scenario.constitutionalCitation}</strong>
        </span>
      </div>
    </motion.div>
  );
};
