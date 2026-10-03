// Web Audio API procedural sound synthesizer for Parliamentary Arena
// Works 100% offline, zero network dependencies, zero 404s.

import { SfxType } from './types';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

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

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public play(type: SfxType) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      switch (type) {
        case 'gavel':
          this.playGavel(ctx);
          break;
        case 'clock_tick':
          this.playClockTick(ctx);
          break;
        case 'time_up':
          this.playTimeUp(ctx);
          break;
        case 'victory':
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

  // Double wooden gavel strike
  private playGavel(ctx: AudioContext) {
    const now = ctx.currentTime;
    
    // First strike
    this.singleGavelHit(ctx, now);
    // Second sharper strike
    this.singleGavelHit(ctx, now + 0.28, 1.2);
  }

  private singleGavelHit(ctx: AudioContext, time: number, pitchMult = 1.0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 * pitchMult, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.exponentialRampToValueAtTime(80, time + 0.2);

    gain.gain.setValueAtTime(0.9, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.25);

    // Wood noise snap
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(600, time);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(time);
  }

  // High-tension clock tick
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

  // Timer ended gong/buzzer
  private playTimeUp(ctx: AudioContext) {
    const now = ctx.currentTime;
    const freqs = [330, 440, 550];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.3, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + 0.7);
    });
  }

  // Regal brass victory fanfare
  private playVictoryFanfare(ctx: AudioContext) {
    const now = ctx.currentTime;
    // C5, E5, G5, C6 (Do - Mi - Sol - Do)
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
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, start);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.4, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + note.d + 0.05);
    });
  }

  // Dissonant low alert warning
  private playAlertWrong(ctx: AudioContext) {
    const now = ctx.currentTime;
    const freqs = [185, 196]; // Trill dissonance

    freqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    });
  }

  // Synthesized auditorium applause
  private playApplause(ctx: AudioContext) {
    const now = ctx.currentTime;
    const duration = 2.5;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Modulated noise burst
      const t = i / ctx.sampleRate;
      const envelope = Math.sin((t / duration) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.45;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  // Snare drum roll suspense
  private playDrumRoll(ctx: AudioContext) {
    const now = ctx.currentTime;
    const duration = 1.6;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const speed = 12 + t * 18; // accelerating roll
      const amp = (Math.sin(t * speed * Math.PI * 2) > 0 ? 1 : 0) * (0.2 + (t / duration) * 0.6);
      data[i] = (Math.random() * 2 - 1) * amp;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }
}

export const soundManager = new SoundSynthesizer();
