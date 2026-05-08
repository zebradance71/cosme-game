import { skinProfiles } from '../../data/skins';
import { resolveSerumEffect } from './rules';
import type { GameState, SerumType } from './types';

export const initialGameState: GameState = {
  phase: 'idle',
  runCount: 0,
  totalScore: 0,
  currentSkin: null,
  selectedSerum: null,
  resolution: null,
  dailySkin: null,
  dailySeed: '',
};

function randomSkin() {
  const index = Math.floor(Math.random() * skinProfiles.length);
  return skinProfiles[index].id;
}

function makeDailySeed(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function pickDailySkin(date = new Date()) {
  const seed = makeDailySeed(date);
  const hashed = hashSeed(seed);
  const index = hashed % skinProfiles.length;
  return { seed, skin: skinProfiles[index].id };
}

function pickSkinFromDailyPattern(seed: string, round: number) {
  const hashed = hashSeed(`${seed}-${round}`);
  const index = hashed % skinProfiles.length;
  return skinProfiles[index].id;
}

export function startRound(state: GameState): GameState {
  const nextRound = state.runCount + 1;
  const pickedSkin = state.dailySeed
    ? pickSkinFromDailyPattern(state.dailySeed, nextRound)
    : randomSkin();
  return {
    ...state,
    phase: 'skinRevealed',
    runCount: nextRound,
    currentSkin: pickedSkin,
    selectedSerum: null,
    resolution: null,
  };
}

export function chooseSerum(state: GameState, serum: SerumType): GameState {
  if (!state.currentSkin) {
    return state;
  }

  return {
    ...state,
    selectedSerum: serum,
    phase: 'serumSelected',
  };
}

export function applySerum(state: GameState): GameState {
  if (!state.currentSkin || !state.selectedSerum) {
    return state;
  }

  return {
    ...state,
    phase: 'applying',
  };
}

export function resolveRound(state: GameState): GameState {
  if (!state.currentSkin || !state.selectedSerum) {
    return state;
  }

  const resolution = resolveSerumEffect(state.currentSkin, state.selectedSerum);

  return {
    ...state,
    phase: 'resolved',
    totalScore: state.totalScore + resolution.scoreDelta,
    resolution,
  };
}

export function showResult(state: GameState): GameState {
  if (!state.resolution) {
    return state;
  }

  return {
    ...state,
    phase: 'resultShown',
  };
}
