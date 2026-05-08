import { create } from 'zustand';
import { baseTimeline, outcomeTimelineBoost } from '../../animations/timelines';
import { evaluateUnlockedTitles } from './titleSystem';
import {
  applySerum,
  chooseSerum,
  initialGameState,
  pickDailySkin,
  resolveRound,
  showResult,
  startRound,
} from '../../core/game/engine';
import type { GameState, SerumType } from '../../core/game/types';

interface GameStore extends GameState {
  isProcessing: boolean;
  successStreak: number;
  badStreak: number;
  disasterStreak: number;
  totalResolved: number;
  totalRatedRuns: number;
  totalSuccesses: number;
  totalDisasters: number;
  totalPoreCollapses: number;
  poreCollapseIndex: number;
  unlockedTitleChips: string[];
  latestUnlockedTitle: string | null;
  comboCutIn: boolean;
  beginRound: () => void;
  pickSerum: (serum: SerumType) => void;
  runSequence: () => Promise<void>;
  retry: () => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const titleStorageKey = 'cosme-game-unlocked-titles';

function readStoredTitles(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(titleStorageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
}

function writeStoredTitles(titles: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(titleStorageKey, JSON.stringify(titles));
  } catch {
    // Ignore storage errors silently.
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialGameState,
  isProcessing: false,
  successStreak: 0,
  badStreak: 0,
  disasterStreak: 0,
  totalResolved: 0,
  totalRatedRuns: 0,
  totalSuccesses: 0,
  totalDisasters: 0,
  totalPoreCollapses: 0,
  poreCollapseIndex: 0,
  unlockedTitleChips: readStoredTitles(),
  latestUnlockedTitle: null,
  comboCutIn: false,
  beginRound: () => {
    const currentSeed = get().dailySeed;
    const seed = currentSeed || pickDailySkin().seed;
    set((state) =>
      startRound({
        ...state,
        dailySkin: null,
        dailySeed: seed,
      }),
    );
  },
  pickSerum: (serum) => set((state) => chooseSerum(state, serum)),
  runSequence: async () => {
    const snapshot = get();
    if (snapshot.phase !== 'serumSelected' || snapshot.isProcessing) {
      return;
    }
    set({ isProcessing: true });
    set((state) => applySerum(state));
    await wait(baseTimeline[0].ms);
    set((state) => resolveRound(state));
    const resolved = get().resolution;
    if (resolved) {
      set((state) => {
        const nextStreak = resolved.outcome === 'success' ? state.successStreak + 1 : 0;
        const nextBadStreak = resolved.outcome === 'bad' ? state.badStreak + 1 : 0;
        const nextDisasterStreak = resolved.outcome === 'disaster' ? state.disasterStreak + 1 : 0;
        const totalResolved = state.totalResolved + 1;
        const totalRatedRuns = state.totalRatedRuns + (resolved.outcome === 'normal' ? 0 : 1);
        const totalSuccesses = state.totalSuccesses + (resolved.outcome === 'success' ? 1 : 0);
        const totalDisasters = state.totalDisasters + (resolved.outcome === 'disaster' ? 1 : 0);
        const totalPoreCollapses =
          state.totalPoreCollapses + (resolved.reactionKey === 'poreCollapse' ? 1 : 0);
        const poreDeltaMap = {
          normal: 0,
          success: -2,
          bad: 8,
          disaster: 25,
        } as const;
        const nextPoreCollapseIndex = Math.max(0, state.poreCollapseIndex + poreDeltaMap[resolved.outcome]);
        const titleSnapshot = {
          totalRatedRuns,
          totalSuccesses,
          totalDisasters,
          poreCollapseIndex: nextPoreCollapseIndex,
          successStreak: nextStreak,
          badStreak: nextBadStreak,
          disasterStreak: nextDisasterStreak,
        };
        const autoUnlocked = evaluateUnlockedTitles(titleSnapshot);
        const mergedTitleSet = Array.from(new Set([...state.unlockedTitleChips, ...autoUnlocked]));
        const newlyUnlocked = mergedTitleSet.filter((title) => !state.unlockedTitleChips.includes(title));
        const latestUnlockedTitle =
          newlyUnlocked.length > 0 ? newlyUnlocked[newlyUnlocked.length - 1] : state.latestUnlockedTitle;
        if (newlyUnlocked.length > 0) {
          writeStoredTitles(mergedTitleSet);
        }
        return {
          successStreak: nextStreak,
          badStreak: nextBadStreak,
          disasterStreak: nextDisasterStreak,
          totalResolved,
          totalRatedRuns,
          totalSuccesses,
          totalDisasters,
          totalPoreCollapses,
          poreCollapseIndex: nextPoreCollapseIndex,
          unlockedTitleChips: mergedTitleSet,
          latestUnlockedTitle,
          comboCutIn: resolved.outcome === 'success' && nextStreak >= 3,
        };
      });
    }
    const boost = resolved ? outcomeTimelineBoost[resolved.outcome] : 1;
    await wait(Math.round(baseTimeline[1].ms * boost));
    set((state) => showResult(state));
    set({ isProcessing: false });
  },
  retry: () => {
    const {
      totalScore,
      runCount,
      dailySkin,
      dailySeed,
      totalResolved,
      totalRatedRuns,
      totalSuccesses,
      totalDisasters,
      totalPoreCollapses,
      poreCollapseIndex,
      unlockedTitleChips,
      latestUnlockedTitle,
    } = get();
    set({
      ...initialGameState,
      totalScore,
      runCount,
      dailySkin,
      dailySeed,
      isProcessing: false,
      badStreak: 0,
      disasterStreak: 0,
      totalResolved,
      totalRatedRuns,
      totalSuccesses,
      totalDisasters,
      totalPoreCollapses,
      poreCollapseIndex,
      unlockedTitleChips,
      latestUnlockedTitle,
      comboCutIn: false,
    });
    set((state) => startRound(state));
  },
}));
