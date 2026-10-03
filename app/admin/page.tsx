'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  Vote,
  Users,
  Timer,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Play,
  Square,
  Sparkles,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Award,
  Settings,
  Mic,
  FileEdit,
} from 'lucide-react';
import { getParliamentHub } from '@/lib/realtime';
import { soundManager } from '@/lib/audio';
import { ParliamentSessionState, OptionId, SfxType, Scenario } from '@/lib/types';
import { BackgroundTextures } from '@/components/BackgroundTextures';
import { ScenarioEditorModal } from '@/components/ScenarioEditorModal';

export default function PresidiumAdminPage() {
  const [session, setSession] = useState<ParliamentSessionState | null>(null);
  const [timerPreset, setTimerPreset] = useState<number>(30);
  const [speakerInput, setSpeakerInput] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  useEffect(() => {
    const hub = getParliamentHub();
    const unsubscribe = hub.subscribe((updated) => {
      setSession({ ...updated });
    });

    return () => unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granite-950 text-amber-200 font-mono">
        Đang khởi động bảng điều khiển Chủ tọa...
      </div>
    );
  }

  const hub = getParliamentHub();
  const scenariosList = session.scenarios && session.scenarios.length > 0 ? session.scenarios : [];
  const currentScenario = scenariosList[session.scenarioIndex] || scenariosList[0];
  const referendumStatus = session.lifelines.referendum.status;
  const isVoting = referendumStatus === 'voting';
  const voterLifeline = session.lifelines.delegateVoter;

  // Scenario Navigation
  const handleSwitchScenario = (index: number) => {
    if (!scenariosList[index]) return;
    hub.broadcastState({
      scenarioIndex: index,
      currentScenarioId: scenariosList[index].id,
      selectedOptionId: null,
      isAnswerRevealed: false,
      isAnswerCorrect: null,
      lifelines: {
        delegateVoter: {
          remaining: 1,
          max: 1,
          isActive: false,
          speakerName: '',
          timerDuration: 60,
          remainingTime: 60,
          timerRunning: false,
          recommendedOption: null,
        },
        referendum: {
          remaining: 1,
          max: 1,
          isActive: false,
          status: 'idle',
          duration: 30,
          remainingTime: 30,
        },
      },
      voteTally: {
        totalVotes: 0,
        counts: { A: 0, B: 0, C: 0, D: 0 },
        percentages: { A: 0, B: 0, C: 0, D: 0 },
      },
      voterSessions: {},
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });
  };

  // Lifeline 1: Delegate Voter Speech Controls
  const handleTriggerVoterSpeech = () => {
    hub.triggerDelegateVoterSpeech(speakerInput || 'Cử tri đại diện dưới lớp', 60);
  };

  const handleStopVoterSpeech = () => {
    hub.stopDelegateVoterSpeech();
  };

  const handleSetVoterRecommendation = (opt: OptionId) => {
    hub.setVoterSpeakerRecommendation(opt);
  };

  const handleCloseVoterSpeechModal = () => {
    hub.closeDelegateVoterModal();
  };

  // Lifeline 2: Referendum controls
  const handleStartReferendum = () => {
    hub.startReferendum(timerPreset);
  };

  const handleStopReferendum = () => {
    hub.stopReferendum();
  };

  const handleRevealReferendum = () => {
    hub.revealReferendumResult();
  };

  const handleCloseReferendumModal = () => {
    hub.broadcastState({
      lifelines: {
        ...session.lifelines,
        referendum: {
          ...session.lifelines.referendum,
          status: 'idle',
        },
      },
    });
  };

  // Official Answer Confirmation
  const handleConfirmAnswer = (optionId: OptionId) => {
    if (!currentScenario) return;
    const isCorrect = optionId === currentScenario.correctOptionId;
    hub.broadcastState({
      selectedOptionId: optionId,
      isAnswerRevealed: true,
      isAnswerCorrect: isCorrect,
      sfxEvent: {
        type: isCorrect ? 'victory' : 'alert_wrong',
        timestamp: Date.now(),
      },
    });
  };

  // Reset current question
  const handleResetQuestion = () => {
    hub.broadcastState({
      selectedOptionId: null,
      isAnswerRevealed: false,
      isAnswerCorrect: null,
      lifelines: {
        ...session.lifelines,
        delegateVoter: {
          ...session.lifelines.delegateVoter,
          isActive: false,
          timerRunning: false,
        },
        referendum: {
          ...session.lifelines.referendum,
          status: 'idle',
        },
      },
    });
  };

  // Sound triggers
  const handlePlaySound = (type: SfxType) => {
    soundManager.play(type);
    hub.triggerSfx(type);
  };

  return (
    <main className="relative min-h-screen bg-granite-950 text-gray-100 overflow-x-hidden p-4 md:p-8">
      <BackgroundTextures />

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Presidium Header */}
        <div className="rounded-2xl glass-parliament p-6 border-b-2 border-emblem-gold flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-socialist-crimson to-granite-950 border-2 border-emblem-gold flex items-center justify-center text-emblem-gold shadow-gold-glow">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-socialist-bright uppercase">
                TRUNG TÂM ĐIỀU HÀNH CHỦ TỌA
              </span>
              <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-emblem-light to-amber-300">
                BÀN ĐIỀU KHIỂN NGHỊ TRƯỜNG • ĐÀO ĐỨC MINH
              </h1>
            </div>
          </div>

          {/* Quick links & Editor button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditorOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-socialist-crimson to-socialist-bright text-white text-xs font-bold uppercase tracking-wider shadow-crimson-glow flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer"
            >
              <FileEdit className="w-4 h-4" />
              <span>CHỈNH SỬA TÌNH HUỐNG</span>
            </button>

            <a
              href="/projector"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-granite-900 border border-emblem-gold/40 text-xs font-mono text-emblem-gold hover:bg-granite-800 transition-colors"
            >
              Màn Chiếu Sân Khấu ↗
            </a>
            <a
              href="/vote"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-granite-900 border border-gray-800 text-xs font-mono text-gray-300 hover:bg-granite-800 transition-colors"
            >
              Tab Cử Tri Mobile ↗
            </a>
          </div>
        </div>

        {/* 1. SCENARIO SWITCHER */}
        <div className="rounded-2xl glass-parliament p-6 border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emblem-gold">
                CHUYỂN ĐỔI HỒ SƠ TÌNH HUỐNG ({scenariosList.length} HỒ SƠ)
              </span>
            </div>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="text-xs font-mono text-amber-300 hover:underline flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tùy chỉnh nội dung tình huống</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {scenariosList.map((sc, idx) => {
              const isActive = idx === session.scenarioIndex;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleSwitchScenario(idx)}
                  className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-socialist-crimson/25 border-emblem-gold shadow-gold-glow'
                      : 'bg-granite-900/80 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase text-emblem-gold block mb-1">
                    {sc.code}
                  </span>
                  <h4 className="text-sm font-bold text-gray-100 line-clamp-1">
                    {sc.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 line-clamp-1 mt-1">
                    Đáp án đúng: <strong className="text-emerald-400 font-bold">{sc.correctOptionId}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. LIFELINES CONTROL (ỦY QUYỀN CỬ TRI & TRƯNG CẦU Ý DÂN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lifeline 1 Controller: ỦY QUYỀN CỬ TRI PHÁT BIỂU (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl glass-parliament p-6 border border-emblem-gold/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emblem-gold" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                  ỦY QUYỀN CỬ TRI (DÂN CHỦ ĐẠI DIỆN)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-granite-900 border border-emblem-gold/40 text-emblem-gold">
                {voterLifeline.remaining}/{voterLifeline.max} lượt
              </span>
            </div>

            <div className="p-4 rounded-xl bg-granite-900/90 border border-gray-800 space-y-3">
              <label className="text-xs font-mono text-gray-300 block">
                Chỉ định tên cử tri dưới lớp phát biểu (tùy chọn):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="VD: Cử tri Nguyễn Văn A (Nhóm 2)..."
                  value={speakerInput}
                  onChange={(e) => setSpeakerInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-granite-950 border border-gray-700 text-xs text-amber-200 outline-none focus:border-emblem-gold font-medium"
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {!voterLifeline.timerRunning ? (
                  <button
                    onClick={handleTriggerVoterSpeech}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emblem-gold to-emblem-amber text-granite-950 text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-gold-glow flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>MỜI CỬ TRI PHÁT BIỂU (60S)</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopVoterSpeech}
                    className="px-4 py-2 rounded-xl bg-socialist-crimson text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>DỪNG ĐẾM GIỜ PHÁT BIỂU</span>
                  </button>
                )}

                {voterLifeline.isActive && (
                  <button
                    onClick={handleCloseVoterSpeechModal}
                    className="px-3.5 py-2 rounded-xl bg-granite-800 hover:bg-granite-700 text-gray-300 text-xs font-semibold transition-colors"
                  >
                    Đóng cửa sổ phát biểu
                  </button>
                )}
              </div>
            </div>

            {/* Quick recommend recorder */}
            {currentScenario && (
              <div className="p-4 rounded-xl bg-granite-900/60 border border-gray-800 space-y-2">
                <span className="text-[11px] font-mono text-gray-400 block">
                  Sau khi cử tri phát biểu xong, ghi nhận khuyến nghị của họ:
                </span>
                <div className="flex items-center gap-2">
                  {currentScenario.options.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSetVoterRecommendation(opt.id)}
                      className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-bold transition-all ${
                        voterLifeline.recommendedOption === opt.id
                          ? 'bg-emblem-gold text-granite-950 border-amber-300 font-black'
                          : 'bg-granite-800 text-gray-300 border-gray-700 hover:bg-granite-700'
                      }`}
                    >
                      Cử tri khuyên chọn {opt.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lifeline 2 Controller: TRƯNG CẦU Ý DÂN (6 cols) */}
          <div className="lg:col-span-6 rounded-2xl glass-parliament p-6 border border-socialist-crimson/40 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Vote className="w-5 h-5 text-socialist-bright" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-100">
                  TRƯNG CẦU Ý DÂN (DÂN CHỦ TRỰC TIẾP)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-granite-900 border border-socialist-crimson/40 text-socialist-bright">
                {referendumStatus}
              </span>
            </div>

            {/* Timer Presets & Start button */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-granite-900/90 border border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-300">Đếm ngược:</span>
                {[15, 30, 45].map((sec) => (
                  <button
                    key={sec}
                    disabled={isVoting}
                    onClick={() => setTimerPreset(sec)}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                      timerPreset === sec
                        ? 'bg-emblem-gold text-granite-950'
                        : 'bg-granite-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              {!isVoting ? (
                <button
                  onClick={handleStartReferendum}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-socialist-crimson to-socialist-bright text-white text-xs font-black uppercase tracking-wider hover:brightness-110 shadow-crimson-glow flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>MỞ QR CỬ TRI ({timerPreset}S)</span>
                </button>
              ) : (
                <button
                  onClick={handleStopReferendum}
                  className="px-4 py-2 rounded-xl bg-socialist-crimson text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 shadow-crimson-glow flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>DỪNG BIỂU QUYẾT</span>
                </button>
              )}
            </div>

            {/* Live Tally Results */}
            <div className="p-4 rounded-xl bg-granite-900/70 border border-gray-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Users className="w-4 h-4 text-emblem-gold" />
                  Đã thu nhận:
                </span>
                <span className="text-base font-bold text-emblem-light">
                  {session.voteTally.totalVotes} phiếu
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-granite-950 border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-400 block font-mono">Phương án A:</span>
                  <span className="text-base font-bold font-mono text-amber-200">
                    {session.voteTally.counts.A} ({session.voteTally.percentages.A}%)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-granite-950 border border-gray-800 text-center">
                  <span className="text-[10px] text-gray-400 block font-mono">Phương án B:</span>
                  <span className="text-base font-bold font-mono text-amber-200">
                    {session.voteTally.counts.B} ({session.voteTally.percentages.B}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleRevealReferendum}
                  disabled={referendumStatus === 'idle'}
                  className="flex-1 py-2 rounded-xl bg-granite-800 hover:bg-granite-700 disabled:opacity-40 border border-gray-700 text-xs font-bold uppercase text-emblem-light flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emblem-gold" />
                  <span>Công bố % trên màn chiếu</span>
                </button>

                <button
                  onClick={handleCloseReferendumModal}
                  className="px-3.5 py-2 rounded-xl bg-granite-900 hover:bg-granite-800 border border-gray-800 text-xs font-semibold text-gray-400 transition-colors cursor-pointer"
                >
                  Đóng Modal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. OFFICIAL ANSWER CONFIRMATION */}
        {currentScenario && (
          <div className="rounded-2xl glass-parliament p-6 border border-emblem-gold/40 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-emblem-gold" />
                CHỐT NGHỊ QUYẾT ĐÁP ÁN CHÍNH THỨC
              </h3>
              <button
                onClick={handleResetQuestion}
                className="px-3 py-1 rounded-lg bg-granite-900 text-gray-400 hover:text-white border border-gray-800 text-xs flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Khôi phục câu hỏi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentScenario.options.map((opt) => (
                <div
                  key={opt.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                    session.selectedOptionId === opt.id
                      ? 'bg-emblem-gold/15 border-emblem-gold shadow-gold-glow'
                      : 'bg-granite-900 border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg bg-granite-800 flex items-center justify-center font-bold text-base text-emblem-gold border border-gray-700">
                      {opt.id}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-gray-200 block">
                        {opt.label}
                      </span>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {opt.text}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConfirmAnswer(opt.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      opt.id === currentScenario.correctOptionId
                        ? 'bg-republic-emerald text-white hover:brightness-110 shadow-emerald-glow'
                        : 'bg-socialist-crimson text-white hover:brightness-110 shadow-crimson-glow'
                    }`}
                  >
                    Chốt {opt.id}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SOUNDBOARD */}
        <div className="rounded-2xl glass-parliament p-6 border border-gray-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <Volume2 className="w-5 h-5 text-emblem-gold" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-100">
              BÀN ĐIỀU PHỐI ÂM THANH NGHỊ TRƯỜNG (SOUNDBOARD)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { label: 'Gõ búa khai mạc', sfx: 'gavel', color: 'from-amber-600 to-amber-700' },
              { label: 'Tíc tắc hồi hộp', sfx: 'clock_tick', color: 'from-gray-700 to-gray-800' },
              { label: 'Đếm ngược cao trào', sfx: 'countdown', color: 'from-purple-800 to-purple-950' },
              { label: 'Hết giờ (Buzzer)', sfx: 'time_up', color: 'from-red-800 to-red-950' },
              { label: 'Đáp án đúng (Fanfare)', sfx: 'victory', color: 'from-emerald-600 to-emerald-800' },
              { label: 'Cảnh báo sai', sfx: 'alert_wrong', color: 'from-red-600 to-red-700' },
              { label: 'Vỗ tay tán thành', sfx: 'applause', color: 'from-amber-500 to-amber-600' },
              { label: 'Trống dồn hồi hộp', sfx: 'drum_roll', color: 'from-yellow-700 to-amber-900' },
              { label: 'Nhạc biểu quyết cử tri', sfx: 'audience_vote', color: 'from-blue-700 to-indigo-900' },
              { label: 'Nhạc phát biểu cử tri', sfx: 'voter_speaking', color: 'from-teal-700 to-cyan-900' },
              { label: 'Nhạc mở màn kỳ họp', sfx: 'lets_play', color: 'from-rose-700 to-rose-900' },
            ].map((btn) => (
              <button
                key={btn.sfx}
                onClick={() => handlePlaySound(btn.sfx as SfxType)}
                className={`p-3 rounded-xl bg-gradient-to-br ${btn.color} text-white text-xs font-bold text-center border border-white/10 hover:brightness-125 shadow-md transition-all active:scale-95 cursor-pointer`}
              >
                {btn.label}
              </button>
            ))}
            <button
              onClick={() => soundManager.stopAll()}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-950 text-gray-300 text-xs font-bold text-center border border-gray-700 hover:text-white hover:border-red-500/50 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Dừng tất cả âm
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Editor Dialog Modal */}
      <ScenarioEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        scenarios={scenariosList}
        onSaveScenarios={(updatedList: Scenario[]) => {
          hub.saveAllScenarios(updatedList);
        }}
        onResetDefaults={() => {
          hub.resetToDefaultScenarios();
        }}
      />
    </main>
  );
}
