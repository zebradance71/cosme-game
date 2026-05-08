import { effectCopies } from '../../data/effects';
import { scoreOutcome } from './scoring';
import type { Resolution, SerumType, SkinType } from './types';

interface OutcomeWeights {
  normal: number;
  success: number;
  bad: number;
  disaster: number;
}

function clampWeight(value: number): number {
  return Math.max(1, Math.round(value));
}

function weightedPick(weights: OutcomeWeights): keyof OutcomeWeights {
  const entries = Object.entries(weights) as Array<[keyof OutcomeWeights, number]>;
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  let threshold = Math.random() * total;
  for (const [key, weight] of entries) {
    threshold -= weight;
    if (threshold <= 0) {
      return key;
    }
  }
  return 'bad';
}

function weightedPickIndex(weights: number[]): number {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let threshold = Math.random() * total;
  for (let index = 0; index < weights.length; index += 1) {
    threshold -= weights[index] ?? 0;
    if (threshold <= 0) {
      return index;
    }
  }
  return 0;
}

function buildOutcomeWeights(skin: SkinType, serum: SerumType): OutcomeWeights {
  const weights: OutcomeWeights = {
    normal: 1,
    success: 18,
    bad: 60,
    disaster: 21,
  };

  // 納得感の芯だけ残しつつ、演出のランダム性を優先。
  if (skin === 'sensitive' && (serum === 'retinol' || serum === 'aha_bha')) {
    weights.success -= 12;
    weights.bad += 8;
    weights.disaster += 12;
  }
  if (skin === 'dry' && serum === 'ceramide') {
    weights.success += 20;
    weights.bad -= 10;
    weights.disaster -= 9;
  }
  if (skin === 'oily' && (serum === 'aha_bha' || serum === 'niacinamide')) {
    weights.success += 18;
    weights.bad -= 10;
    weights.disaster -= 7;
  }
  if (skin === 'pores' && (serum === 'aha_bha' || serum === 'niacinamide')) {
    weights.success += 18;
    weights.bad -= 10;
    weights.disaster -= 7;
  }

  weights.normal = clampWeight(weights.normal);
  weights.success = clampWeight(weights.success);
  weights.bad = clampWeight(weights.bad);
  weights.disaster = clampWeight(weights.disaster);
  return weights;
}

function pickVariant(outcome: keyof OutcomeWeights) {
  const variants = effectCopies[outcome];
  if (variants.length === 0) {
    return { reactionKey: 'fallback', headline: '判定中', detail: '演出データが見つかりません。' };
  }
  if (outcome === 'bad') {
    // bad全体を「微妙30% / BAD30%」に寄せるため、bad内を50:50で分割する。
    // oilFlash -> 微妙, redAlert/dryCrack -> BAD（UI側分岐）
    const keyedWeights = variants.map((variant) => {
      if (variant.reactionKey === 'oilFlash') {
        return 50;
      }
      if (variant.reactionKey === 'redAlert') {
        return 35;
      }
      if (variant.reactionKey === 'dryCrack') {
        return 15;
      }
      return 5;
    });
    return variants[weightedPickIndex(keyedWeights)] ?? variants[0];
  }
  return variants[Math.floor(Math.random() * variants.length)] ?? variants[0];
}

export function resolveSerumEffect(skin: SkinType, serum: SerumType): Resolution {
  const outcome = weightedPick(buildOutcomeWeights(skin, serum));
  const scoreDelta = scoreOutcome(outcome);
  const variant = pickVariant(outcome);

  return {
    outcome,
    scoreDelta,
    reactionKey: variant.reactionKey,
    headline: variant.headline,
    detail: variant.detail,
  };
}
