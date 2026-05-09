import { AnimatePresence, motion } from 'framer-motion';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { SerumCard } from '../cards/SerumCard';
import { GameHud } from '../hud/GameHud';
import { OutcomeOverlay } from '../result/OutcomeOverlay';
import { ResultAffiliateStrip } from '../result/ResultAffiliateStrip';
import { TutorialOverlay } from './TutorialOverlay';
import { getSerumCommentTone, pickSerumComment, type SerumCommentRoll } from './serumCommentary';
import { useGameStore } from '../../features/game/store';
import type { SerumType } from '../../core/game/types';
import { rollRareScoreDelta } from '../../core/game/scoring';
import { getAchievementTitleChipClass, getTitleFlavor } from '../../features/game/titleSystem';
import {
  buildDailySkinCode,
  buildDailyVariantClass,
  currentSkinLabel,
} from '../../features/game/selectors';
import { playOutcomeSfx } from '../../animations/sfx';

/** 称号チップが増えても同じ枠に収まるよう段階的に縮小（レイアウト構造はそのまま） */
function achievementTitleStripScale(count: number): number {
  if (count <= 5) return 1;
  if (count <= 8) return 0.92;
  if (count <= 11) return 0.84;
  if (count <= 14) return 0.76;
  if (count <= 17) return 0.69;
  return 0.62;
}

