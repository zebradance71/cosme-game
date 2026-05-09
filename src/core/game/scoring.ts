import type { Outcome } from './types';

function randomIntInclusive(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * 1ラウンド分の抽選（`rules.resolveSerumEffect` → `engine.resolveRound` で HUD に加算。
 * 下限 0 クランプ後は `resolution.scoreDelta` が実適用値となり、結果画面も同じ値を表示する）
 *
 * | 結果 | 1ラウンドの増減 |
 * |------|----------------|
 * | normal | 0〜3 |
 * | success | +40〜+120 |
 * | rare（レアコメント時・SUCCESS 時のみ適用） | +500〜+2000（コメントは 3%） |
 * | bad | -10〜-35 |
 * | disaster | -80〜-250 |
 */
export function rollScoreDelta(outcome: Outcome): number {
  switch (outcome) {
    case 'normal':
      return randomIntInclusive(0, 3);
    case 'success':
      return randomIntInclusive(40, 120);
    case 'bad':
      return -randomIntInclusive(10, 35);
    case 'disaster':
      return -randomIntInclusive(80, 250);
    default:
      return 0;
  }
}

/** レア SUCCESS 時のスコア（通常 SUCCESS の抽選のあと差し替え）。+500〜+2000 を整数で一様ランダム */
export function rollRareScoreDelta(): number {
  return randomIntInclusive(500, 2000);
}
