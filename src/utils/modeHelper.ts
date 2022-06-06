import { GameMode, IGame } from "../types";

export function changeMode(game: IGame, mode: GameMode) {
  game.modeHistory.unshift(game.mode);
  game.mode = mode;
}

export function revertMode(game: IGame) {
  const currentMode = game.mode;
  game.mode = game.modeHistory[0];
  game.modeHistory.unshift(currentMode);
}
