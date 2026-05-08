import clsx from 'clsx';
import { phaseClassMap, outcomePresets } from '../../animations/presets';
import type { Outcome, Phase } from '../../core/game/types';

interface SkinStageProps {
  phase: Phase;
  outcome: Outcome | null;
  reactionKey: string | null;
  peakLock: boolean;
  dailyVariantClass: string;
}

export function SkinStage({ phase, outcome, reactionKey, peakLock, dailyVariantClass }: SkinStageProps) {
  const outcomeClass = outcome ? outcomePresets[outcome].stageClass : '';
  const reactionClass = reactionKey ? `reaction-${reactionKey}` : '';
  const isDisaster = outcome === 'disaster';

  return (
    <section
      className={clsx(
        'skin-stage',
        phaseClassMap[phase],
        outcomeClass,
        reactionClass,
        dailyVariantClass,
        peakLock && 'peak-lock',
      )}
    >
      <div className="face-orb" />
      <div className="water-drop water-drop-a" />
      <div className="water-drop water-drop-b" />
      <div className="spark spark-a" />
      <div className="spark spark-b" />
      {isDisaster ? (
        <>
          <div className="falling-bottle" aria-hidden>
            !
          </div>
          <p className="abyss-text">バリア機能崩壊</p>
        </>
      ) : null}
    </section>
  );
}
