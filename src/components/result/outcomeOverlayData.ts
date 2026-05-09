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
  stats: OverlayStat[];
}

export interface DisasterData {
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

/** headline 等のシード + runCount でボイス文言を決定（完全ランダムにはしない） */
export function pickVoiceCaption(
  seed: string,
  outcome: 'normal' | 'success' | 'bad' | 'disaster',
  runCount: number,
): string {
  const pool: Record<typeof outcome, string[]> = {
    normal: ['ふぅ', 'すんっ', '通常運転'],
    success: ['ピカーン', 'つやぁん', 'きらん'],
    bad: ['うわっ', 'あれっ', 'ぬめっ'],
    disaster: ['ガーン', 'ドーン', 'ぎゃーん'],
  };
  const candidates = pool[outcome];
  const index = hashString(`${seed}-${outcome}-voice-r${runCount}`) % candidates.length;
  return candidates[index] ?? '';
}

export function buildNormalMetrics(
  seed: string,
  skinType: SkinType | null,
  roundScore: number,
  runCount: number,
): SkinMetric[] {
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
    const mix = hashString(
      `${seed || 'base'}-r${runCount}-${base.label}-${skinType ?? 'none'}-n${roundScore}`,
    );
    const swing = (mix % 11) - 5 + Math.min(2, roundScore);
    return {
      ...base,
      value: clampMetric(base.value + bias[index] + swing),
    };
  });
}

export function buildSuccessRank(seed: string, runCount: number): string {
  const ranks = ['GLOWBURST', 'RADIANT', 'PERFECT SKIN', 'ASCENDED'] as const;
  const pick = hashString(`${seed}-r${runCount}-success-rank`) % ranks.length;
  return ranks[pick] ?? 'GLOWBURST';
}

const SUCCESS_SUBTITLES = ['STEADY ROUTINE', 'BALANCED FLOW', 'ROUTINE LOCK', 'BASELINE HOLD'] as const;

export function buildSuccessSubtitle(seed: string, runCount: number): string {
  const pick = hashString(`${seed}-r${runCount}-success-sub`) % SUCCESS_SUBTITLES.length;
  return SUCCESS_SUBTITLES[pick] ?? 'STEADY ROUTINE';
}

export function buildRareSuccessStats(scoreDelta: number, runCount: number): OverlayStat[] {
  const glow = Math.min(
    999,
    260 + (scoreDelta % 740) + (hashString(`rare-glow-${scoreDelta}-r${runCount}`) % 24),
  );
  const pore = Math.min(
    99,
    35 + (scoreDelta % 65) + (hashString(`rare-pore-${scoreDelta}-r${runCount}`) % 9),
  );
  const aura = 180 + (scoreDelta % 500) + (hashString(`rare-aura-${scoreDelta}-r${runCount}`) % 36);
  const grade = scoreDelta >= 1500 ? 'EX+' : 'EX';
  return [
    { label: '輝度', value: `${glow}` },
    { label: '毛穴', value: `-${pore}%` },
    { label: 'オーラ', value: `+${aura}%` },
    { label: '格', value: grade },
  ];
}

export function buildSuccessStats(seed: string, scoreDelta: number, runCount: number): OverlayStat[] {
  const t = (scoreDelta - 40) / 80;
  const glow =
    240 + Math.round(100 * t) + (hashString(`${seed}-r${runCount}-glow-${scoreDelta}`) % 61);
  const poreCut =
    88 + Math.round(7 * t) + (hashString(`${seed}-r${runCount}-pore-${scoreDelta}`) % 10);
  const comboLv =
    88 + Math.round(12 * t) + (hashString(`${seed}-r${runCount}-lv-${scoreDelta}`) % 10);
  return [
    { label: '水分', value: 'MAX' },
    { label: '毛穴', value: `-${poreCut}%` },
    { label: 'ツヤ', value: `+${glow}%` },
    { label: '発光', value: `Lv.${comboLv}` },
  ];
}

export function buildMehRank(seed: string, runCount: number): string {
  const ranks = ['CLOSE', 'ALMOST', 'MID SKIN', 'NOT BAD', '...OK'] as const;
  const pick = hashString(`${seed}-r${runCount}-meh-rank`) % ranks.length;
  return ranks[pick] ?? 'ALMOST';
}

export function buildMehStats(seed: string, scoreDelta: number, runCount: number): OverlayStat[] {
  const loss = Math.abs(scoreDelta);
  const redness =
    14 + (loss % 12) + (hashString(`${seed}-r${runCount}-meh-red-${scoreDelta}`) % 8);
  const pores = 4 + (loss % 8) + (hashString(`${seed}-r${runCount}-meh-pore-${scoreDelta}`) % 6);
  const hydrationLoss =
    6 + (loss % 8) + (hashString(`${seed}-r${runCount}-meh-hyd-${scoreDelta}`) % 6);
  const inflameLevel =
    ['LOW', 'L-LOW', 'LOW+'][hashString(`${seed}-r${runCount}-meh-inf-${scoreDelta}`) % 3] ?? 'LOW';
  return [
    { label: '赤み', value: `+${redness}%` },
    { label: '毛穴', value: `+${pores}%` },
    { label: '水分', value: `-${hydrationLoss}%` },
    { label: '炎症', value: inflameLevel },
  ];
}

export function buildFailRank(seed: string, runCount: number): string {
  const ranks = ['OVERHEAT', 'SKIN DAMAGE', 'BAD REACTION', 'CRITICAL', 'MELTDOWN'] as const;
  const pick = hashString(`${seed}-r${runCount}-fail-rank`) % ranks.length;
  return ranks[pick] ?? 'CRITICAL';
}

export function buildFailStats(seed: string, scoreDelta: number, runCount: number): FailData {
  const loss = Math.abs(scoreDelta);
  const redness =
    360 + (loss * 8) % 80 + (hashString(`${seed}-r${runCount}-fail-red-${scoreDelta}`) % 40);
  const hydrationLoss =
    65 + (loss % 20) + (hashString(`${seed}-r${runCount}-fail-hyd-${scoreDelta}`) % 12);
  const tempTag =
    ['MAX', 'MAX+', 'OVER MAX'][hashString(`${seed}-r${runCount}-fail-temp-${scoreDelta}`) % 3] ??
    'MAX';
  return {
    stats: [
      { label: '赤み', value: `+${redness}%` },
      { label: '炎症', value: 'HIGH' },
      { label: '水分', value: `-${hydrationLoss}%` },
      { label: '肌温度', value: tempTag },
    ],
  };
}

export function buildDisasterRank(seed: string, runCount: number): string {
  const ranks = ['SKIN COLLAPSE', 'DISASTER', 'PORE APOCALYPSE', 'MELTDOWN', 'SYSTEM FAILURE'] as const;
  const pick = hashString(`${seed}-r${runCount}-disaster-rank`) % ranks.length;
  return ranks[pick] ?? 'DISASTER';
}

export function buildDisasterData(seed: string, scoreDelta: number, runCount: number): DisasterData {
  const loss = Math.abs(scoreDelta);
  const poreAmp =
    400 + (loss % 400) + (hashString(`${seed}-r${runCount}-dis-pore-${scoreDelta}`) % 200);
  return {
    stats: [
      { label: '毛穴', value: `+${poreAmp}%` },
      { label: '炎症', value: loss >= 180 ? 'CRITICAL+' : 'CRITICAL' },
      { label: '水分', value: loss >= 200 ? 'LOST' : 'CRITICAL LOW' },
      { label: '肌構造', value: loss >= 220 ? 'ERROR' : 'UNSTABLE' },
    ],
  };
}
