import type { Outcome } from '../core/game/types';

export type ResultPatternKey = 'normal' | 'success' | 'meh' | 'fail' | 'disaster';
export type ResultPatternImage = string | string[] | null;

export const resultPatternImageMap: Record<ResultPatternKey, ResultPatternImage> = {
  normal: '/assets/images/results/pattern-1-normal.png',
  success: '/assets/images/results/pattern-2-success.png',
  meh: [
    '/assets/images/results/pattern-3-meh.png',
    '/assets/images/results/pattern-3-meh-alt.png',
    '/assets/images/results/pattern-3-meh-3.png',
    '/assets/images/results/pattern-3-meh-4.png',
    '/assets/images/results/pattern-3-meh-5.png',
    '/assets/images/results/pattern-3-meh-6.png',
  ],
  fail: [
    '/assets/images/results/pattern-4-fail.png',
    '/assets/images/results/pattern-4-fail-alt.png',
    '/assets/images/results/pattern-4-fail-3.png',
  ],
  disaster: [
    '/assets/images/results/pattern-5-disaster.png',
    '/assets/images/results/pattern-5-disaster-alt.png',
    '/assets/images/results/pattern-5-disaster-3.png',
    '/assets/images/results/pattern-5-disaster-4.png',
    '/assets/images/results/pattern-5-disaster-5.png',
  ],
};

export function pickResultImage(image: ResultPatternImage): string | null {
  if (!image) {
    return null;
  }
  if (Array.isArray(image)) {
    if (image.length === 0) {
      return null;
    }
    return image[Math.floor(Math.random() * image.length)] ?? null;
  }
  return image;
}

export const outcomeToPatternKey: Record<Outcome, ResultPatternKey> = {
  normal: 'normal',
  success: 'success',
  bad: 'meh',
  disaster: 'disaster',
};
