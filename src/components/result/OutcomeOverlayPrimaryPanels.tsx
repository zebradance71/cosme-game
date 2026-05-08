import { motion } from 'framer-motion';
import type { OverlayStat, SkinMetric } from './outcomeOverlayData';

interface PanelCommonProps {
  resultImagePath: string | null;
}

interface NormalPanelProps extends PanelCommonProps {
  totalScore: number;
  normalStatuses: SkinMetric[];
}

export function NormalOutcomePanel({ resultImagePath, totalScore, normalStatuses }: NormalPanelProps) {
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
          <motion.img
            src={resultImagePath}
            alt="normal結果"
            className="result-visual-image"
            initial={{ scale: 1 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="normal-rank-block">
        <p className="normal-rank-main">NORMAL</p>
        <div className="normal-rank-sub">
          <span>CLEAN</span>
          <span>STABLE</span>
        </div>
      </div>
      <div className="normal-score-box glass-card">
        <span>SCORE</span>
        <strong>{totalScore}</strong>
      </div>
      <div className="normal-status-grid">
        {normalStatuses.map((status) => (
          <div key={status.label} className="normal-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
    </>
  );
}

interface SuccessPanelProps extends PanelCommonProps {
  showSuccessFlash: boolean;
  successRank: string;
  animatedScore: number;
  successStats: OverlayStat[];
  successStreak: number;
  dailySeed: string;
  totalScore: number;
}

export function SuccessOutcomePanel({
  resultImagePath,
  showSuccessFlash,
  successRank,
  animatedScore,
  successStats,
  successStreak,
  dailySeed,
  totalScore,
}: SuccessPanelProps) {
  return (
    <>
      <div className="result-visual-frame success-visual-frame">
        <div className={`success-burst-flash ${showSuccessFlash ? 'active' : ''}`} aria-hidden />
        <div className="success-aura" aria-hidden />
        <div className="success-lens-flare" aria-hidden />
        <div className="success-particles" aria-hidden>
          <span className="success-particle success-particle-a" />
          <span className="success-particle success-particle-b" />
          <span className="success-particle success-particle-c" />
          <span className="success-particle success-particle-d" />
          <span className="success-particle success-particle-e" />
          <span className="success-particle success-particle-f" />
          <span className="success-particle success-particle-g" />
          <span className="success-particle success-particle-h" />
        </div>
        {resultImagePath ? (
          <motion.img
            src={resultImagePath}
            alt="success結果"
            className="result-visual-image success-visual-image"
            initial={{ scale: 1, y: 0 }}
            animate={{ scale: 1.08, y: [-3, 4, -3] }}
            transition={{
              scale: { duration: 5.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ) : (
          <div className="normal-fallback-art" />
        )}
      </div>
      <div className="success-rank-block">
        <p className="success-rank-main">{successRank}</p>
        <p className="success-rank-sub">RADIANCE OVERRIDE</p>
      </div>
      <div className="success-score-box glass-card">
        <span>SCORE</span>
        <motion.strong
          key={`${dailySeed}-${totalScore}`}
          initial={{ scale: 0.86, opacity: 0.4, y: 8 }}
          animate={{ scale: [1, 1.14, 0.98, 1], opacity: 1, y: [0, -2, 0, 0] }}
          transition={{ duration: 0.62, times: [0, 0.38, 0.72, 1] }}
        >
          {animatedScore}
        </motion.strong>
      </div>
      <div className="success-status-grid">
        {successStats.map((status) => (
          <div key={status.label} className="success-status-card glass-card">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
      {successStreak > 0 ? <p className="success-combo-tag">COMBO x{successStreak + 1}</p> : null}
    </>
  );
}

interface MehPanelProps extends PanelCommonProps {
  mehRank: string;
  mehStats: OverlayStat[];
  scoreDelta: number;
}

export function MehOutcomePanel({ resultImagePath, mehRank, mehStats, scoreDelta }: MehPanelProps) {
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
          <motion.img
            src={resultImagePath}
            alt="meh結果"
            className="result-visual-image meh-visual-image"
            initial={{ scale: 1.01, y: 0 }}
            animate={{ scale: 1.04, y: [0, 2, 0] }}
            transition={{
              scale: { duration: 6.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' },
              y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
            }}
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
        <span>SCORE SHIFT</span>
        <strong>{scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`}</strong>
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
