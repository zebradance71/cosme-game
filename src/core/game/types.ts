export type SkinType = 'dry' | 'oily' | 'sensitive' | 'pores';

export type SerumType =
  | 'retinol'
  | 'vitamin_c'
  | 'niacinamide'
  | 'ceramide'
  | 'aha_bha';

export type Outcome = 'normal' | 'success' | 'bad' | 'disaster';

export type Phase =
  | 'idle'
  | 'skinRevealed'
  | 'serumSelected'
  | 'applying'
  | 'resolved'
  | 'resultShown';

export interface SkinProfile {
  id: SkinType;
  label: string;
  description: string;
}

export interface SerumProfile {
  id: SerumType;
  label: string;
  description: string;
}

export interface Resolution {
  outcome: Outcome;
  scoreDelta: number;
  reactionKey: string;
  headline: string;
  detail: string;
  /** 加算の結果が 0 になり、スタートスコアへ戻したラウンド */
  scoreResetFromZero?: boolean;
}

export interface GameState {
  phase: Phase;
  runCount: number;
  totalScore: number;
  currentSkin: SkinType | null;
  selectedSerum: SerumType | null;
  resolution: Resolution | null;
  dailySkin: SkinType | null;
  dailySeed: string;
}
