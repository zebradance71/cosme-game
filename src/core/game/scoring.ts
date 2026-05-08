import type { Outcome } from './types';

const scoreMap: Record<Outcome, number> = {
  normal: 20,
  success: 120,
  bad: -40,
  disaster: -120,
};

export function scoreOutcome(outcome: Outcome): number {
  return scoreMap[outcome];
}
