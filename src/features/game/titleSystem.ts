export interface TitleSnapshot {
  totalRatedRuns: number;
  totalSuccesses: number;
  totalDisasters: number;
  poreCollapseIndex: number;
  successStreak: number;
  badStreak: number;
  disasterStreak: number;
}

interface TitleDefinition {
  id: string;
  label: string;
  unlockedWhen: (snapshot: TitleSnapshot) => boolean;
}

function successRate(snapshot: TitleSnapshot): number {
  if (snapshot.totalRatedRuns <= 0) {
    return 0;
  }
  return (snapshot.totalSuccesses / snapshot.totalRatedRuns) * 100;
}

export const titleDefinitions: TitleDefinition[] = [
  { id: 'disaster-10', label: 'PORE DESTROYER', unlockedWhen: (s) => s.totalDisasters >= 10 },
  { id: 'disaster-30', label: 'MELTDOWN ADDICT', unlockedWhen: (s) => s.totalDisasters >= 30 },
  { id: 'disaster-50', label: 'SKIN COLLAPSE', unlockedWhen: (s) => s.totalDisasters >= 50 },
  { id: 'success-rate-30', label: 'STABLE SKIN', unlockedWhen: (s) => successRate(s) >= 30 },
  { id: 'success-rate-50', label: 'SKIN MASTER', unlockedWhen: (s) => successRate(s) >= 50 },
  { id: 'success-rate-70', label: 'PERFECT CELL', unlockedWhen: (s) => successRate(s) >= 70 },
  { id: 'disaster-streak-3', label: 'MELTDOWN CHAIN', unlockedWhen: (s) => s.disasterStreak >= 3 },
  { id: 'bad-streak-5', label: 'RED ALERT', unlockedWhen: (s) => s.badStreak >= 5 },
  { id: 'success-streak-3', label: 'GLOW LOOP', unlockedWhen: (s) => s.successStreak >= 3 },
  { id: 'pore-100', label: 'PORE WARNING', unlockedWhen: (s) => s.poreCollapseIndex >= 100 },
  { id: 'pore-300', label: 'PORE APOCALYPSE', unlockedWhen: (s) => s.poreCollapseIndex >= 300 },
  { id: 'pore-500', label: 'HUMAN SPONGE', unlockedWhen: (s) => s.poreCollapseIndex >= 500 },
];

export function evaluateUnlockedTitles(snapshot: TitleSnapshot): string[] {
  return titleDefinitions
    .filter((title) => title.unlockedWhen(snapshot))
    .map((title) => title.label);
}

const titleFlavorMap: Record<string, string> = {
  'PORE DESTROYER': '崩壊ルートの住人',
  'MELTDOWN ADDICT': '爆死に愛された肌',
  'SKIN COLLAPSE': 'もう戻れない領域',
  'STABLE SKIN': '安定運用の天才',
  'SKIN MASTER': '成功を引く手つき',
  'PERFECT CELL': '光る細胞、勝者の証',
  'MELTDOWN CHAIN': '連続崩壊コンボ成立',
  'RED ALERT': '赤信号、ずっと点灯',
  'GLOW LOOP': 'ツヤ無限ループ中',
  'PORE WARNING': '毛穴システム警報',
  'PORE APOCALYPSE': '毛穴終末カウント開始',
  'HUMAN SPONGE': '吸収しすぎた存在',
};

export function getTitleFlavor(label: string): string {
  return titleFlavorMap[label] ?? '隠し称号を解放中';
}
