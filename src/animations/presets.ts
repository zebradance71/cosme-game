import type { Outcome, Phase } from '../core/game/types';

export interface StageEffectPreset {
  stageClass: string;
  badge: string;
}

export const phaseClassMap: Record<Phase, string> = {
  idle: 'phase-idle',
  skinRevealed: 'phase-skin-revealed',
  serumSelected: 'phase-serum-selected',
  applying: 'phase-applying',
  resolved: 'phase-resolved',
  resultShown: 'phase-result-shown',
};

export const outcomePresets: Record<Outcome, StageEffectPreset> = {
  normal: { stageClass: 'outcome-normal', badge: 'NORMAL' },
  success: { stageClass: 'outcome-success', badge: 'SUCCESS' },
  bad: { stageClass: 'outcome-bad', badge: 'BAD' },
  disaster: { stageClass: 'outcome-disaster', badge: 'DISASTER' },
};
