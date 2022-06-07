
export function isYahtzee(_diceRoll: number[]): boolean {
  const diceRoll = _diceRoll.slice();
  const filtered = Array.from(new Set(diceRoll));
  return filtered.length === 1 && filtered[0] !== 0;
}
