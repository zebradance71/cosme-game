import { create } from 'zustand';
import { baseTimeline, outcomeTimelineBoost } from '../../animations/timelines';
import { pickLatestUnlockedTitle, titlesUnlockedAtScore } from './titleSystem';
import {
  applySerum,
  chooseSerum,
  initialGameState,
  pickDailySkin,
  resolveRound,
  showResult,
  startRound,
  STARTING_SCORE,
} from '../../core/game/engine';
import { buildRandomSuccessResolution } from '../../core/game/rules';
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
  runSequence: (opts?: { rarePullTitle?: string; rareScoreDelta?: number; isRarePull?: boolean }) => Promise<void>;
  retry: () => void;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  unlockedTitleChips: titlesUnlockedAtScore(STARTING_SCORE),
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
  runSequence: async (opts) => {
    const snapshot = get();
    if (snapshot.phase !== 'serumSelected' || snapshot.isProcessing) {
      return;
    }
    set({ isProcessing: true });
    set((state) => applySerum(state));
    await wait(baseTimeline[0].ms);
    set((state) => resolveRound(state));
    const rareScoreDelta = opts?.rareScoreDelta;
    if (rareScoreDelta != null) {
      set((state) => {
        if (!state.resolution || !state.currentSkin || !state.selectedSerum) {
          return state;
        }
        const preRoundTotal = state.totalScore - state.resolution.scoreDelta;
        let nextTotal = Math.max(0, preRoundTotal + rareScoreDelta);
        let scoreResetFromZero = false;
        if (nextTotal === 0) {
          nextTotal = STARTING_SCORE;
          scoreResetFromZero = true;
        }
        const appliedRareDelta = nextTotal - preRoundTotal;

        if (state.resolution.outcome === 'success') {
          return {
            ...state,
            totalScore: nextTotal,
            resolution: {
              ...state.resolution,
              scoreDelta: appliedRareDelta,
              ...(scoreResetFromZero ? { scoreResetFromZero: true } : {}),
            },
          };
        }

        const successRes = buildRandomSuccessResolution();
        return {
          ...state,
          totalScore: nextTotal,
          resolution: {
            outcome: 'success',
            scoreDelta: appliedRareDelta,
            reactionKey: successRes.reactionKey,
            headline: successRes.headline,
            detail: successRes.detail,
            ...(scoreResetFromZero ? { scoreResetFromZero: true } : {}),
          },
        };
      });
    }
    const resolved = get().resolution;
    if (resolved) {
      set((state) => {
        const totalScoreAfter = state.totalScore;
        const isRareSuccess = resolved.outcome === 'success' && Boolean(opts?.isRarePull);

        let nextCombo = state.successStreak;
        if (resolved.scoreResetFromZero) {
          nextCombo = 0;
        } else if (resolved.outcome === 'disaster') {
          nextCombo = 0;
        } else if (resolved.outcome === 'bad') {
          nextCombo = 0;
        } else if (resolved.outcome === 'normal') {
          /* 維持 */
        } else if (resolved.outcome === 'success') {
          nextCombo += isRareSuccess ? 2 : 1;
        }

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
        // 称号はスコアのみで再計算（disaster でもチップを空にしない）。コンボ: success +1 / レア +2 / normal 維持 / bad・disaster で 0
        const mergedTitleSet = titlesUnlockedAtScore(totalScoreAfter);
        const latestUnlockedTitle = pickLatestUnlockedTitle(state.unlockedTitleChips, mergedTitleSet);

        return {
          successStreak: nextCombo,
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
          comboCutIn: resolved.outcome === 'success' && nextCombo >= 3,
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
      unlockedTitleChips: titlesUnlockedAtScore(totalScore <= 0 ? STARTING_SCORE : totalScore),
      latestUnlockedTitle: null,
      comboCutIn: false,
    });
    set((state) => startRound(state));
  },
}));
