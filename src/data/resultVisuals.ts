import type { Outcome } from '../core/game/types';

export type ResultPatternKey = 'normal' | 'success' | 'meh' | 'fail' | 'disaster';
export type ResultPatternImage = string | readonly string[] | null;
export const rareResultImagePool: readonly string[] = [
  '/assets/images/results/rare/ssr-mirror-error.png',
  '/assets/images/results/rare/ssr-cosmic-skin.png',
  '/assets/images/results/rare/ssr-devil-mode.png',
  '/assets/images/results/rare/ssr-glass-skin.png',
  '/assets/images/results/rare/ssr-over-hydration.png',
  '/assets/images/results/rare/ssr-ascended.png',
  '/assets/images/results/rare/ssr-angel-filter.png',
] as const;

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
  if (typeof image === 'string') {
    return image;
  }
  if (image.length === 0) {
    return null;
  }
  return image[Math.floor(Math.random() * image.length)] ?? null;
}

export const outcomeToPatternKey: Record<Outcome, ResultPatternKey> = {
  normal: 'normal',
  success: 'success',
  bad: 'meh',
  disaster: 'disaster',
};
