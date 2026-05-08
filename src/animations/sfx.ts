import type { Outcome } from '../core/game/types';

const sfxPathMap: Record<Outcome, string> = {
  normal: '/assets/audio/sfx/normal.mp3',
  success: '/assets/audio/sfx/success.mp3',
  bad: '/assets/audio/sfx/bad.mp3',
  disaster: '/assets/audio/sfx/disaster.mp3',
};

function resolveSfxPath(outcome: Outcome, reactionKey?: string): string {
  if (outcome === 'bad' && reactionKey === 'oilFlash') {
    return '/assets/audio/sfx/meh.mp3';
  }
  return sfxPathMap[outcome];
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) {
    return null;
  }
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
}

function variantRate(variantClass?: string): number {
  if (!variantClass) {
    return 1;
  }
  if (variantClass.endsWith('-1')) {
    return 0.94;
  }
  if (variantClass.endsWith('-2')) {
    return 1.08;
  }
  return 1;
}

async function playFileWithRate(path: string, rate: number): Promise<boolean> {
  try {
    const audio = new Audio(path);
    audio.volume = 0.55;
    audio.playbackRate = rate;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

function fallbackBeep(outcome: Outcome, rate: number): void {
  const ctx = getAudioContext();
  if (!ctx) {
    return;
  }

  const config: Record<Outcome, { freq: number; dur: number; type: OscillatorType }> = {
    normal: { freq: 540, dur: 0.09, type: 'sine' },
    success: { freq: 880, dur: 0.1, type: 'triangle' },
    bad: { freq: 320, dur: 0.12, type: 'square' },
    disaster: { freq: 180, dur: 0.16, type: 'sawtooth' },
  };

  const { freq, dur, type } = config[outcome];
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq * rate, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

export async function playOutcomeSfx(outcome: Outcome, variantClass?: string, reactionKey?: string): Promise<void> {
  const rate = variantRate(variantClass);
  const filePlayed = await playFileWithRate(resolveSfxPath(outcome, reactionKey), rate);
  if (!filePlayed) {
    fallbackBeep(outcome, rate);
  }
}
