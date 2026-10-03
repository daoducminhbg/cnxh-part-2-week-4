// High-Fidelity Audio System for Parliamentary Arena
// Plays authentic studio-grade sound effects with graceful procedural Web Audio fallback.

import { SfxType } from './types';

const AUDIO_FILES: Record<Exclude<SfxType, 'none'>, string> = {
  gavel: '/sounds/gavel.mp3',
  clock_tick: '/sounds/clock_tick.mp3',
  countdown: '/sounds/countdown.mp3',
  time_up: '/sounds/time_up.mp3',
  victory: '/sounds/victory.mp3',
  alert_wrong: '/sounds/alert_wrong.mp3',
  applause: '/sounds/applause.mp3',
  drum_roll: '/sounds/drum_roll.mp3',
  audience_vote: '/sounds/audience_vote.mp3',
  voter_speaking: '/sounds/voter_speaking.mp3',
  lets_play: '/sounds/lets_play.mp3',
};

const DEFAULT_VOLUMES: Record<Exclude<SfxType, 'none'>, number> = {
  gavel: 1.0,
  victory: 0.95,
  alert_wrong: 0.85,
  applause: 0.85,
  audience_vote: 0.75,
  voter_speaking: 0.65,
  clock_tick: 0.6,
  countdown: 0.85,
  drum_roll: 0.9,
  time_up: 0.9,
  lets_play: 0.9,
};

// Procedural fallback engine for zero-dependency resilience
class ProceduralSynthFallback {
  private ctx: AudioContext | null = null;

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public play(type: SfxType) {
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      switch (type) {
        case 'gavel':
          this.playGavel(ctx);
          break;
        case 'clock_tick':
        case 'countdown':
          this.playClockTick(ctx);
          break;
        case 'time_up':
          this.playTimeUp(ctx);
          break;
        case 'victory':
        case 'lets_play':
          this.playVictoryFanfare(ctx);
          break;
        case 'alert_wrong':
          this.playAlertWrong(ctx);
          break;
        case 'applause':
          this.playApplause(ctx);
          break;
        case 'drum_roll':
          this.playDrumRoll(ctx);
          break;
      }
    } catch {
      // Audio autoplay policy fallback
    }
  }

  private playGavel(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playClockTick(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  private playTimeUp(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  private playVictoryFanfare(ctx: AudioContext) {
    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0, d: 0.18 },
      { f: 659.25, t: 0.18, d: 0.18 },
      { f: 783.99, t: 0.36, d: 0.22 },
      { f: 1046.50, t: 0.58, d: 0.8 },
    ];

    notes.forEach((note) => {
      const start = now + note.t;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.4, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.d + 0.05);
    });
  }

  private playAlertWrong(ctx: AudioContext) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(185, now);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  private playApplause(ctx: AudioContext) {
    const now = ctx.currentTime;
    const duration = 2.0;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.sin((t / duration) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.4;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }

  private playDrumRoll(ctx: AudioContext) {
    const now = ctx.currentTime;
    const duration = 1.5;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      data[i] = (Math.random() * 2 - 1) * (0.2 + (t / duration) * 0.6);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
  }
}

class SoundManager {
  private isMuted: boolean = false;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentActiveTracks: Set<HTMLAudioElement> = new Set();
  private synth = new ProceduralSynthFallback();

  constructor() {
    // Preload audio files when running in the client
    if (typeof window !== 'undefined') {
      this.preloadAudio();
    }
  }

  private preloadAudio() {
    try {
      Object.entries(AUDIO_FILES).forEach(([key, src]) => {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'auto';
        this.audioCache.set(key, audio);
      });
    } catch {
      // Audio preloading silent catch
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stopAll() {
    this.currentActiveTracks.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Ignore pause errors
      }
    });
    this.currentActiveTracks.clear();
  }

  public play(type: SfxType) {
    if (this.isMuted || type === 'none') return;

    if (typeof window === 'undefined') return;

    const src = AUDIO_FILES[type as Exclude<SfxType, 'none'>];
    if (!src) {
      this.synth.play(type);
      return;
    }

    try {
      // If this is a major transition or answer reveal sound, stop prolonged background tracks
      if (type === 'victory' || type === 'alert_wrong' || type === 'gavel') {
        this.stopAll();
      }

      // Create or clone audio element for clean, latency-free overlapping playback
      const cached = this.audioCache.get(type);
      const audio = cached ? (cached.cloneNode(true) as HTMLAudioElement) : new Audio(src);

      const targetVolume = DEFAULT_VOLUMES[type as Exclude<SfxType, 'none'>] ?? 0.8;
      audio.volume = targetVolume;

      this.currentActiveTracks.add(audio);
      audio.onended = () => {
        this.currentActiveTracks.delete(audio);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case user hasn't interacted or browser blocked audio, fallback to synth
          this.synth.play(type);
        });
      }
    } catch {
      // Ultimate fallback: Web Audio API synthesis
      this.synth.play(type);
    }
  }
}

export const soundManager = new SoundManager();
