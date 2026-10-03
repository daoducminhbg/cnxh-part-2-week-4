import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ParliamentSessionState, OptionId, SfxType, Scenario } from './types';
import { DEFAULT_SCENARIOS } from './scenarios';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const INITIAL_SESSION_STATE: ParliamentSessionState = {
  scenarios: DEFAULT_SCENARIOS,
  currentScenarioId: DEFAULT_SCENARIOS[0].id,
  scenarioIndex: 0,
  totalScenarios: DEFAULT_SCENARIOS.length,
  delegateName: 'Đoàn Chủ Tịch Khóa 4 - CNXHKH',
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
    }
  },
  voteTally: {
    totalVotes: 0,
    counts: { A: 0, B: 0, C: 0, D: 0 },
    percentages: { A: 0, B: 0, C: 0, D: 0 },
  },
  voterSessions: {},
  sfxEvent: { type: 'none', timestamp: 0 },
  lastUpdated: Date.now(),
};

export class RealtimeParliamentHub {
  private supabase: SupabaseClient | null = null;
  private channel: ReturnType<SupabaseClient['channel']> | null = null;
  private localBroadcastChannel: BroadcastChannel | null = null;
  private state: ParliamentSessionState = { ...INITIAL_SESSION_STATE };
  private listeners: Set<(state: ParliamentSessionState) => void> = new Set();
  private pollInterval: NodeJS.Timeout | null = null;
  private referendumTimer: NodeJS.Timeout | null = null;
  private voterSpeechTimer: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Load customized scenarios from localStorage if present and auto-cleanse any spoilers
      try {
        const savedScenarios = localStorage.getItem('cnxh_custom_scenarios');
        if (savedScenarios) {
          const parsed = JSON.parse(savedScenarios);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const cleaned = parsed.map((sc: Scenario) => ({
              ...sc,
              options: sc.options.map((opt) => ({
                ...opt,
                label: opt.label.replace(/\s*\(CHÍNH XÁC\)/gi, '').trim(),
              })),
            }));
            this.state.scenarios = cleaned;
            this.state.totalScenarios = cleaned.length;
            this.state.currentScenarioId = cleaned[0].id;
            localStorage.setItem('cnxh_custom_scenarios', JSON.stringify(cleaned));
          }
        }
      } catch {
        // Fallback to defaults
      }

      // 1. BroadcastChannel for instant same-browser/cross-tab sync
      try {
        this.localBroadcastChannel = new BroadcastChannel('cnxh-parliament-channel');
        this.localBroadcastChannel.onmessage = (event) => {
          if (event.data && event.data.type === 'STATE_UPDATE') {
            this.handleIncomingState(event.data.state);
          }
        };
      } catch {
        // BroadcastChannel fallback
      }

      // 2. Optional Supabase Realtime client
      if (SUPABASE_URL && SUPABASE_KEY) {
        try {
          this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
          this.channel = this.supabase.channel('parliament-arena', {
            config: { broadcast: { self: false } },
          });

          this.channel
            .on('broadcast', { event: 'state_sync' }, (payload) => {
              if (payload.payload) {
                this.handleIncomingState(payload.payload as ParliamentSessionState);
              }
            })
            .on('broadcast', { event: 'vote_cast' }, (payload) => {
              const { voterId, optionId } = payload.payload as { voterId: string; optionId: OptionId };
              this.applyVoteLocally(voterId, optionId);
            })
            .subscribe();
        } catch {
          // Supabase init fallback
        }
      }

      // 3. Fallback: Local Server Polling for LAN / mobile clients
      this.pollServerState();
      this.pollInterval = setInterval(() => {
        this.pollServerState();
      }, 1000);
    }
  }

  private async pollServerState() {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.lastUpdated && data.lastUpdated > this.state.lastUpdated) {
          this.handleIncomingState(data);
        }
      }
    } catch {
      // Ignore network errors in local dev
    }
  }

  private handleIncomingState(newState: ParliamentSessionState) {
    this.state = { ...newState };
    this.notifyListeners();
  }

  public subscribe(callback: (state: ParliamentSessionState) => void) {
    this.listeners.add(callback);
    callback(this.state);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb(this.state));
  }

  public getState(): ParliamentSessionState {
    return this.state;
  }

  public async broadcastState(partialOrFull: Partial<ParliamentSessionState>) {
    const updatedState: ParliamentSessionState = {
      ...this.state,
      ...partialOrFull,
      lastUpdated: Date.now(),
    };

    this.state = updatedState;
    this.notifyListeners();

    // Persist customized scenarios locally
    if (partialOrFull.scenarios && typeof window !== 'undefined') {
      try {
        localStorage.setItem('cnxh_custom_scenarios', JSON.stringify(partialOrFull.scenarios));
      } catch {
        // Storage limit fallback
      }
    }

    // Broadcast across local browser tabs
    if (this.localBroadcastChannel) {
      this.localBroadcastChannel.postMessage({
        type: 'STATE_UPDATE',
        state: updatedState,
      });
    }

    // Broadcast via Supabase if configured
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'state_sync',
        payload: updatedState,
      });
    }

    // Push to server state cache
    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedState),
      });
    } catch {
      // Local fallback
    }
  }

  // Cast vote from mobile device
  public async castVote(voterId: string, optionId: OptionId) {
    this.applyVoteLocally(voterId, optionId);

    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'vote_cast',
        payload: { voterId, optionId },
      });
    }

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, optionId }),
      });
    } catch {
      // Fallback
    }
  }

  private applyVoteLocally(voterId: string, optionId: OptionId) {
    if (this.state.lifelines.referendum.status !== 'voting') {
      return;
    }

    const currentSessions = { ...this.state.voterSessions };
    currentSessions[voterId] = optionId;

    const counts: Record<OptionId, number> = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(currentSessions).forEach((opt) => {
      counts[opt] = (counts[opt] || 0) + 1;
    });

    const totalVotes = Object.keys(currentSessions).length;
    const percentages: Record<OptionId, number> = {
      A: totalVotes > 0 ? Math.round((counts.A / totalVotes) * 100) : 0,
      B: totalVotes > 0 ? Math.round((counts.B / totalVotes) * 100) : 0,
      C: totalVotes > 0 ? Math.round((counts.C / totalVotes) * 100) : 0,
      D: totalVotes > 0 ? Math.round((counts.D / totalVotes) * 100) : 0,
    };

    const newTally = { totalVotes, counts, percentages };
    this.broadcastState({
      voterSessions: currentSessions,
      voteTally: newTally,
    });
  }

  // =========================================================================
  // LIFELINE 1: ỦY QUYỀN CỬ TRI
  // =========================================================================
  public triggerDelegateVoterSpeech(speakerName: string = '', durationSeconds: number = 60) {
    if (this.voterSpeechTimer) clearInterval(this.voterSpeechTimer);

    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        delegateVoter: {
          ...this.state.lifelines.delegateVoter,
          isActive: true,
          speakerName: speakerName.trim() || 'Đại diện Cử tri được chỉ định',
          timerDuration: durationSeconds,
          remainingTime: durationSeconds,
          timerRunning: true,
          remaining: Math.max(0, this.state.lifelines.delegateVoter.remaining - 1),
        },
      },
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });

    this.voterSpeechTimer = setInterval(() => {
      const current = this.state.lifelines.delegateVoter.remainingTime;
      if (current > 1) {
        this.broadcastState({
          lifelines: {
            ...this.state.lifelines,
            delegateVoter: {
              ...this.state.lifelines.delegateVoter,
              remainingTime: current - 1,
            },
          },
          sfxEvent: current <= 5 ? { type: 'clock_tick', timestamp: Date.now() } : this.state.sfxEvent,
        });
      } else {
        this.stopDelegateVoterSpeech();
      }
    }, 1000);
  }

  public stopDelegateVoterSpeech() {
    if (this.voterSpeechTimer) {
      clearInterval(this.voterSpeechTimer);
      this.voterSpeechTimer = null;
    }
    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        delegateVoter: {
          ...this.state.lifelines.delegateVoter,
          timerRunning: false,
          remainingTime: 0,
        },
      },
      sfxEvent: { type: 'time_up', timestamp: Date.now() },
    });
  }

  public setVoterSpeakerRecommendation(optionId: OptionId) {
    this.broadcastState({
      selectedOptionId: optionId,
      lifelines: {
        ...this.state.lifelines,
        delegateVoter: {
          ...this.state.lifelines.delegateVoter,
          recommendedOption: optionId,
        },
      },
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });
  }

  public closeDelegateVoterModal() {
    if (this.voterSpeechTimer) {
      clearInterval(this.voterSpeechTimer);
      this.voterSpeechTimer = null;
    }
    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        delegateVoter: {
          ...this.state.lifelines.delegateVoter,
          isActive: false,
          timerRunning: false,
        },
      },
    });
  }

  // =========================================================================
  // LIFELINE 2: TRƯNG CẦU Ý DÂN
  // =========================================================================
  public startReferendum(durationSeconds: number = 30) {
    if (this.referendumTimer) clearInterval(this.referendumTimer);

    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        referendum: {
          ...this.state.lifelines.referendum,
          isActive: true,
          status: 'voting',
          duration: durationSeconds,
          remainingTime: durationSeconds,
          remaining: Math.max(0, this.state.lifelines.referendum.remaining - 1),
        }
      },
      voterSessions: {},
      voteTally: {
        totalVotes: 0,
        counts: { A: 0, B: 0, C: 0, D: 0 },
        percentages: { A: 0, B: 0, C: 0, D: 0 },
      },
      sfxEvent: { type: 'gavel', timestamp: Date.now() },
    });

    this.referendumTimer = setInterval(() => {
      const currentRemaining = this.state.lifelines.referendum.remainingTime;
      if (currentRemaining > 1) {
        this.broadcastState({
          lifelines: {
            ...this.state.lifelines,
            referendum: {
              ...this.state.lifelines.referendum,
              remainingTime: currentRemaining - 1,
            }
          },
          sfxEvent: currentRemaining <= 6 ? { type: 'clock_tick', timestamp: Date.now() } : this.state.sfxEvent,
        });
      } else {
        this.stopReferendum();
      }
    }, 1000);
  }

  public stopReferendum() {
    if (this.referendumTimer) {
      clearInterval(this.referendumTimer);
      this.referendumTimer = null;
    }

    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        referendum: {
          ...this.state.lifelines.referendum,
          status: 'closed',
          remainingTime: 0,
        }
      },
      sfxEvent: { type: 'time_up', timestamp: Date.now() },
    });
  }

  public revealReferendumResult() {
    this.broadcastState({
      lifelines: {
        ...this.state.lifelines,
        referendum: {
          ...this.state.lifelines.referendum,
          status: 'revealed',
        }
      },
      sfxEvent: { type: 'drum_roll', timestamp: Date.now() },
    });
  }

  // =========================================================================
  // SCENARIO MANAGEMENT
  // =========================================================================
  public saveAllScenarios(scenarios: Scenario[]) {
    const currentIdx = Math.min(this.state.scenarioIndex, scenarios.length - 1);
    this.broadcastState({
      scenarios,
      totalScenarios: scenarios.length,
      scenarioIndex: currentIdx,
      currentScenarioId: scenarios[currentIdx]?.id || '',
      selectedOptionId: null,
      isAnswerRevealed: false,
      isAnswerCorrect: null,
    });
  }

  public resetToDefaultScenarios() {
    this.saveAllScenarios(DEFAULT_SCENARIOS);
  }

  public triggerSfx(type: SfxType) {
    this.broadcastState({
      sfxEvent: { type, timestamp: Date.now() },
    });
  }
}

let hubInstance: RealtimeParliamentHub | null = null;
export function getParliamentHub(): RealtimeParliamentHub {
  if (typeof window === 'undefined') {
    return new RealtimeParliamentHub();
  }
  if (!hubInstance) {
    hubInstance = new RealtimeParliamentHub();
  }
  return hubInstance;
}
