
export function roundToDP(num: number, dp: number): number {
  return Math.round(num * 10 ** dp) / 10 ** dp;
}