import type { Resolution } from '../../core/game/types';
import type { DisasterData, FailData } from './outcomeOverlayData';
import { formatRoundDeltaForResult } from './roundScoreDisplay';

interface PanelCommonProps {
  resultImagePath: string | null;
  motionState?: 'active' | 'fading' | 'frozen';
}

interface FailPanelProps extends PanelCommonProps {
  failRank: string;
  failData: FailData;
  dailySeed: string;
  animatedRoundDelta: number;
}

export function FailOutcomePanel({
  resultImagePath,
  failRank,
  failData,
  dailySeed,
  animatedRoundDelta,
  motionState = 'active',
}: FailPanelProps) {
  const isActive = motionState === 'active';
  return (
    <>
      <div className="result-visual-frame fail-visual-frame">
        <div className="fail-red-pulse" aria-hidden />
        <div className="fail-noise-layer" aria-hidden />
        <div className="fail-warning-line fail-warning-a" aria-hidden />
        <div className="fail-warning-line fail-warning-b" aria-hidden />
        <div className="fail-particles" aria-hidden>
          <span className="fail-particle fail-particle-a" />
          <span className="fail-particle fail-particle-b" />
          <span className="fail-particle fail-particle-c" />
          <span className="fail-particle fail-particle-d" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt="fail結果"
            className={`result-visual-image fail-visual-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="fail-rank-block">
        <p className="fail-rank-main">{failRank}</p>
        <p className="fail-rank-sub">SEVERE REACTION</p>
      </div>
      <div className="fail-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="fail-status-grid">
        {failData.stats.map((status) => (
          <div key={status.label} className="fail-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

interface DisasterPanelProps extends PanelCommonProps {
  disasterRank: string;
  disasterData: DisasterData;
  dailySeed: string;
  animatedRoundDelta: number;
}

export function DisasterOutcomePanel({
  resultImagePath,
  disasterRank,
  disasterData,
  dailySeed,
  animatedRoundDelta,
  motionState = 'active',
}: DisasterPanelProps) {
  const isActive = motionState === 'active';
  return (
    <>
      <div className="result-visual-frame disaster-visual-frame">
        <div className="disaster-rgb-shift" aria-hidden />
        <div className="disaster-noise-layer" aria-hidden />
        <div className="disaster-glitch-bar disaster-glitch-a" aria-hidden />
        <div className="disaster-glitch-bar disaster-glitch-b" aria-hidden />
        <div className="disaster-warning-grid" aria-hidden>
          <span className="disaster-warning-line" />
          <span className="disaster-warning-line" />
          <span className="disaster-warning-line" />
        </div>
        <div className="disaster-particles" aria-hidden>
          <span className="disaster-particle disaster-particle-a" />
          <span className="disaster-particle disaster-particle-b" />
          <span className="disaster-particle disaster-particle-c" />
          <span className="disaster-particle disaster-particle-d" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt="disaster結果"
            className={`result-visual-image disaster-visual-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="disaster-rank-block">
        <p className="disaster-rank-main">{disasterRank}</p>
        <p className="disaster-rank-sub">PORE BREAKDOWN EVENT</p>
      </div>
      <div className="disaster-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="disaster-status-grid">
        {disasterData.stats.map((status) => (
          <div key={status.label} className="disaster-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

interface FallbackPanelProps extends PanelCommonProps {
  resolution: Resolution;
  patternKey: string;
  comboCutIn: boolean;
  showShutterGuide: boolean;
  showVoiceCaption: boolean;
  voiceCaptionText: string;
  dailyVariantClass: string;
  dailySkinCode: string;
  successStreak: number;
}

export function FallbackOutcomePanel({
  resultImagePath,
  resolution,
  patternKey,
  comboCutIn,
  showShutterGuide,
  showVoiceCaption,
  voiceCaptionText,
  dailyVariantClass,
  dailySkinCode,
  successStreak,
}: FallbackPanelProps) {
  return (
    <>
      {resultImagePath ? (
        <div className="result-visual-frame">
          <img src={resultImagePath} alt={`${patternKey}結果`} className="result-visual-image" />
        </div>
      ) : null}
      <p className="micro-label">{resolution.reactionKey}</p>
      {comboCutIn ? <p className="combo-cutin">TRIPLE GLOW COMBO</p> : null}
      {showShutterGuide ? <p className="shutter-guide">今が撮りどき 0.8s</p> : null}
      {showVoiceCaption ? <p className={`voice-caption ${resolution.outcome} ${dailyVariantClass}`}>{voiceCaptionText}</p> : null}
      {dailySkinCode ? <p className="daily-code-tag">{dailySkinCode}</p> : null}
      <h3>{resolution.headline}</h3>
      <p>{resolution.detail}</p>
      {successStreak > 0 ? <p className="streak-hint">コンボ: {successStreak}</p> : null}
    </>
  );
}
