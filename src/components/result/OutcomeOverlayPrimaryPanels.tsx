import type { OverlayStat } from './outcomeOverlayData';
import { formatRoundDeltaForResult } from './roundScoreDisplay';

interface PanelCommonProps {
  resultImagePath: string | null;
  motionState?: 'active' | 'fading' | 'frozen';
}

export type OutcomeMetricRow = {
  label: string;
  value: string | number;
};

interface NormalOutcomePanelProps extends PanelCommonProps {
  /** 今回の増減（0 からカウント中）。HUD への加算値と同じ */
  animatedRoundDelta: number;
  dailySeed: string;
  /** NORMAL / 非レア SUCCESS で同じマークアップ */
  metrics: OutcomeMetricRow[];
  rankMain: string;
  rankSubPair: readonly [string, string];
  /** 配色のみ success 寄せ（レイアウトは neutral と同一） */
  accent?: 'neutral' | 'success';
  comboStreak?: number;
}

export function NormalOutcomePanel({
  resultImagePath,
  animatedRoundDelta,
  dailySeed,
  metrics,
  rankMain,
  rankSubPair,
  accent = 'neutral',
  comboStreak = 0,
  motionState = 'active',
}: NormalOutcomePanelProps) {
  const isActive = motionState === 'active';
  return (
    <>
      <div className="result-visual-frame normal-visual-frame">
        <div className="normal-particles" aria-hidden>
          <span className="normal-particle normal-particle-a" />
          <span className="normal-particle normal-particle-b" />
          <span className="normal-particle normal-particle-c" />
          <span className="normal-particle normal-particle-d" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt={accent === 'success' ? 'success結果' : 'normal結果'}
            className={`result-visual-image normal-visual-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="normal-rank-block">
        <p className="normal-rank-main">{rankMain}</p>
        <p className="normal-rank-sub">
          {rankSubPair[0]} {rankSubPair[1]}
        </p>
      </div>
      <div className="normal-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="normal-status-grid">
        {metrics.map((status) => (
          <div key={status.label} className="normal-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
      {comboStreak > 0 ? <p className="normal-combo-tag">COMBO x{comboStreak}</p> : null}
    </>
  );
}

interface MehPanelProps extends PanelCommonProps {
  mehRank: string;
  mehStats: OverlayStat[];
  animatedRoundDelta: number;
  dailySeed: string;
}

export function MehOutcomePanel({
  resultImagePath,
  mehRank,
  mehStats,
  animatedRoundDelta,
  dailySeed,
  motionState = 'active',
}: MehPanelProps) {
  const isActive = motionState === 'active';
  return (
    <>
      <div className="result-visual-frame meh-visual-frame">
        <div className="meh-noise-layer" aria-hidden />
        <div className="meh-glitch-line meh-glitch-a" aria-hidden />
        <div className="meh-glitch-line meh-glitch-b" aria-hidden />
        <div className="meh-particles" aria-hidden>
          <span className="meh-particle meh-particle-a" />
          <span className="meh-particle meh-particle-b" />
          <span className="meh-particle meh-particle-c" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt="meh結果"
            className={`result-visual-image meh-visual-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="meh-rank-block">
        <p className="meh-rank-main">{mehRank}</p>
        <p className="meh-rank-sub">ALMOST STABLE</p>
      </div>
      <div className="meh-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="meh-status-grid">
        {mehStats.map((status) => (
          <div key={status.label} className="meh-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

interface SuccessOutcomePanelProps extends PanelCommonProps {
  successRank: string;
  /** MELTDOWN の SEVERE REACTION と同じく 1 行のサブ見出し */
  successSubtitle?: string;
  successStats: OverlayStat[];
  animatedRoundDelta: number;
  dailySeed: string;
  successStreak: number;
}

/**
 * 非レア SUCCESS: Fail / Disaster / Meh と同じブロック構造（画像→大見出し→1行サブ→スコア帯→2x2）
 * 配色は gameplay.css で濃いカード＋金ネオンに寄せる
 */
export function SuccessOutcomePanel({
  resultImagePath,
  successRank,
  successSubtitle = 'STEADY ROUTINE',
  successStats,
  animatedRoundDelta,
  dailySeed,
  successStreak,
  motionState = 'active',
}: SuccessOutcomePanelProps) {
  const isActive = motionState === 'active';
  return (
    <>
      <div className="result-visual-frame success-visual-frame">
        <div className="success-aura" aria-hidden />
        <div className="success-particles" aria-hidden>
          <span className="success-particle success-particle-a" />
          <span className="success-particle success-particle-b" />
          <span className="success-particle success-particle-c" />
          <span className="success-particle success-particle-d" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt="success結果"
            className={`result-visual-image success-visual-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="success-rank-block">
        <p className="success-rank-main">{successRank}</p>
        <p className="success-rank-sub">{successSubtitle}</p>
      </div>
      <div className="success-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="success-status-grid">
        {successStats.map((status) => (
          <div key={status.label} className="success-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
      {successStreak > 0 ? <p className="success-combo-tag">COMBO x{successStreak}</p> : null}
    </>
  );
}

interface RareExcellentPanelProps extends PanelCommonProps {
  animatedRoundDelta: number;
  successStreak: number;
  dailySeed: string;
  motionState?: 'active' | 'fading' | 'frozen';
  rareStats: OverlayStat[];
}

export function RareExcellentOutcomePanel({
  resultImagePath,
  animatedRoundDelta,
  successStreak,
  dailySeed,
  motionState = 'active',
  rareStats,
}: RareExcellentPanelProps) {
  const isActive = motionState === 'active';
  return (
    <div className="rare-excellent-panel">
      <div className="result-visual-frame rare-excellent-visual-frame">
        <div className="rare-excellent-flare" aria-hidden />
        <div className="rare-excellent-particles" aria-hidden>
          <span className="rare-excellent-particle rare-excellent-particle-a" />
          <span className="rare-excellent-particle rare-excellent-particle-b" />
          <span className="rare-excellent-particle rare-excellent-particle-c" />
          <span className="rare-excellent-particle rare-excellent-particle-d" />
        </div>
        {resultImagePath ? (
          <img
            src={resultImagePath}
            alt="rare-excellent結果"
            className={`result-visual-image rare-excellent-image ${isActive ? 'is-motion-active' : 'is-motion-static'}`}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="rare-excellent-rank-block">
        <p className="rare-excellent-rank-main">EXCELLENT</p>
        <p className="rare-excellent-rank-sub">RARE ASCENSION</p>
      </div>
      <div className="rare-excellent-score-box glass-card">
        <span>今回</span>
        <strong
          key={`${dailySeed}-${animatedRoundDelta}`}
          className={isActive ? 'is-motion-active' : 'is-motion-static'}
        >
          {formatRoundDeltaForResult(animatedRoundDelta)}
        </strong>
      </div>
      <div className="rare-excellent-status-grid">
        {rareStats.map((status) => (
          <div key={status.label} className="rare-excellent-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
      {successStreak > 0 ? <p className="rare-excellent-combo-tag">COMBO x{successStreak}</p> : null}
    </div>
  );
}
