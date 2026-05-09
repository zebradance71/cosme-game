import { useEffect, useState } from 'react';
import type { Outcome, Resolution } from '../../core/game/types';
import { pickVoiceCaption } from './outcomeOverlayData';

interface UseOutcomeOverlayEffectsParams {
  visible: boolean;
  resolution: Resolution | null;
  isSuccess: boolean;
  /** レア EXCELLENT 向けの派手演出（フラッシュ・スクショ枠・スコアカウント）。非レア SUCCESS では false */
  excellentPresentation: boolean;
  isDisaster: boolean;
  runCount: number;
}

/**
 * 結果の数値は scoring の抽選が engine で適用された
 * `resolution.scoreDelta`（= 上部 SCORE への実増減）を 0 からカウント表示する。
 */
export function useOutcomeOverlayEffects({
  visible,
  resolution,
  isSuccess,
  excellentPresentation,
  isDisaster,
  runCount,
}: UseOutcomeOverlayEffectsParams) {
  const [showShutterGuide, setShowShutterGuide] = useState(false);
  const [showVoiceCaption, setShowVoiceCaption] = useState(false);
  const [voiceCaptionText, setVoiceCaptionText] = useState('');
  const [showRetryPulse, setShowRetryPulse] = useState(false);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const [autoFocusShotActive, setAutoFocusShotActive] = useState(false);
  const [showDisasterFragmentBreak, setShowDisasterFragmentBreak] = useState(false);
  const [animatedRoundDelta, setAnimatedRoundDelta] = useState(0);

  useEffect(() => {
    if (!visible || !resolution) {
      setShowShutterGuide(false);
      setShowVoiceCaption(false);
      setVoiceCaptionText('');
      setShowRetryPulse(false);
      return;
    }
    setShowShutterGuide(true);
    setShowVoiceCaption(true);
    setShowRetryPulse(false);
    setVoiceCaptionText(
      pickVoiceCaption(resolution.headline, resolution.outcome as Outcome, runCount),
    );

    const shutterTimer = window.setTimeout(() => setShowShutterGuide(false), 800);
    const captionTimer = window.setTimeout(() => setShowVoiceCaption(false), 600);
    const pulseTimer = window.setTimeout(() => setShowRetryPulse(true), 3000);
    return () => {
      window.clearTimeout(shutterTimer);
      window.clearTimeout(captionTimer);
      window.clearTimeout(pulseTimer);
    };
  }, [visible, resolution, runCount]);

  useEffect(() => {
    if (!visible || !resolution) {
      setAnimatedRoundDelta(0);
      return;
    }
    const start = 0;
    const end = resolution.scoreDelta;
    const duration = Math.min(1100, 480 + Math.min(420, Math.abs(end) * 1.2));
    const startedAt = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedRoundDelta(Math.round(start + (end - start) * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    setAnimatedRoundDelta(start);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible, resolution]);

  useEffect(() => {
    if (!visible || !resolution || !isSuccess || !excellentPresentation) {
      setShowSuccessFlash(false);
      return;
    }
    setShowSuccessFlash(true);
    const timer = window.setTimeout(() => setShowSuccessFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [visible, resolution, isSuccess, excellentPresentation]);

  useEffect(() => {
    if (!visible || !resolution || !isDisaster) {
      setShowDisasterFragmentBreak(false);
      return;
    }
    setShowDisasterFragmentBreak(true);
    const timer = window.setTimeout(() => setShowDisasterFragmentBreak(false), 200);
    return () => window.clearTimeout(timer);
  }, [visible, resolution, isDisaster]);

  useEffect(() => {
    if (!visible || !resolution || !isSuccess || !excellentPresentation) return;
    setAutoFocusShotActive(true);
    const timer = window.setTimeout(() => setAutoFocusShotActive(false), 1100);
    return () => window.clearTimeout(timer);
  }, [visible, resolution, isSuccess, excellentPresentation]);

  const autoFocusShot = visible && !!resolution && isSuccess && excellentPresentation && autoFocusShotActive;

  return {
    showShutterGuide,
    showVoiceCaption,
    voiceCaptionText,
    showRetryPulse,
    showSuccessFlash,
    autoFocusShot,
    showDisasterFragmentBreak,
    animatedRoundDelta,
  };
}
