import { AnimatePresence, motion } from 'framer-motion';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { SerumCard } from '../cards/SerumCard';
import { GameHud } from '../hud/GameHud';
import { RecoverySuggestionCard } from '../result/RecoverySuggestionCard';
import { pickUniqueRecoveryItems } from '../result/recoveryItems';
import { OutcomeOverlay } from '../result/OutcomeOverlay';
import { TutorialOverlay } from './TutorialOverlay';
import { useGameStore } from '../../features/game/store';
import type { SerumType } from '../../core/game/types';
import { getTitleFlavor } from '../../features/game/titleSystem';
import {
  buildDailySkinCode,
  buildDailyVariantClass,
  currentSkinLabel,
} from '../../features/game/selectors';
import { totalTimelineMs } from '../../animations/timelines';
import { playOutcomeSfx } from '../../animations/sfx';

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
      void playOutcomeSfx(resolution.outcome, dailyVariantClass, resolution.reactionKey);
    }
  }, [phase, resolution?.reactionKey, resolution?.outcome, dailyVariantClass]);

  const estimatedMs = resolution ? totalTimelineMs(resolution.outcome) : 0;
  const recoveryItems = useMemo(() => {
    if (phase !== 'resultShown') {
      return [];
    }
    return pickUniqueRecoveryItems(3);
  }, [phase, runCount]);
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
    await runPourAnimation(selectedSerum);
    await runSequence();
  };

  return (
    <main className="game-shell" ref={shellRef}>
      <div className={`hero-shot-flash ${heroShotFlash ? 'active' : ''}`} aria-hidden />
      <GameHud score={totalScore} runCount={runCount} successStreak={successStreak} />
      {phase === 'resultShown' ? (
        <div className="hud-recovery-floating">
          {recoveryItems.map((item) => (
            <RecoverySuggestionCard key={item.url} imagePath={null} item={item} />
          ))}
        </div>
      ) : null}
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
          {phase === 'serumSelected' && successStreak === 2 ? (
            <p className="tempo-hint combo-ready">次SUCCESSで特別カットイン!</p>
          ) : null}
        </>
      ) : (
        <>
          <div className="result-stage-spacer" aria-hidden />
          <p className="tempo-hint">今回の演出尺: 約{(estimatedMs / 1000).toFixed(1)}秒</p>
        </>
      )}
      <div className="ambient-footer-effects" aria-hidden>
        <span className="ambient-glow ambient-glow-a" />
        <span className="ambient-glow ambient-glow-b" />
        <span className="ambient-particle ambient-particle-a" />
        <span className="ambient-particle ambient-particle-b" />
        <span className="ambient-particle ambient-particle-c" />
        <span className="ambient-reflection" />
      </div>
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
        <div className="achievement-titles">
          {unlockedTitleChips.map((title) => (
            <span
              key={title}
              className={`achievement-title-chip ${latestUnlockedTitle === title ? 'latest-unlocked' : ''}`}
              data-flavor={getTitleFlavor(title)}
              title={getTitleFlavor(title)}
            >
              {title}
            </span>
          ))}
        </div>
      ) : null}

      <OutcomeOverlay
        resolution={resolution}
        visible={phase === 'resultShown'}
        totalScore={totalScore}
        dailySkinCode={dailySkinCode}
        dailySeed={dailySeed}
        skinType={currentSkin}
        dailyVariantClass={dailyVariantClass}
        comboCutIn={comboCutIn}
        successStreak={successStreak}
        onRetry={retry}
      />
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
