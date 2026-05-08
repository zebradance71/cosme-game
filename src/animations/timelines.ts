import type { Outcome } from '../core/game/types';

export interface TimelineStep {
  label: string;
  ms: number;
}

export const baseTimeline: TimelineStep[] = [
  { label: 'apply', ms: 520 },
  { label: 'resolve', ms: 380 },
];

export const outcomeTimelineBoost: Record<Outcome, number> = {
  normal: 0.84,
  success: 0.94,
  bad: 0.98,
  disaster: 1.04,
};

export function totalTimelineMs(outcome: Outcome): number {
  const base = baseTimeline.reduce((sum, step) => sum + step.ms, 0);
  return Math.round(base * outcomeTimelineBoost[outcome]);
}
