'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, CheckCircle2, ShieldCheck, Scale, Timer, Lock, Sparkles, Award } from 'lucide-react';
import { getParliamentHub } from '@/lib/realtime';
import { ParliamentSessionState, OptionId } from '@/lib/types';
import { BackgroundTextures } from '@/components/BackgroundTextures';

export default function MobileVoterPage() {
  const [session, setSession] = useState<ParliamentSessionState | null>(null);
  const [voterId, setVoterId] = useState<string>('');
  const [myVote, setMyVote] = useState<OptionId | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or retrieve unique Voter ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedId = localStorage.getItem('cnxh_voter_id');
      if (!storedId) {
        storedId = 'cu-tri-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        localStorage.setItem('cnxh_voter_id', storedId);
      }
      setVoterId(storedId);
    }
  }, []);

  // Subscribe to real-time session
  useEffect(() => {
    const hub = getParliamentHub();
    const unsubscribe = hub.subscribe((updated) => {
      setSession({ ...updated });

      // Check if user already voted in this round
      if (voterId && updated.voterSessions && updated.voterSessions[voterId]) {
        setMyVote(updated.voterSessions[voterId]);
      } else if (updated.lifelines?.referendum?.status === 'idle') {
        // Reset vote for next round
        setMyVote(null);
      }

      // Haptic feedback when referendum opens
      if (updated.lifelines?.referendum?.status === 'voting') {
        if (typeof window !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([40, 60, 40]);
          } catch {
            // Ignore if blocked by browser
          }
        }
      }
    });

    return () => unsubscribe();
  }, [voterId]);

  const handleCastVote = async (optionId: OptionId) => {
    if (!voterId || myVote || isSubmitting) return;

    setIsSubmitting(true);
    // Haptic tap feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(60);
      } catch {
        // Ignore
      }
    }

    try {
      const hub = getParliamentHub();
      await hub.castVote(voterId, optionId);
      setMyVote(optionId);
    } catch {
      alert('Không thể gửi phiếu, vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granite-950 text-amber-200 font-mono text-sm">
        Đang kết nối vào hệ thống nghị trường...
      </div>
    );
  }

  const scenariosList = session.scenarios && session.scenarios.length > 0 ? session.scenarios : [];
  const currentScenario = scenariosList[session.scenarioIndex] || scenariosList[0];
  const referendumStatus = session.lifelines.referendum.status;
  const isVotingOpen = referendumStatus === 'voting';
  const remainingTime = session.lifelines.referendum.remainingTime;

  if (!currentScenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granite-950 text-amber-200 font-mono text-sm">
        Chưa có tình huống biểu quyết.
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-granite-950 text-gray-100 overflow-x-hidden p-4 select-none">
      <BackgroundTextures />

      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col justify-between py-2">
        {/* Top Header Card */}
        <div className="rounded-2xl glass-parliament p-4 border border-emblem-gold/30 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-socialist-crimson/80 border border-emblem-gold flex items-center justify-center text-emblem-gold shadow-gold-glow">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-emblem-gold uppercase block">
                  KỲ HỌP NGHỊ TRƯỜNG
                </span>
                <h1 className="text-sm font-bold text-gray-100">
                  Cổng Biểu Quyết Cử Tri
                </h1>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-md bg-granite-900 border border-gray-800 text-[11px] font-mono text-amber-200">
              {voterId || 'Đang kết nối...'}
            </div>
          </div>
        </div>

        {/* Central Dynamic Screen Body */}
        <div className="my-auto py-6">
          {/* STATE 1: Waiting for Presidium Command */}
          {!isVotingOpen && !myVote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl glass-parliament p-6 text-center border border-gray-800/80 shadow-xl space-y-4"
            >
              <div className="relative mx-auto w-16 h-16 rounded-full bg-granite-900 border-2 border-emblem-gold/40 flex items-center justify-center text-emblem-gold shadow-gold-glow">
                <Vote className="w-8 h-8 animate-pulse" />
                <Sparkles className="w-4 h-4 text-emblem-light absolute top-1 right-1" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-100 mb-1">
                  Kỳ Họp Đang Diễn Ra
                </h2>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Cổng biểu quyết đang ở chế độ chờ. Vui lòng hướng mắt lên màn chiếu sân khấu và chờ hiệu lệnh Trưng cầu ý dân từ Chủ tọa.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-800/80 flex items-center justify-center gap-2 text-[11px] font-mono text-socialist-bright">
                <span className="w-2 h-2 rounded-full bg-socialist-crimson animate-ping" />
                <span>Trạng thái: Trực tiếp sẵn sàng (Ready)</span>
              </div>
            </motion.div>
          )}

          {/* STATE 2: Active Referendum (Clean Voting Buttons without hints) */}
          {isVotingOpen && !myVote && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Question summary banner */}
              <div className="rounded-2xl glass-parliament p-4 border border-socialist-crimson/50 shadow-crimson-glow">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-socialist-bright flex items-center gap-1">
                    <Vote className="w-3.5 h-3.5" />
                    TRƯNG CẦU Ý DÂN ĐANG MỞ
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-granite-950 border border-socialist-crimson text-xs font-mono font-bold text-socialist-bright">
                    <Timer className="w-3 h-3 animate-pulse" />
                    <span>{remainingTime}s</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-amber-100 leading-snug">
                  {currentScenario.question}
                </h3>
              </div>

              {/* Big Touch Voting Buttons: STRICTLY NEUTRAL */}
              <div className="space-y-3.5">
                {currentScenario.options.map((opt) => {
                  const cleanLabel = opt.label.replace(/\s*\(CHÍNH XÁC\)/gi, '').trim();
                  return (
                    <motion.button
                      key={opt.id}
                      whileTap={{ scale: 0.97 }}
                      disabled={isSubmitting}
                      onClick={() => handleCastVote(opt.id)}
                      className="w-full text-left p-4 rounded-2xl glass-parliament-gold border-2 border-emblem-gold/50 hover:border-emblem-gold shadow-gold-glow flex items-start gap-3.5 cursor-pointer active:brightness-125 transition-all"
                    >
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-emblem-gold text-granite-950 font-black text-xl flex items-center justify-center shadow-gold-glow">
                        {opt.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-amber-200 block mb-1 uppercase font-mono">
                          {cleanLabel}
                        </span>
                        <p className="text-xs text-gray-200 leading-relaxed font-medium">
                          {opt.text}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STATE 3: Vote Cast Successfully */}
          {myVote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl glass-parliament-emerald p-6 text-center border-2 border-republic-emerald/60 shadow-emerald-glow space-y-4"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-republic-emerald/20 border-2 border-republic-emerald flex items-center justify-center text-republic-emerald shadow-emerald-glow">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-republic-emerald/30 text-white text-[10px] font-bold font-mono uppercase tracking-wider">
                  Ghi Nhận Thành Công
                </span>
                <h2 className="text-lg font-bold text-gray-100 mt-2 mb-1">
                  Ý Chí Của Bạn Đã Được Ghi Nhận
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Lá phiếu biểu quyết đã được đồng bộ hóa thời gian thực lên Màn chiếu Quốc hội.
                </p>
              </div>

              {/* Chosen option recap without any hints */}
              <div className="p-3.5 rounded-xl bg-granite-900/90 border border-gray-800 text-left flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emblem-gold text-granite-950 font-black flex items-center justify-center text-base">
                  {myVote}
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-mono">
                    Lựa chọn của bạn:
                  </span>
                  <span className="text-xs font-bold text-amber-100">
                    Phương án {myVote}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-gray-400">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                <span>Thiết bị đã khóa phiếu để chống trùng lặp</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-[10px] font-mono text-gray-500 py-2 border-t border-gray-900">
          Chủ nghĩa Xã hội Khoa học • Nền Dân chủ Xã hội Chủ nghĩa
        </div>
      </div>
    </main>
  );
}
