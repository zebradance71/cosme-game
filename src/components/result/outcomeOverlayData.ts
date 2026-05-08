import type { SkinType } from '../../core/game/types';

export interface SkinMetric {
  label: '水分' | 'キメ' | '毛穴' | '赤み';
  value: number;
}

export interface OverlayStat {
  label: string;
  value: string;
}

export interface FailData {
  scoreCrash: number;
  stats: OverlayStat[];
}

export interface DisasterData {
  scoreLabel: string;
  stats: OverlayStat[];
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clampMetric(value: number): number {
  return Math.max(10, Math.min(99, value));
}

export function pickVoiceCaption(seed: string, outcome: 'normal' | 'success' | 'bad' | 'disaster'): string {
  const pool: Record<typeof outcome, string[]> = {
    normal: ['ふぅ', 'すんっ', '通常運転'],
    success: ['ピカーン', 'つやぁん', 'きらん'],
    bad: ['うわっ', 'あれっ', 'ぬめっ'],
    disaster: ['ガーン', 'ドーン', 'ぎゃーん'],
  };
  const candidates = pool[outcome];
  const index = hashString(`${seed}-${outcome}-voice`) % candidates.length;
  return candidates[index] ?? '';
}

export function buildNormalMetrics(seed: string, skinType: SkinType | null): SkinMetric[] {
  const bases: SkinMetric[] = [
    { label: '水分', value: 84 },
    { label: 'キメ', value: 86 },
    { label: '毛穴', value: 82 },
    { label: '赤み', value: 20 },
  ];
  const typeBiasMap: Record<SkinType, [number, number, number, number]> = {
    dry: [6, 2, -2, 1],
    oily: [-6, -1, -5, 3],
    sensitive: [-4, -3, -1, 10],
    pores: [-2, -2, -10, 4],
  };
  const bias = skinType ? typeBiasMap[skinType] : [0, 0, 0, 0];

  return bases.map((base, index) => {
    const mix = hashString(`${seed || 'base'}-${base.label}-${skinType ?? 'none'}`);
    const swing = (mix % 9) - 4;
    return {
      ...base,
      value: clampMetric(base.value + bias[index] + swing),
    };
  });
}

export function buildSuccessRank(seed: string): string {
  const ranks = ['GLOWBURST', 'RADIANT', 'PERFECT SKIN', 'ASCENDED'] as const;
  const pick = hashString(`${seed}-success-rank`) % ranks.length;
  return ranks[pick] ?? 'GLOWBURST';
}

export function buildSuccessStats(seed: string): OverlayStat[] {
  const glow = 260 + (hashString(`${seed}-glow`) % 81);
  const poreCut = 90 + (hashString(`${seed}-pore`) % 8);
  const comboLv = 90 + (hashString(`${seed}-lv`) % 10);
  return [
    { label: '水分', value: 'MAX' },
    { label: '毛穴', value: `-${poreCut}%` },
    { label: 'ツヤ', value: `+${glow}%` },
    { label: '発光', value: `Lv.${comboLv}` },
  ];
}

export function buildMehRank(seed: string): string {
  const ranks = ['CLOSE', 'ALMOST', 'MID SKIN', 'NOT BAD', '...OK'] as const;
  const pick = hashString(`${seed}-meh-rank`) % ranks.length;
  return ranks[pick] ?? 'ALMOST';
}

export function buildMehStats(seed: string): OverlayStat[] {
  const redness = 14 + (hashString(`${seed}-meh-red`) % 12);
  const pores = 4 + (hashString(`${seed}-meh-pore`) % 8);
  const hydrationLoss = 6 + (hashString(`${seed}-meh-hyd`) % 8);
  const inflameLevel = ['LOW', 'L-LOW', 'LOW+'][hashString(`${seed}-meh-inf`) % 3] ?? 'LOW';
  return [
    { label: '赤み', value: `+${redness}%` },
    { label: '毛穴', value: `+${pores}%` },
    { label: '水分', value: `-${hydrationLoss}%` },
    { label: '炎症', value: inflameLevel },
  ];
}

export function buildFailRank(seed: string): string {
  const ranks = ['OVERHEAT', 'SKIN DAMAGE', 'BAD REACTION', 'CRITICAL', 'MELTDOWN'] as const;
  const pick = hashString(`${seed}-fail-rank`) % ranks.length;
  return ranks[pick] ?? 'CRITICAL';
}

export function buildFailStats(seed: string): FailData {
  const redness = 380 + (hashString(`${seed}-fail-red`) % 61);
  const hydrationLoss = 72 + (hashString(`${seed}-fail-hyd`) % 15);
  const tempTag = ['MAX', 'MAX+', 'OVER MAX'][hashString(`${seed}-fail-temp`) % 3] ?? 'MAX';
  const scoreCrash = -(180 + (hashString(`${seed}-fail-score`) % 141));
  return {
    scoreCrash,
    stats: [
      { label: '赤み', value: `+${redness}%` },
      { label: '炎症', value: 'HIGH' },
      { label: '水分', value: `-${hydrationLoss}%` },
      { label: '肌温度', value: tempTag },
    ],
  };
}

export function buildDisasterRank(seed: string): string {
  const ranks = ['SKIN COLLAPSE', 'DISASTER', 'PORE APOCALYPSE', 'MELTDOWN', 'SYSTEM FAILURE'] as const;
  const pick = hashString(`${seed}-disaster-rank`) % ranks.length;
  return ranks[pick] ?? 'DISASTER';
}

export function buildDisasterData(seed: string): DisasterData {
  const scoreLabelPool = ['-999', '-1200', '-404 SKIN'] as const;
  const scoreLabel = scoreLabelPool[hashString(`${seed}-disaster-score`) % scoreLabelPool.length] ?? '-999';
  return {
    scoreLabel,
    stats: [
      { label: '毛穴', value: '+999%' },
      { label: '炎症', value: 'CRITICAL' },
      { label: '水分', value: 'LOST' },
      { label: '肌構造', value: 'ERROR' },
      { label: '皮脂', value: 'OVERFLOW' },
    ],
  };
}
