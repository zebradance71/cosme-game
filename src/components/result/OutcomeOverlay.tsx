import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import type { Resolution, SkinType } from '../../core/game/types';
import { outcomeToPatternKey, pickResultImage, resultPatternImageMap } from '../../data/resultVisuals';
import {
  DisasterOutcomePanel,
  FailOutcomePanel,
  FallbackOutcomePanel,
  MehOutcomePanel,
  NormalOutcomePanel,
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
  buildSuccessRank,
  buildSuccessStats,
} from './outcomeOverlayData';
import { useOutcomeOverlayEffects } from './useOutcomeOverlayEffects';

interface OutcomeOverlayProps {
  resolution: Resolution | null;
  visible: boolean;
  totalScore: number;
  dailySkinCode: string;
  dailySeed: string;
  skinType: SkinType | null;
  dailyVariantClass: string;
  comboCutIn: boolean;
  successStreak: number;
  onRetry: () => void;
}

export function OutcomeOverlay({
  resolution,
  visible,
  totalScore,
  dailySkinCode,
  dailySeed,
  skinType,
  dailyVariantClass,
  comboCutIn,
  successStreak,
  onRetry,
}: OutcomeOverlayProps) {
  const basePatternKey = resolution ? outcomeToPatternKey[resolution.outcome] : 'normal';
  const patternKey =
    resolution?.outcome === 'bad' &&
    (resolution.reactionKey === 'redAlert' || resolution.reactionKey === 'dryCrack')
      ? 'fail'
      : basePatternKey;
  const resultImagePath = useMemo(
    () => pickResultImage(resultPatternImageMap[patternKey]),
    [patternKey],
  );
  const isNormal = patternKey === 'normal';
  const isSuccess = patternKey === 'success';
  const isMeh = patternKey === 'meh';
  const isFail = patternKey === 'fail';
  const isDisaster = patternKey === 'disaster';

  const normalStatuses = buildNormalMetrics(dailySeed, skinType);
  const successRank = buildSuccessRank(dailySeed);
  const successStats = buildSuccessStats(dailySeed);
  const mehRank = buildMehRank(dailySeed);
  const mehStats = buildMehStats(dailySeed);
  const failRank = buildFailRank(dailySeed);
  const failData = buildFailStats(dailySeed);
  const disasterRank = buildDisasterRank(dailySeed);
  const disasterData = buildDisasterData(dailySeed);

  const {
    showShutterGuide,
    showVoiceCaption,
    voiceCaptionText,
    showRetryPulse,
    showSuccessFlash,
    autoFocusShot,
    showDisasterFragmentBreak,
    animatedScore,
  } = useOutcomeOverlayEffects({
    visible,
    resolution,
    isSuccess,
    isDisaster,
    totalScore,
  });

  return (
    <AnimatePresence>
      {visible && resolution ? (
        <motion.div
          className={`outcome-overlay ${resolution.outcome} ${(isNormal || isSuccess) ? 'screenshot-focus' : ''} ${isSuccess && autoFocusShot ? 'auto-focus-shot' : ''} ${isDisaster && showDisasterFragmentBreak ? 'disaster-fragment-break' : ''}`}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
        >
          {(isNormal || isSuccess) ? (
            <div className="screenshot-sparkles" aria-hidden>
              <span className="screenshot-spark screenshot-spark-a" />
              <span className="screenshot-spark screenshot-spark-b" />
              <span className="screenshot-spark screenshot-spark-c" />
            </div>
          ) : null}
          {isSuccess ? (
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
            <NormalOutcomePanel resultImagePath={resultImagePath} totalScore={totalScore} normalStatuses={normalStatuses} />
          ) : isSuccess ? (
            <SuccessOutcomePanel
              resultImagePath={resultImagePath}
              showSuccessFlash={showSuccessFlash}
              successRank={successRank}
              animatedScore={animatedScore}
              successStats={successStats}
              successStreak={successStreak}
              dailySeed={dailySeed}
              totalScore={totalScore}
            />
          ) : isMeh ? (
            <MehOutcomePanel
              resultImagePath={resultImagePath}
              mehRank={mehRank}
              mehStats={mehStats}
              scoreDelta={resolution.scoreDelta}
            />
          ) : isFail ? (
            <FailOutcomePanel resultImagePath={resultImagePath} failRank={failRank} failData={failData} dailySeed={dailySeed} />
          ) : isDisaster ? (
            <DisasterOutcomePanel
              resultImagePath={resultImagePath}
              disasterRank={disasterRank}
              disasterData={disasterData}
              dailySeed={dailySeed}
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
            className={`primary-button retry-button result-ui-controls ${showRetryPulse ? 'cta-pulse' : ''} ${isSuccess ? 'success-retry-button' : ''} ${isFail ? 'fail-retry-button' : ''} ${isDisaster ? 'disaster-retry-button' : ''}`}
            onClick={onRetry}
          >
            もう1回やる
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
