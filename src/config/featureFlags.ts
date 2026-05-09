/**
 * 結果画面（通常・レア共通）の上部アフィカード 2 枚。
 * いずれかを `false` にすると非表示:
 * - `VITE_SHOW_RESULT_AFFILIATES=false`
 * - `VITE_SHOW_RARE_AFFILIATES=false`（従来名・互換用）
 */
export const showResultAffiliateCards =
  import.meta.env.VITE_SHOW_RESULT_AFFILIATES !== 'false' &&
  import.meta.env.VITE_SHOW_RARE_AFFILIATES !== 'false';

/** @deprecated `showResultAffiliateCards` を使用 */
export const showRareResultAffiliateCards = showResultAffiliateCards;
