'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, Users, Sparkles, Timer, CheckCircle2, X, Square, Play, Award } from 'lucide-react';
import { Scenario, OptionId, DelegateVoterState } from '@/lib/types';

interface VoterAssistanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  delegateVoterState: DelegateVoterState;
  onStartTimer?: (seconds: number) => void;
  onStopTimer?: () => void;
  onApplyRecommendation?: (opt: OptionId) => void;
  isAdmin?: boolean;
}

export const VoterAssistanceModal: React.FC<VoterAssistanceModalProps> = ({
  isOpen,
  onClose,
  scenario,
  delegateVoterState,
  onStartTimer,
  onStopTimer,
  onApplyRecommendation,
  isAdmin = false,
}) => {
  if (!isOpen) return null;

  const speakerName = delegateVoterState.speakerName || 'Đại diện Cử tri được chỉ định';
  const remainingTime = delegateVoterState.remainingTime;
  const isTimerRunning = delegateVoterState.timerRunning;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-granite-950/90 backdrop-blur-2xl">
        {/* Ambient Halo behind modal */}
        <div className="absolute w-[650px] h-[650px] bg-gradient-to-r from-emblem-gold/25 via-socialist-crimson/20 to-emblem-gold/25 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl rounded-3xl glass-parliament-gold p-6 md:p-8 shadow-gold-glow-lg border-2 border-emblem-gold/60"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-granite-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-granite-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3.5 mb-6 border-b border-emblem-gold/30 pb-4">
            <div className="relative p-3.5 rounded-2xl bg-gradient-to-br from-socialist-crimson to-granite-950 border border-emblem-gold shadow-gold-glow">
              <Mic className="w-6 h-6 text-emblem-gold animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-emblem-light absolute -top-1 -right-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-socialist-bright">
                  DÂN CHỦ ĐẠI DIỆN • THỈNH VẤN CỬ TRI
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-gray-100">
                Ủy Quyền 01 Cử Tri Phát Biểu Ý Kiến
              </h3>
            </div>
          </div>

          {/* Speaker Presentation Podium Card */}
          <div className="p-5 rounded-2xl bg-granite-900/95 border border-emblem-gold/40 shadow-inner mb-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-socialist-crimson/30 border border-socialist-crimson/50 text-xs text-amber-200 font-mono font-semibold">
              <Users className="w-3.5 h-3.5 text-emblem-gold" />
              <span>CỬ TRI ĐƯỢC CHỦ TỌA CHỈ ĐỊNH</span>
            </div>

            <div>
              <h4 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-emblem-light to-amber-300">
                {speakerName}
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Đang trực tiếp đứng lên trước hội trường để phát biểu, phân tích lý lẽ và đưa ra lời khuyên cho Đoàn Đại biểu.
              </p>
            </div>

            {/* Speaking Timer Indicator */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-granite-950 border border-emblem-gold/50 shadow-gold-glow">
              <Timer className="w-5 h-5 text-emblem-gold animate-spin" style={{ animationDuration: '6s' }} />
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-3xl font-black text-amber-200">
                  {remainingTime}
                </span>
                <span className="text-xs text-gray-400 uppercase">giây phát biểu</span>
              </div>
            </div>

            {/* Timer Controls (if admin or presenter) */}
            {isAdmin && (
              <div className="flex items-center justify-center gap-2 pt-1">
                {!isTimerRunning ? (
                  <button
                    onClick={() => onStartTimer?.(60)}
                    className="px-3.5 py-1.5 rounded-lg bg-emblem-gold text-granite-950 text-xs font-bold uppercase tracking-wider hover:bg-emblem-light flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Bắt đầu đếm (60s)</span>
                  </button>
                ) : (
                  <button
                    onClick={onStopTimer}
                    className="px-3.5 py-1.5 rounded-lg bg-socialist-crimson text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Dừng đếm giờ</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Option Recommendation Recorder */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-mono text-gray-300 block uppercase font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emblem-gold" />
              Khuyến nghị của Cử tri sau khi phát biểu:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onApplyRecommendation?.(opt.id)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    delegateVoterState.recommendedOption === opt.id
                      ? 'bg-emblem-gold/25 border-emblem-gold shadow-gold-glow'
                      : 'bg-granite-900/80 border-gray-800 hover:border-emblem-gold/40'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emblem-gold text-granite-950 font-black text-sm flex items-center justify-center flex-shrink-0">
                    {opt.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-amber-200 block">
                      {opt.label}
                    </span>
                    <p className="text-[11px] text-gray-300 line-clamp-2 mt-0.5">
                      {opt.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <span className="text-[11px] font-mono text-gray-400">
              Đại biểu lắng nghe và tự quyết định chấp thuận hay không
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-granite-800 border border-gray-700 text-gray-200 text-xs font-bold hover:bg-granite-700 transition-colors"
            >
              Hoàn tất phát biểu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
