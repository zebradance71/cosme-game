import type { SerumType } from '../../core/game/types';
import { pickRarePullTitleLabel } from '../../features/game/titleSystem';

/** 美容液コメントがレア台詞になる確率（3%、RUN が 5 の倍数でないときのみ抽選） */
const RARE_COMMENT_RATE = 0.03;

/** `runCount` がこの倍数のラウンドではレア台詞を確定（3% とは別に常に成立） */
const RARE_GUARANTEE_EVERY_N_ROUNDS = 5;

const serumCommentMap: Record<SerumType, readonly string[]> = {
  retinol: [
    'A反応ガチャ開幕',
    '赤みの気配あり',
    '肌、ちょっと警戒中',
    '攻めすぎ感ある',
    '今日はいく気だね',
    '覚悟だけは感じる',
    'ヒリつき予報発令',
  ],
  vitamin_c: [
    'ツヤ狙いきた',
    '光属性ビルド',
    '透明感に全振り',
    '毛穴に圧かけ中',
    '朝の美容垢感',
    '肌が少し発光',
    'キラキラしてきた',
  ],
  niacinamide: [
    '安定択きた',
    'バランス型すぎる',
    '肌メンタル安定中',
    '無難だけど強い',
    '今日は平和',
    '玄人っぽい選択',
    '地味に優秀',
  ],
  ceramide: [
    '保護モード発動',
    '肌、布団入りました',
    '守備力つよい',
    'バリア再建中',
    '今日は休ませる日',
    'しっとり空間',
    '肌が落ち着いてる',
  ],
  aha_bha: [
    '毛穴を潰しにきた',
    '肌への圧が強い',
    '角質、逃走開始',
    'ヒリつきの予感',
    '攻撃性能高め',
    '肌がざわついてる',
    '強気ビルドすぎる',
  ],
};

const serumRareCommentMap: Record<SerumType, readonly string[]> = {
  retinol: [
    '【WARNING】肌が限界突破モード突入',
    '赤みの未来が確定しました',
    '禁忌配合、解放',
  ],
  vitamin_c: [
    '発光レベル、人類基準を突破',
    '透明感が画面から漏れてる',
    '肌、朝7時の美容垢化',
  ],
  niacinamide: [
    '異常な安定感を検出',
    '肌メンタル、完全体へ',
    'バランス型の最終形態',
  ],
  ceramide: [
    '保湿、ここに極まる',
    'バリア機能、完全復活',
    '肌が高級ホテルに宿泊中',
  ],
  aha_bha: [
    '【危険】角質が消滅中',
    '毛穴、存在を放棄',
    '肌がこちらを見ている',
  ],
};

export interface SerumCommentRoll {
  text: string;
  isRare: boolean;
  /** レア時のみ: ラウンド終了後に実績チップへ付与 */
  rareTitleLabel?: string;
}

export function pickSerumComment(serum: SerumType, runCount: number): SerumCommentRoll {
  const guaranteeRare =
    runCount > 0 && runCount % RARE_GUARANTEE_EVERY_N_ROUNDS === 0;
  const randomRare = !guaranteeRare && Math.random() < RARE_COMMENT_RATE;
  const shouldUseRare = guaranteeRare || randomRare;
  const comments = shouldUseRare ? serumRareCommentMap[serum] : serumCommentMap[serum];
  const index = Math.floor(Math.random() * comments.length);
  if (!shouldUseRare) {
    return {
      text: comments[index],
      isRare: false,
    };
  }
  return {
    text: comments[index],
    isRare: true,
    rareTitleLabel: pickRarePullTitleLabel(),
  };
}

export function getSerumCommentTone(serum: SerumType): 'retinol' | 'vitamin_c' | 'niacinamide' | 'ceramide' | 'aha_bha' {
  return serum;
}
