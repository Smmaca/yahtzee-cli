import config from "./config";
import { IGame } from "./types";
import { rollDice } from "./utils/diceRoller";

export function isYahtzee(_diceRoll: number[]): boolean {
  const diceRoll = _diceRoll.slice();
  const filtered = Array.from(new Set(diceRoll));
  return filtered.length === 1 && filtered[0] !== 0;
}

export function sumDiceRoll(diceRoll: number[]) {
  return diceRoll.reduce((acc, cur) => acc + cur, 0);
}

export function resetDiceRoll(game: IGame) {
  game.diceRoll = rollDice(config.diceCount);
  game.diceRoll = game.diceRoll.map(() => 0);
}
