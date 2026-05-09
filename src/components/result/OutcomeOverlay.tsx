import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Resolution, SkinType } from '../../core/game/types';
import { outcomeToPatternKey, pickResultImage, rareResultImagePool, resultPatternImageMap } from '../../data/resultVisuals';
import {
  DisasterOutcomePanel,
  FailOutcomePanel,
  FallbackOutcomePanel,
  MehOutcomePanel,
  NormalOutcomePanel,
  RareExcellentOutcomePanel,
  SuccessOutcomePanel,
} from './OutcomeOverlayPanels';
import {
  buildDisasterData,
  buildDisasterRank,
  buildFailRank,
  buildFailStats,
  buildMehRank,
  buildMehStats,
  buildNormalMetrics,
  buildRareSuccessStats,
  buildSuccessRank,
  buildSuccessStats,
} from './outcomeOverlayData';
import { useOutcomeOverlayEffects } from './useOutcomeOverlayEffects';

interface OutcomeOverlayProps {
  resolution: Resolution | null;
  visible: boolean;
  dailySkinCode: string;
  dailySeed: string;
  skinType: SkinType | null;
  dailyVariantClass: string;
  comboCutIn: boolean;
  successStreak: number;
  rareResultActive: boolean;
  onRetry: () => void;
}

export function OutcomeOverlay({
  resolution,
  visible,
  dailySkinCode,
  dailySeed,
  skinType,
  dailyVariantClass,
  comboCutIn,
  successStreak,
  rareResultActive,
  onRetry,
}: OutcomeOverlayProps) {
  const [freezeMotion, setFreezeMotion] = useState(false);
  const [fadeMotion, setFadeMotion] = useState(false);
  useEffect(() => {
    if (!visible || !resolution) {
      return;
    }
    const fadeTimer = window.setTimeout(() => {
      setFadeMotion(true);
    }, 2000);
    const freezeTimer = window.setTimeout(() => {
      setFreezeMotion(true);
    }, 2400);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(freezeTimer);
    };
  }, [visible, resolution]);
  const motionState: 'active' | 'fading' | 'frozen' = freezeMotion ? 'frozen' : fadeMotion ? 'fading' : 'active';

  const basePatternKey = resolution ? outcomeToPatternKey[resolution.outcome] : 'normal';
  const patternKey =
    resolution?.outcome === 'bad' &&
    (resolution.reactionKey === 'redAlert' || resolution.reactionKey === 'dryCrack')
      ? 'fail'
      : basePatternKey;
  const resultImagePath = useMemo(
    () => pickResultImage(rareResultActive ? rareResultImagePool : resultPatternImageMap[patternKey]),
    [patternKey, rareResultActive],
  );
  const isRareDisplay = rareResultActive;
  const isPlainSuccess = patternKey === 'success' && !isRareDisplay;
  /* 非レア SUCCESS もレアと同じ .success カード（黄系）。レイアウトは NORMAL と gameplay で共有 */
  const overlayToneClass = isRareDisplay || isPlainSuccess ? 'success' : (resolution?.outcome ?? 'normal');
  const isNormal = !isRareDisplay && patternKey === 'normal';
  const isSuccess = isRareDisplay || patternKey === 'success';
  const isMeh = !isRareDisplay && patternKey === 'meh';
  const isFail = !isRareDisplay && patternKey === 'fail';
  const isDisaster = !isRareDisplay && patternKey === 'disaster';

  const roundScoreDelta = resolution?.scoreDelta ?? 0;
  const normalStatuses = buildNormalMetrics(dailySeed, skinType, roundScoreDelta);
  const successRank = buildSuccessRank(dailySeed);
  const successStats = buildSuccessStats(dailySeed, roundScoreDelta);
  const rareSuccessStats = useMemo(() => buildRareSuccessStats(roundScoreDelta), [roundScoreDelta]);
  const mehRank = buildMehRank(dailySeed);
  const mehStats = buildMehStats(dailySeed, roundScoreDelta);
  const failRank = buildFailRank(dailySeed);
  const failData = buildFailStats(dailySeed, roundScoreDelta);
  const disasterRank = buildDisasterRank(dailySeed);
  const disasterData = buildDisasterData(dailySeed, roundScoreDelta);

  const {
    showShutterGuide,
    showVoiceCaption,
    voiceCaptionText,
    showRetryPulse,
    autoFocusShot,
    showDisasterFragmentBreak,
    animatedRoundDelta,
  } = useOutcomeOverlayEffects({
    visible,
    resolution,
    isSuccess,
    excellentPresentation: isRareDisplay,
    isDisaster,
  });

  return (
    <AnimatePresence>
      {visible && resolution ? (
        <motion.div
          className={`outcome-overlay ${overlayToneClass} ${isRareDisplay ? 'rare-outcome excellent-only' : ''} ${fadeMotion ? 'motion-fade' : ''} ${freezeMotion ? 'freeze-motion' : ''} ${(isNormal || isRareDisplay) ? 'screenshot-focus' : ''} ${isRareDisplay && autoFocusShot ? 'auto-focus-shot' : ''} ${isDisaster && showDisasterFragmentBreak ? 'disaster-fragment-break' : ''}`}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
        >
          {(isNormal || isRareDisplay) ? (
            <div className="screenshot-sparkles" aria-hidden>
              <span className="screenshot-spark screenshot-spark-a" />
              <span className="screenshot-spark screenshot-spark-b" />
              <span className="screenshot-spark screenshot-spark-c" />
            </div>
          ) : null}
          {isRareDisplay ? (
            <div className={`story-crop-guide ${autoFocusShot ? 'active' : ''}`} aria-hidden>
              <div className="story-crop-corners">
                <span className="crop-corner tl" />
                <span className="crop-corner tr" />
                <span className="crop-corner bl" />
                <span className="crop-corner br" />
              </div>
            </div>
          ) : null}
          {isNormal ? (
            <NormalOutcomePanel
              resultImagePath={resultImagePath}
              animatedRoundDelta={animatedRoundDelta}
              dailySeed={dailySeed}
              metrics={normalStatuses.map((s) => ({ label: s.label, value: s.value }))}
              rankMain="NORMAL"
              rankSubPair={['CLEAN', 'STABLE']}
              accent="neutral"
              comboStreak={successStreak}
              motionState={motionState}
            />
          ) : isRareDisplay ? (
            <RareExcellentOutcomePanel
              resultImagePath={resultImagePath}
              animatedRoundDelta={animatedRoundDelta}
              successStreak={successStreak}
              dailySeed={dailySeed}
              motionState={motionState}
              rareStats={rareSuccessStats}
            />
          ) : isSuccess ? (
            <SuccessOutcomePanel
              resultImagePath={resultImagePath}
              successRank={successRank}
              successSubtitle="STEADY ROUTINE"
              successStats={successStats}
              animatedRoundDelta={animatedRoundDelta}
              dailySeed={dailySeed}
              successStreak={successStreak}
              motionState={motionState}
            />
          ) : isMeh ? (
            <MehOutcomePanel
              resultImagePath={resultImagePath}
              mehRank={mehRank}
              mehStats={mehStats}
              animatedRoundDelta={animatedRoundDelta}
              dailySeed={dailySeed}
              motionState={motionState}
            />
          ) : isFail ? (
            <FailOutcomePanel
              resultImagePath={resultImagePath}
              failRank={failRank}
              failData={failData}
              dailySeed={dailySeed}
              animatedRoundDelta={animatedRoundDelta}
              motionState={motionState}
            />
          ) : isDisaster ? (
            <DisasterOutcomePanel
              resultImagePath={resultImagePath}
              disasterRank={disasterRank}
              disasterData={disasterData}
              dailySeed={dailySeed}
              animatedRoundDelta={animatedRoundDelta}
              motionState={motionState}
            />
          ) : (
            <FallbackOutcomePanel
              resultImagePath={resultImagePath}
              resolution={resolution}
              patternKey={patternKey}
              comboCutIn={comboCutIn}
              showShutterGuide={showShutterGuide}
              showVoiceCaption={showVoiceCaption}
              voiceCaptionText={voiceCaptionText}
              dailyVariantClass={dailyVariantClass}
              dailySkinCode={dailySkinCode}
              successStreak={successStreak}
            />
          )}

          <button
            type="button"
            className={`primary-button retry-button result-ui-controls ${showRetryPulse ? 'cta-pulse' : ''} ${isRareDisplay ? 'success-retry-button' : ''} ${isFail ? 'fail-retry-button' : ''} ${isDisaster ? 'disaster-retry-button' : ''}`}
            onClick={onRetry}
          >
            もう1回やる
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
