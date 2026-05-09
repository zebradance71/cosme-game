export type TitleScoreBand = 'early' | 'mid' | 'late';

export interface ScoreTitleStep {
  threshold: number;
  label: string;
  band: TitleScoreBand;
}

/** スコア帯（昇順）。totalScore が各 threshold 以上ならその段まで解放（0〜499 は初期帯の1段目のみ） */
export const SCORE_TITLE_STEPS: readonly ScoreTitleStep[] = [
  { threshold: 0, label: '肌、まだ戦える', band: 'early' },
  { threshold: 500, label: '保湿見習い', band: 'early' },
  { threshold: 900, label: 'スキンケア初心者', band: 'early' },
  { threshold: 1400, label: '肌管理勢', band: 'early' },
  { threshold: 2200, label: '発光予備軍', band: 'early' },
  { threshold: 3500, label: '水光肌', band: 'mid' },
  { threshold: 5500, label: '美肌覚醒', band: 'mid' },
  { threshold: 8000, label: '肌年齢バグ', band: 'mid' },
  { threshold: 12000, label: 'SNS発光体', band: 'mid' },
  { threshold: 18000, label: 'COSMIC SKIN', band: 'late' },
  { threshold: 30000, label: '人類離脱', band: 'late' },
  { threshold: 50000, label: '肌の概念', band: 'late' },
  { threshold: 77777, label: 'この世の光', band: 'late' },
] as const;

const LABEL_TO_STEP = new Map(SCORE_TITLE_STEPS.map((s) => [s.label, s]));

export function titlesUnlockedAtScore(totalScore: number): string[] {
  return SCORE_TITLE_STEPS.filter((s) => totalScore >= s.threshold).map((s) => s.label);
}

export function getTitleChipBand(label: string): TitleScoreBand {
  return LABEL_TO_STEP.get(label)?.band ?? 'early';
}

/** GameScreen 用: threshold 0 の初期称号はグレー帯、mid / late で修飾 */
export function getAchievementTitleChipClass(label: string): string {
  const step = LABEL_TO_STEP.get(label);
  if (step?.threshold === 0) return 'achievement-title-chip--starter';
  const band = getTitleChipBand(label);
  if (band === 'mid') return 'achievement-title-chip--mid';
  if (band === 'late') return 'achievement-title-chip--late';
  return '';
}

export function pickLatestUnlockedTitle(prevTitles: string[], nextTitles: string[]): string | null {
  const newly = nextTitles.filter((t) => !prevTitles.includes(t));
  if (newly.length === 0) {
    return null;
  }
  let best: string | null = null;
  let bestTh = -1;
  for (const label of newly) {
    const th = LABEL_TO_STEP.get(label)?.threshold ?? -1;
    if (th > bestTh) {
      bestTh = th;
      best = label;
    }
  }
  return best;
}

const titleFlavorMap: Record<string, string> = {
  '肌、まだ戦える': 'まだいける',
  '保湿見習い': 'まずは水分から',
  'スキンケア初心者': '一歩目を踏み出した',
  '肌管理勢': 'ルーティンが形になった',
  '発光予備軍': '光が見えてきた',
  '水光肌': 'うるツヤ帯へ',
  '美肌覚醒': 'ここからが本番',
  '肌年齢バグ': '数値がおかしい',
  'SNS発光体': '映えが止まらない',
  'COSMIC SKIN': '宇宙スケール',
  '人類離脱': 'もう人じゃない',
  '肌の概念': '定義が変わった',
  'この世の光': '頂点',
  'SSR AWAKENING': 'SSR肌覚醒を記録',
  'DIVINE GLOW': '神域のツヤを検知',
  'LUMINA CORE': '光核、点火',
  'MIRROR SKIN': '鏡面スキン同期',
  'STAR VEIL': '星屑のヴェール',
  'TRANSCEND AURA': 'オーラ超越',
};

export function getTitleFlavor(label: string): string {
  return titleFlavorMap[label] ?? 'スコア称号';
}

/** 美容液レア実況（SSR肌覚醒）時に抽選で付与する称号ラベル（チップには載せないがコメント用） */
export const RARE_PULL_TITLE_LABELS = [
  'SSR AWAKENING',
  'DIVINE GLOW',
  'LUMINA CORE',
  'MIRROR SKIN',
  'STAR VEIL',
  'TRANSCEND AURA',
] as const;

const RARE_PULL_TITLE_SET: ReadonlySet<string> = new Set(RARE_PULL_TITLE_LABELS);

export function pickRarePullTitleLabel(): string {
  const i = Math.floor(Math.random() * RARE_PULL_TITLE_LABELS.length);
  return RARE_PULL_TITLE_LABELS[i];
}

export function isRarePullTitle(label: string): boolean {
  return RARE_PULL_TITLE_SET.has(label);
}