export function GameScreen() {
  const [heroShotFlash, setHeroShotFlash] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [bgmEnabled, setBgmEnabled] = useState(true);
  const [isPourAnimating, setIsPourAnimating] = useState(false);
  const [pourAnimation, setPourAnimation] = useState<{
    serum: SerumType;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);
  const [pourImpactPosition, setPourImpactPosition] = useState<{ x: number; y: number } | null>(null);
  const [showPourImpact, setShowPourImpact] = useState(false);
  const [selectedSerumComment, setSelectedSerumComment] = useState<SerumCommentRoll | null>(null);
  const [commentAnimKey, setCommentAnimKey] = useState(0);
  const shellRef = useRef<HTMLElement | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const tutorialSeenKey = 'cosme-game-tutorial-seen';
  const bgmEnabledKey = 'cosme-game-bgm-enabled';
  const {
    phase,
    runCount,
    totalScore,
    currentSkin,
    dailySeed,
    selectedSerum,
    resolution,
    isProcessing,
    successStreak,
    totalRatedRuns,
    totalSuccesses,
    totalDisasters,
    poreCollapseIndex,
    unlockedTitleChips,
    latestUnlockedTitle,
    comboCutIn,
    beginRound,
    pickSerum,
    runSequence,
    retry,
  } = useGameStore();

  useEffect(() => {
    if (phase === 'idle') {
      beginRound();
    }
  }, [beginRound, phase]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const seen = window.localStorage.getItem(tutorialSeenKey);
    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stored = window.localStorage.getItem(bgmEnabledKey);
    if (stored === '0') {
      setBgmEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const bgm = new Audio('/assets/audio/bgm/main.mp3');
    bgm.loop = true;
    bgm.volume = 0.05;
    bgmRef.current = bgm;

    const startBgm = () => {
      if (!bgmRef.current || !bgmEnabled) {
        return;
      }
      void bgmRef.current.play();
      window.removeEventListener('pointerdown', startBgm);
      window.removeEventListener('keydown', startBgm);
    };

    if (bgmEnabled) {
      void bgm.play().catch(() => {
        window.addEventListener('pointerdown', startBgm, { once: true });
        window.addEventListener('keydown', startBgm, { once: true });
      });
    }

    return () => {
      window.removeEventListener('pointerdown', startBgm);
      window.removeEventListener('keydown', startBgm);
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
      }
      bgmRef.current = null;
    };
  }, [bgmEnabled]);

  const toggleBgm = () => {
    const nextEnabled = !bgmEnabled;
    setBgmEnabled(nextEnabled);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(bgmEnabledKey, nextEnabled ? '1' : '0');
    }
    const bgm = bgmRef.current;
    if (!bgm) {
      return;
    }
    if (nextEnabled) {
      void bgm.play();
    } else {
      bgm.pause();
    }
  };

  useEffect(() => {
    if (phase !== 'resultShown') {
      setHeroShotFlash(false);
      return;
    }
    setHeroShotFlash(true);
    const timer = window.setTimeout(() => {
      setHeroShotFlash(false);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [phase, resolution?.reactionKey]);

  const canApply = phase === 'serumSelected' && !isProcessing;
  const skinLabel = currentSkinLabel({ currentSkin });
  const dailySkinCode = buildDailySkinCode(dailySeed, skinLabel);
  const dailyVariantClass = buildDailyVariantClass(dailySeed);

  useEffect(() => {
    if (phase === 'resultShown' && resolution) {
      void playOutcomeSfx(
        resolution.outcome,
        dailyVariantClass,
        resolution.reactionKey,
        Boolean(selectedSerumComment?.isRare),
      );
    }
  }, [phase, resolution?.reactionKey, resolution?.outcome, dailyVariantClass, selectedSerumComment?.isRare]);

  useEffect(() => {
    if (!selectedSerum) {
      setSelectedSerumComment(null);
      return;
    }
    setSelectedSerumComment(pickSerumComment(selectedSerum, runCount));
    setCommentAnimKey((prev) => prev + 1);
  }, [selectedSerum, runCount]);
  const achievementChipScale = useMemo(
    () => achievementTitleStripScale(unlockedTitleChips.length),
    [unlockedTitleChips.length],
  );
  const successRate = totalRatedRuns > 0 ? Math.round((totalSuccesses / totalRatedRuns) * 100) : 0;
  const closeTutorial = () => {
    setShowTutorial(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(tutorialSeenKey, '1');
    }
  };

  const bottleToneMap: Record<SerumType, string> = {
    retinol: '#7b6cff',
    vitamin_c: '#f3b547',
    niacinamide: '#8bb8ff',
    ceramide: '#b3a7d2',
    aha_bha: '#ff7a9d',
  };

  const runPourAnimation = async (serum: SerumType): Promise<void> => {
    if (typeof window === 'undefined') {
      return;
    }
    const shell = shellRef.current;
    if (!shell) {
      return;
    }
    const serumEl = document.querySelector<HTMLElement>(`[data-serum-id="${serum}"]`);
    if (!serumEl) {
      return;
    }
    const targetMap =
      document.querySelector<HTMLElement>('[data-skin-map] img') ??
      document.querySelector<HTMLElement>('[data-skin-map]') ??
      document.querySelector<HTMLElement>('.serum-grid');
    if (!targetMap) {
      return;
    }
    const shellRect = shell.getBoundingClientRect();
    const serumRect = serumEl.getBoundingClientRect();
    const targetRect = targetMap.getBoundingClientRect();
    const startX = serumRect.left + serumRect.width / 2 - shellRect.left;
    const startY = serumRect.top + serumRect.height / 2 - shellRect.top;
    const endX = targetRect.left + targetRect.width * 0.5 - shellRect.left;
    const endY = targetRect.top + targetRect.height * 0.34 - shellRect.top;

    setPourAnimation({ serum, startX, startY, endX, endY });
    setIsPourAnimating(true);
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 280);
    });
    setPourImpactPosition({ x: endX, y: endY + 8 });
    setShowPourImpact(true);
    window.setTimeout(() => setShowPourImpact(false), 300);
    setIsPourAnimating(false);
    setPourAnimation(null);
  };

  const onApply = async () => {
    if (!selectedSerum || !canApply) {
      return;
    }
    const shouldBoostRare = Boolean(selectedSerumComment?.isRare);
    const sequenceOpts =
      shouldBoostRare
        ? {
            rareScoreDelta: rollRareScoreDelta(),
            isRarePull: true,
            ...(selectedSerumComment?.rareTitleLabel
              ? { rarePullTitle: selectedSerumComment.rareTitleLabel }
              : {}),
          }
        : undefined;
    await runPourAnimation(selectedSerum);
    await runSequence(sequenceOpts);
  };

  const isRareResultScreen = phase === 'resultShown' && Boolean(selectedSerumComment?.isRare);
  const showSsrHintPanel =
    (phase === 'idle' || phase === 'skinRevealed') ||
    (phase === 'serumSelected' && !selectedSerumComment);

  return (
    <main className={`game-shell ${phase === 'resultShown' ? 'result-mode' : ''}`} ref={shellRef}>
      <div className={`hero-shot-flash ${heroShotFlash ? 'active' : ''}`} aria-hidden />
      <GameHud score={totalScore} runCount={runCount} successStreak={successStreak} />
      {phase !== 'resultShown' ? (
        <>
          <SerumCard
            skin={currentSkin}
            selectedSerum={selectedSerum}
            disabled={phase === 'applying' || isProcessing}
            isApplying={phase === 'applying'}
            onSelect={pickSerum}
          />

          <button type="button" className="primary-button apply-button" onClick={onApply} disabled={!canApply || isPourAnimating}>
            {phase === 'applying' ? '浸透中...' : '美容液を塗る'}
          </button>
          <p className="tempo-hint apply-note-static">※診断結果はネタです</p>
        </>
      ) : null}
      {phase !== 'resultShown' ? (
        <div className="serum-comment-overlay-wrap" aria-live="polite">
          <div
            className={`serum-comment-panel ${selectedSerum ? `tone-${getSerumCommentTone(selectedSerum)}` : ''} ${selectedSerumComment?.isRare ? 'is-rare' : ''} ${showSsrHintPanel ? 'serum-comment-panel--ssr-hint' : ''}`.trim()}
          >
            {selectedSerumComment?.isRare ? <span className="rare-badge">RARE</span> : null}
            <AnimatePresence mode="wait" initial={false}>
              {phase === 'serumSelected' && selectedSerumComment ? (
                <motion.p
                  key={`${selectedSerum}-${commentAnimKey}`}
                  className="tempo-hint apply-note live-comment"
                  initial={{ opacity: 0, y: 6, filter: 'blur(2px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -4, filter: 'blur(2px)' }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {selectedSerumComment.text}
                </motion.p>
              ) : (
                <p className="tempo-hint apply-note live-comment placeholder" key="placeholder">
                  稀に<span className="ssr-hint-em">{'"SSR肌覚醒"'}</span>が発生します
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : null}
      {phase !== 'resultShown' ? (
        <>
          <section className="achievement-panel glass-card" aria-label="実績">
            <article className="achievement-item">
              <strong>{totalDisasters}</strong>
              <p className="micro-label">爆死回数</p>
            </article>
            <article className="achievement-item">
              <strong>{successRate}%</strong>
              <p className="micro-label">SUCCESS率</p>
            </article>
            <article className="achievement-item">
              <strong>{poreCollapseIndex}%</strong>
              <p className="micro-label">毛穴崩壊指数</p>
            </article>
          </section>
          {unlockedTitleChips.length > 0 ? (
            <div
              className="achievement-titles"
              style={{ '--chip-scale': achievementChipScale } as CSSProperties}
            >
              {unlockedTitleChips.map((title) => (
                <span
                  key={title}
                  className={`achievement-title-chip ${getAchievementTitleChipClass(title)} ${latestUnlockedTitle === title ? 'latest-unlocked' : ''}`.trim()}
                  data-flavor={getTitleFlavor(title)}
                  title={getTitleFlavor(title)}
                >
                  {title}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : null}

      {phase === 'resultShown' ? (
        <div className="result-outcome-stack">
          <ResultAffiliateStrip
            pickSeed={`${runCount}-${resolution?.reactionKey ?? ''}-${selectedSerumComment?.isRare ? 'rare' : 'norm'}`}
          />
          <OutcomeOverlay
            key={`${runCount}-${resolution?.reactionKey ?? 'none'}-${isRareResultScreen ? 'rare' : 'norm'}`}
            resolution={resolution}
            visible
            dailySkinCode={dailySkinCode}
            dailySeed={dailySeed}
            skinType={currentSkin}
            dailyVariantClass={dailyVariantClass}
            comboCutIn={comboCutIn}
            successStreak={successStreak}
            rareResultActive={Boolean(selectedSerumComment?.isRare)}
            onRetry={retry}
          />
        </div>
      ) : (
        <OutcomeOverlay
          key="outcome-idle"
          resolution={resolution}
          visible={false}
          dailySkinCode={dailySkinCode}
          dailySeed={dailySeed}
          skinType={currentSkin}
          dailyVariantClass={dailyVariantClass}
          comboCutIn={comboCutIn}
          successStreak={successStreak}
          rareResultActive={false}
          onRetry={retry}
        />
      )}
      <AnimatePresence>
        {pourAnimation ? (
          <motion.div
            className="pour-bottle-flight"
            style={{ '--serum-tone': bottleToneMap[pourAnimation.serum] } as CSSProperties}
            initial={{ x: pourAnimation.startX - 12, y: pourAnimation.startY - 12, scale: 0.86, rotate: -16 }}
            animate={{ x: pourAnimation.endX - 12, y: pourAnimation.endY - 22, scale: 1, rotate: 8 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.38, ease: 'easeOut' }}
          >
            <span className="pour-drop pour-drop-a" />
            <span className="pour-drop pour-drop-b" />
          </motion.div>
        ) : null}
        {showPourImpact && pourImpactPosition ? (
          <div
            className="pour-impact"
            style={{ left: `${pourImpactPosition.x}px`, top: `${pourImpactPosition.y}px` }}
            aria-hidden
          >
            <span className="pour-impact-core" />
            <span className="pour-impact-drip pour-impact-drip-a" />
            <span className="pour-impact-drip pour-impact-drip-b" />
          </div>
        ) : null}
      </AnimatePresence>
      {phase !== 'resultShown' ? (
        <button
          type="button"
          className="bgm-toggle-button glass-card"
          onClick={toggleBgm}
          aria-label={bgmEnabled ? 'BGMをオフにする' : 'BGMをオンにする'}
        >
          <span aria-hidden>{bgmEnabled ? '🔊' : '🔇'}</span>
        </button>
      ) : null}
      <TutorialOverlay visible={showTutorial} onClose={closeTutorial} />
    </main>
  );
}
