'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Timer, Users, Scale, Vote, CheckCircle2, ArrowRight } from 'lucide-react';
import { ReferendumStatus, VoteTally, OptionItem, OptionId } from '@/lib/types';
import { ResultBarChart } from './ResultBarChart';

interface ReferendumOverlayProps {
  status: ReferendumStatus;
  duration: number;
  remainingTime: number;
  tally: VoteTally;
  options: OptionItem[];
  onApplyHighestVote?: (winningOption: OptionId) => void;
  onClose?: () => void;
  isAdmin?: boolean;
}

export const ReferendumOverlay: React.FC<ReferendumOverlayProps> = ({
  status,
  duration,
  remainingTime,
  tally,
  options,
  onApplyHighestVote,
  onClose,
  isAdmin = false,
}) => {
  const [voteUrl, setVoteUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setVoteUrl(`${origin}/vote`);
    }
  }, []);

  if (status === 'idle') return null;

  // Determine winning option
  const winningOptionId = Object.entries(tally.counts).reduce(
    (max, [opt, count]) => (count > (tally.counts[max as OptionId] || 0) ? opt : max),
    'B'
  ) as OptionId;

  const timerPercent = duration > 0 ? (remainingTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8 bg-granite-950/90 backdrop-blur-2xl"
      >
        {/* Ambient Glow */}
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-r from-socialist-crimson/25 via-emblem-gold/20 to-socialist-crimson/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-4xl rounded-3xl glass-parliament p-6 md:p-10 border-2 border-emblem-gold/60 shadow-gold-glow-lg overflow-hidden flex flex-col gap-6">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emblem-gold/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-socialist-crimson/30 border border-socialist-crimson/50 text-emblem-gold">
                <Vote className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-socialist-bright uppercase">
                  QUYỀN LỰC THUỘC VỀ NHÂN DÂN
                </span>
                <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-emblem-light to-amber-300">
                  TRƯNG CẦU Ý DÂN TRỰC TIẾP
                </h2>
              </div>
            </div>

            {/* Countdown or Status Badge */}
            {status === 'voting' ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-granite-900 border border-socialist-crimson/60 shadow-crimson-glow">
                <Timer className="w-5 h-5 text-socialist-bright animate-pulse" />
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black font-mono text-socialist-bright">
                    {remainingTime}
                  </span>
                  <span className="text-xs font-mono text-gray-400">giây</span>
                </div>
              </div>
            ) : (
              <div className="px-4 py-1.5 rounded-full bg-republic-emerald/20 border border-republic-emerald text-xs font-mono font-bold text-republic-emerald uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                ĐÃ CHỐT BIỂU QUYẾT
              </div>
            )}
          </div>

          {/* Active Voting Stage (Big QR Code) */}
          {status === 'voting' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
              {/* QR Code Presentation Box */}
              <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-granite-900/90 border border-emblem-gold/40 shadow-inner relative">
                <div className="p-4 rounded-xl bg-white shadow-2xl border-4 border-emblem-gold">
                  <QRCodeSVG
                    value={voteUrl || 'http://localhost:3000/vote'}
                    size={240}
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs font-mono text-amber-200">
                  <QrCode className="w-4 h-4 text-emblem-gold" />
                  <span>Quét camera điện thoại để biểu quyết</span>
                </div>
                <div className="mt-1 text-[11px] font-mono text-gray-400 select-all">
                  {voteUrl}
                </div>
              </div>

              {/* Instructions and Live Voter Counter */}
              <div className="flex flex-col gap-5">
                <div className="p-5 rounded-2xl bg-granite-900/80 border border-gray-800">
                  <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-emblem-gold" />
                    Chỉ đạo biểu quyết từ Chủ tọa:
                  </h4>
                  <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                    60 Cử tri sinh viên quét mã QR trên màn hình chiếu để trực tiếp bày tỏ ý chí chính trị. Kết quả biểu quyết của cử tri mang tính quyết định định hướng nghị trường.
                  </p>
                </div>

                {/* Real-time Voter Counter */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-socialist-crimson/20 via-granite-900 to-granite-950 border border-emblem-gold/40 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-emblem-gold/15 border border-emblem-gold/40 flex items-center justify-center text-emblem-gold">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 font-mono block">
                        Số phiếu đã gửi vào hệ thống:
                      </span>
                      <span className="text-3xl font-black font-mono text-emblem-light">
                        {tally.totalVotes} <span className="text-sm font-normal text-gray-400">/ 60 cử tri</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Time progress bar */}
                <div className="w-full bg-granite-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-socialist-bright to-emblem-gold"
                    animate={{ width: `${timerPercent}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Closed / Revealed Stage (Results Animation) */}
          {(status === 'closed' || status === 'revealed') && (
            <div className="flex flex-col gap-6 py-2">
              <div className="p-4 rounded-xl bg-granite-900/80 border border-emblem-gold/40 text-center">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emblem-gold">
                  KẾT QUẢ Ý CHÍ TẬP THỂ
                </span>
                <h3 className="text-lg md:text-xl font-bold text-gray-100">
                  Bảng Tổng Hợp Biểu Quyết Cử Tri Toàn Trường
                </h3>
              </div>

              {/* Bar Chart Component */}
              <ResultBarChart tally={tally} options={options} />

              {/* Resolution Action */}
              <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-socialist-crimson/20 via-granite-900 to-emblem-gold/15 border border-emblem-gold/50 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-republic-emerald flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-200 uppercase tracking-wide block">
                      Nguyên tắc Hiến định CNXHKH:
                    </span>
                    <p className="text-xs text-gray-300">
                      Đại biểu phải tôn trọng ý chí đa số nhân dân: Xác nhận phương án <strong className="text-emblem-gold">{winningOptionId}</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {onApplyHighestVote && (
                    <button
                      onClick={() => onApplyHighestVote(winningOptionId)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emblem-gold to-emblem-amber text-granite-950 text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-2 transition-all"
                    >
                      <span>Tiếp thu & Chốt phương án {winningOptionId}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {onClose && (
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-granite-800 border border-gray-700 text-gray-300 text-xs font-semibold hover:bg-granite-700 transition-colors"
                    >
                      Đóng biểu quyết
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
