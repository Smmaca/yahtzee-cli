import { resetDiceLock } from "./handleDiceLockMode";
import { resetDiceRoll } from "./handleScoreDiceMode";
import { GameMode, IGame } from "./types";

export function resetScore(game: IGame) {
  game.score = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
    bonusYahtzees: 0,
  };
  return game;
}

export function resetGame(game: IGame) {
  game.mode = GameMode.ROLL;
  game.modeHistory = [];
  game.turn = 0;
  game.rollNumber = 0;
  resetScore(game);
  resetDiceRoll(game);
  resetDiceLock(game);
}
