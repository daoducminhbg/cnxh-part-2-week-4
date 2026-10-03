'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { HeaderNav } from '@/components/HeaderNav';
import { ScenarioCard } from '@/components/ScenarioCard';
import { OptionCard } from '@/components/OptionCard';
import { LifelinePanel } from '@/components/LifelinePanel';
import { ReferendumOverlay } from '@/components/ReferendumOverlay';
import { VoterAssistanceModal } from '@/components/VoterAssistanceModal';
import { VictoryModal } from '@/components/VictoryModal';
import { BackgroundTextures } from '@/components/BackgroundTextures';
import { getParliamentHub } from '@/lib/realtime';
import { soundManager } from '@/lib/audio';
import { ParliamentSessionState, OptionId } from '@/lib/types';
import { Scale, Award, BookmarkCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProjectorArenaPage() {
  const [session, setSession] = useState<ParliamentSessionState | null>(null);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const lastSfxTimestampRef = useRef<number>(0);

  useEffect(() => {
    const hub = getParliamentHub();
    const unsubscribe = hub.subscribe((updated) => {
      setSession({ ...updated });

      // Handle sound effects triggered remotely
      if (updated.sfxEvent && updated.sfxEvent.timestamp > lastSfxTimestampRef.current) {
        lastSfxTimestampRef.current = updated.sfxEvent.timestamp;
        soundManager.play(updated.sfxEvent.type);
      }

      // Auto-open victory modal when answer is revealed
      if (updated.isAnswerRevealed) {
        setIsVictoryModalOpen(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granite-950 text-amber-200 font-mono">
        Đang khởi động phiên họp nghị trường...
      </div>
    );
  }

  const hub = getParliamentHub();
  const scenariosList = session.scenarios && session.scenarios.length > 0 ? session.scenarios : [];
  const currentScenario = scenariosList[session.scenarioIndex] || scenariosList[0];
  const isLastScenario = session.scenarioIndex >= scenariosList.length - 1;

  if (!currentScenario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-granite-950 text-amber-200 font-mono">
        Chưa có hồ sơ tình huống trong hệ thống. Vui lòng mở trang Quản trị để thêm.
      </div>
    );
  }

  const handleSelectOption = (optId: OptionId) => {
    hub.broadcastState({ selectedOptionId: optId });
  };

  // Lifeline 1: Trigger Live Student Voter Speech
  const handleUseDelegateVoter = () => {
    hub.triggerDelegateVoterSpeech('Đại diện Cử tri được chỉ định', 60);
  };

  const handleCloseVoterSpeech = () => {
    hub.closeDelegateVoterModal();
  };

  // Lifeline 2: Referendum
  const handleUseReferendum = () => {
    hub.startReferendum(30);
  };

  const handleApplyReferendumVote = (winningOptionId: OptionId) => {
    hub.broadcastState({
      selectedOptionId: winningOptionId,
      lifelines: {
        ...session.lifelines,
        referendum: {
          ...session.lifelines.referendum,
          status: 'idle',
        },
      },
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });
  };

  const handleCloseReferendum = () => {
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

  const handleNextScenario = () => {
    if (isLastScenario) {
      alert('Đã hoàn thành toàn bộ các hồ sơ nghị trường!');
      setIsVictoryModalOpen(false);
      return;
    }
    const nextIdx = session.scenarioIndex + 1;
    hub.broadcastState({
      scenarioIndex: nextIdx,
      currentScenarioId: scenariosList[nextIdx].id,
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
        referendum: { remaining: 1, max: 1, isActive: false, status: 'idle', duration: 30, remainingTime: 30 },
      },
      voteTally: { totalVotes: 0, counts: { A: 0, B: 0, C: 0, D: 0 }, percentages: { A: 0, B: 0, C: 0, D: 0 } },
      voterSessions: {},
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });
    setIsVictoryModalOpen(false);
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-granite-950 text-gray-100 overflow-x-hidden">
      <BackgroundTextures />

      {/* Top Parliament Header */}
      <HeaderNav
        currentScenarioCode={currentScenario.code}
        delegateName={session.delegateName}
        totalVoters={session.voteTally.totalVotes}
        referendumActive={session.lifelines.referendum.status === 'voting'}
      />

      {/* Main Auditorium Screen Stage */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Scenario Banner & Academic Topic */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 rounded-xl bg-granite-900/60 border border-gray-800">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full bg-socialist-crimson" />
            <span>Chủ đề: <strong className="text-amber-200">{currentScenario.topic}</strong></span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
            <span>Tiến độ nghị trường:</span>
            <span className="px-2 py-0.5 rounded bg-granite-950 border border-emblem-gold/30 text-emblem-gold font-bold">
              {session.scenarioIndex + 1} / {scenariosList.length}
            </span>
          </div>
        </div>

        {/* Central Split Layout: Scenario Details + Options vs Lifelines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Scenario Dossier & Options */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ScenarioCard scenario={currentScenario} />

            {/* Options List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
                <span className="flex items-center gap-1.5 uppercase text-emblem-gold font-semibold">
                  <BookmarkCheck className="w-4 h-4" />
                  Phương án quyết sách dự thảo:
                </span>
                <span>Chọn để đề xuất nghị quyết</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentScenario.options.map((opt) => (
                  <OptionCard
                    key={opt.id}
                    option={opt}
                    isSelected={session.selectedOptionId === opt.id}
                    isAnswerRevealed={session.isAnswerRevealed}
                    isCorrect={opt.id === currentScenario.correctOptionId}
                    isClickable={!session.isAnswerRevealed}
                    onSelect={handleSelectOption}
                    referendumPercent={
                      session.lifelines.referendum.status === 'revealed'
                        ? session.voteTally.percentages[opt.id]
                        : null
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Lifelines & Constitutional Principles */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Lifelines Dashboard */}
            <LifelinePanel
              lifelines={session.lifelines}
              onUseDelegateVoter={handleUseDelegateVoter}
              onUseReferendum={handleUseReferendum}
              isAnswerRevealed={session.isAnswerRevealed}
            />

            {/* Principles of Socialist Democracy Card */}
            <div className="rounded-2xl glass-parliament p-5 border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-socialist-bright uppercase">
                <Scale className="w-4 h-4 text-socialist-crimson" />
                <span>Bản chất Dân chủ Xã hội Chủ nghĩa</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed italic">
                &ldquo;Dân chủ xã hội chủ nghĩa là bản chất của chế độ ta, vừa là mục tiêu, vừa là động lực của sự phát triển đất nước.&rdquo;
              </p>
              <div className="pt-2 border-t border-gray-800/80 text-[11px] font-mono text-gray-400">
                Hiến pháp nước CHXHCN Việt Nam (2013)
              </div>
            </div>

            {/* Live Voting Quick Glance */}
            {session.voteTally.totalVotes > 0 && (
              <div className="rounded-2xl glass-parliament p-4 border border-emblem-gold/30">
                <div className="flex items-center justify-between text-xs font-mono text-amber-200 mb-2">
                  <span>Ý CHÍ CỬ TRI ĐÃ GHI NHẬN</span>
                  <span className="font-bold">{session.voteTally.totalVotes} phiếu</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-granite-900 border border-gray-800">
                    <span className="text-[10px] text-gray-400 block">Phương án A</span>
                    <strong className="text-sm font-mono text-amber-100">{session.voteTally.percentages.A}%</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-granite-900 border border-gray-800">
                    <span className="text-[10px] text-gray-400 block">Phương án B</span>
                    <strong className="text-sm font-mono text-amber-100">{session.voteTally.percentages.B}%</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Referendum Full-Screen Stage Modal */}
      <ReferendumOverlay
        status={session.lifelines.referendum.status}
        duration={session.lifelines.referendum.duration}
        remainingTime={session.lifelines.referendum.remainingTime}
        tally={session.voteTally}
        options={currentScenario.options}
        onApplyHighestVote={handleApplyReferendumVote}
        onClose={handleCloseReferendum}
      />

      {/* Live Appointed Student Voter Speaking Modal */}
      <VoterAssistanceModal
        isOpen={session.lifelines.delegateVoter.isActive}
        onClose={handleCloseVoterSpeech}
        scenario={currentScenario}
        delegateVoterState={session.lifelines.delegateVoter}
        onStartTimer={(sec) => hub.triggerDelegateVoterSpeech(session.lifelines.delegateVoter.speakerName, sec)}
        onStopTimer={() => hub.stopDelegateVoterSpeech()}
        onApplyRecommendation={(opt) => {
          hub.setVoterSpeakerRecommendation(opt);
          hub.closeDelegateVoterModal();
        }}
      />

      {/* Academic Victory & Explanation Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        isCorrect={session.selectedOptionId === currentScenario.correctOptionId}
        scenario={currentScenario}
        selectedOptionId={session.selectedOptionId}
        onNextScenario={handleNextScenario}
        onClose={() => setIsVictoryModalOpen(false)}
        isLastScenario={isLastScenario}
      />
    </main>
  );
}
