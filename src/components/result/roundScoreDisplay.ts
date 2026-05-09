/** 結果画面: 1ラウンド分の増減（HUD に加算された値と同じ）の見た目 */
export function formatRoundDeltaForResult(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }
  return `${value}`;
}
