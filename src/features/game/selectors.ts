import { serumProfiles } from '../../data/serums';
import { skinProfiles } from '../../data/skins';
import type { GameState, Resolution } from '../../core/game/types';

export function currentSkinLabel(state: Pick<GameState, 'currentSkin'>): string {
  if (!state.currentSkin) {
    return '???';
  }
  return skinProfiles.find((skin) => skin.id === state.currentSkin)?.label ?? '???';
}

export function selectedSerumLabel(state: Pick<GameState, 'selectedSerum'>): string {
  if (!state.selectedSerum) {
    return '未選択';
  }
  return serumProfiles.find((serum) => serum.id === state.selectedSerum)?.label ?? '未選択';
}

interface ShareTextInput {
  skinLabel: string;
  serumLabel: string;
  resolution: Resolution;
  totalScore: number;
  successStreak: number;
  comboCutIn: boolean;
  dailySeed: string;
  skinCode: string;
}

export function buildDailySkinCode(dailySeed: string, skinLabel: string): string {
  if (!dailySeed) {
    return '';
  }
  const compactDate = dailySeed.replaceAll('-', '').slice(2);
  const normalizedSkin = skinLabel.replaceAll(/\s+/g, '').toUpperCase();
  return `DLY-${compactDate}-${normalizedSkin}`;
}

export function buildDailyVariantClass(dailySeed: string): string {
  if (!dailySeed) {
    return 'daily-variant-0';
  }
  let hash = 0;
  for (let i = 0; i < dailySeed.length; i += 1) {
    hash = (hash * 33 + dailySeed.charCodeAt(i)) >>> 0;
  }
  const variant = hash % 3;
  return `daily-variant-${variant}`;
}

export function buildShareText({
  skinLabel,
  serumLabel,
  resolution,
  totalScore,
  successStreak,
  comboCutIn,
  dailySeed,
  skinCode,
}: ShareTextInput): string {
  const comboLine = comboCutIn ? '称号: 3連ツヤ覚醒達成' : '';
  const comboTag = comboCutIn ? '#3連ツヤ覚醒' : '';
  const dailyCodeLine = dailySeed ? `今日の肌コード: ${skinCode}` : '';

  return [
    '美容液演出ゲームの結果',
    `デイリー: ${dailySeed || '---'}`,
    dailyCodeLine,
    `肌質: ${skinLabel}`,
    `選択: ${serumLabel}`,
    `判定: ${resolution.headline}`,
    `スコア: ${totalScore}`,
    `コンボ: ${successStreak}`,
    comboLine,
    `#美容液演出ゲーム #スキンケアあるある ${comboTag}`.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}
