import { useEffect, useState } from 'react';
import type { Outcome, Resolution } from '../../core/game/types';
import { pickVoiceCaption } from './outcomeOverlayData';

interface UseOutcomeOverlayEffectsParams {
  visible: boolean;
  resolution: Resolution | null;
  isSuccess: boolean;
  isDisaster: boolean;
  totalScore: number;
}

export function useOutcomeOverlayEffects({
  visible,
  resolution,
  isSuccess,
  isDisaster,
  totalScore,
}: UseOutcomeOverlayEffectsParams) {
  const [showShutterGuide, setShowShutterGuide] = useState(false);
  const [showVoiceCaption, setShowVoiceCaption] = useState(false);
  const [voiceCaptionText, setVoiceCaptionText] = useState('');
  const [showRetryPulse, setShowRetryPulse] = useState(false);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const [autoFocusShotActive, setAutoFocusShotActive] = useState(false);
  const [showDisasterFragmentBreak, setShowDisasterFragmentBreak] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(totalScore);

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
    setVoiceCaptionText(pickVoiceCaption(resolution.headline, resolution.outcome as Outcome));

    const shutterTimer = window.setTimeout(() => setShowShutterGuide(false), 800);
    const captionTimer = window.setTimeout(() => setShowVoiceCaption(false), 600);
    const pulseTimer = window.setTimeout(() => setShowRetryPulse(true), 3000);
    return () => {
      window.clearTimeout(shutterTimer);
      window.clearTimeout(captionTimer);
      window.clearTimeout(pulseTimer);
    };
  }, [visible, resolution]);

  useEffect(() => {
    if (!visible || !resolution || !isSuccess) {
      setAnimatedScore(totalScore);
      return;
    }
    const start = Math.max(0, totalScore - Math.max(0, resolution.scoreDelta));
    const end = totalScore;
    const duration = 650;
    const startedAt = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setAnimatedScore(Math.round(start + (end - start) * eased));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    setAnimatedScore(start);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible, resolution, totalScore, isSuccess]);

  useEffect(() => {
    if (!visible || !resolution || !isSuccess) {
      setShowSuccessFlash(false);
      return;
    }
    setShowSuccessFlash(true);
    const timer = window.setTimeout(() => setShowSuccessFlash(false), 420);
    return () => window.clearTimeout(timer);
  }, [visible, resolution, isSuccess]);

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
    if (!visible || !resolution || !isSuccess) return;
    setAutoFocusShotActive(true);
    const timer = window.setTimeout(() => setAutoFocusShotActive(false), 1100);
    return () => window.clearTimeout(timer);
  }, [visible, resolution, isSuccess]);

  const autoFocusShot = visible && !!resolution && isSuccess && autoFocusShotActive;

  return {
    showShutterGuide,
    showVoiceCaption,
    voiceCaptionText,
    showRetryPulse,
    showSuccessFlash,
    autoFocusShot,
    showDisasterFragmentBreak,
    animatedScore,
  };
}
