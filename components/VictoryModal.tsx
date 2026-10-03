'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertCircle, BookmarkCheck, ArrowRight, X } from 'lucide-react';
import { Scenario } from '@/lib/types';

interface VictoryModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  scenario: Scenario;
  selectedOptionId: string | null;
  onNextScenario?: () => void;
  onClose: () => void;
  isLastScenario: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  isCorrect,
  scenario,
  selectedOptionId,
  onNextScenario,
  onClose,
  isLastScenario,
}) => {
  useEffect(() => {
    if (isOpen && isCorrect) {
      // Fire patriotic gold and crimson confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#F59E0B', '#991B1B', '#FBBF24', '#DC2626', '#FEF3C7'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [isOpen, isCorrect]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-granite-950/85 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-2xl rounded-3xl p-6 md:p-8 border-2 shadow-2xl overflow-hidden ${
            isCorrect
              ? 'glass-parliament-emerald shadow-emerald-glow border-republic-emerald/60'
              : 'glass-parliament-crimson shadow-crimson-glow border-socialist-crimson/60'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-granite-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-gray-800">
            <div
              className={`p-3 rounded-2xl flex items-center justify-center text-white ${
                isCorrect ? 'bg-republic-emerald shadow-emerald-glow' : 'bg-socialist-crimson shadow-crimson-glow'
              }`}
            >
              {isCorrect ? <Award className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-emblem-gold">
                NGHỊ TRƯỜNG THÔNG QUA NGHỊ QUYẾT
              </span>
              <h3 className="text-xl md:text-2xl font-black text-gray-100">
                {isCorrect ? 'QUYẾT NGHỊ HOÀN TOÀN CHÍNH XÁC!' : 'QUYẾT NGHỊ CHƯA THỎA ĐÁNG'}
              </h3>
            </div>
          </div>

          {/* Doctrine Core Statement */}
          <div className="p-4 rounded-xl bg-granite-950/70 border border-emblem-gold/30 mb-5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emblem-gold font-bold block mb-1 flex items-center gap-1.5">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Chân lý cốt lõi của Chủ nghĩa Xã hội Khoa học:
            </span>
            <p className="text-sm md:text-base font-semibold text-amber-100 italic leading-snug">
              {scenario.doctrineQuote}
            </p>
          </div>

          {/* Academic Explanation */}
          <div className="p-4 rounded-xl bg-granite-900/80 border border-gray-800 text-gray-200 text-xs md:text-sm leading-relaxed mb-6">
            <h4 className="text-[11px] font-mono uppercase font-bold text-gray-400 mb-1">
              Phân tích học thuật chuyên sâu:
            </h4>
            <p>{scenario.academicExplanation}</p>
          </div>

          {/* Legal / Party Citation */}
          <div className="text-[11px] font-mono text-gray-400 mb-6">
            Căn cứ pháp lý: <strong className="text-amber-200">{scenario.constitutionalCitation}</strong>
          </div>

          {/* Navigation Action */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-granite-800 border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-granite-700 transition-colors"
            >
              Xem lại hồ sơ
            </button>

            {onNextScenario && (
              <button
                onClick={onNextScenario}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emblem-gold to-emblem-amber text-granite-950 text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2 transition-all"
              >
                <span>{isLastScenario ? 'Tổng kết kỳ họp' : 'Sang hồ sơ tiếp theo'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
