import { GameMode, IGame } from "../types";

export function changeMode(game: IGame, mode: GameMode) {
  const _game = { ...game };
  game.modeHistory.unshift(_game.mode);
  _game.mode = mode;
  return _game;
}

export function revertMode(game: IGame) {
  const _game = { ...game };
  const currentMode = _game.mode;
  _game.mode = _game.modeHistory[0];
  _game.modeHistory.unshift(currentMode);
  return _game;
}
