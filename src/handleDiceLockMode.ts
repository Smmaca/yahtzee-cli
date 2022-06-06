import { IGame } from "./types";

export function resetDiceLock(game: IGame) {
  game.diceLock = game.diceRoll.map(() => false);
}
