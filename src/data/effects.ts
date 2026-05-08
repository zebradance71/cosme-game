import type { Outcome } from '../core/game/types';

export interface EffectCopy {
  reactionKey: string;
  headline: string;
  detail: string;
}

export const effectCopies: Record<Outcome, EffectCopy[]> = {
  normal: [
    {
      reactionKey: 'calmBase',
      headline: 'ベースコンディション維持',
      detail: '大崩れは回避。今日は様子見ムード。',
    },
  ],
  success: [
    {
      reactionKey: 'glassGlow',
      headline: 'ガラス玉肌、覚醒',
      detail: 'ツヤの反射で画面が盛れる。これは当たり。',
    },
    {
      reactionKey: 'glowBurst',
      headline: '発光レベル上昇',
      detail: 'キメが整って、いい角度しかない。',
    },
  ],
  bad: [
    {
      reactionKey: 'oilFlash',
      headline: 'うるおい過多でテカり祭り',
      detail: '悪くはないけど、今はその気分じゃない。',
    },
    {
      reactionKey: 'redAlert',
      headline: 'ほんのり赤み注意報',
      detail: '攻めすぎて、肌がびっくりしている。',
    },
    {
      reactionKey: 'dryCrack',
      headline: '表面コンディション乱れ',
      detail: 'ギリ耐えてるけど、だいぶ危ないライン。',
    },
  ],
  disaster: [
    {
      reactionKey: 'poreCollapse',
      headline: '毛穴アポカリプス',
      detail: '顔面のディテールがバグった。完全に事故。',
    },
    {
      reactionKey: 'acneBurst',
      headline: 'リアクション暴走',
      detail: '静かに終わるはずが、演出だけSSR級。',
    },
    {
      reactionKey: 'abyssDrop',
      headline: 'スキンケア奈落行き',
      detail: '肌コンディションが急降下。次は慎重に。',
    },
  ],
};
