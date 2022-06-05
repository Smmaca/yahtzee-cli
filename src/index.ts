import clear from "clear";
import { drawTitle } from "./utils/draw";
import { GameMode, IGame } from "./types";
import handleRollMode from "./handleRollMode";
import handleDiceLockMode, { resetDiceLock } from "./handleDiceLockMode";
import handleScoresheetMode from "./handleScoresheetMode";
import handleScoreDice, { resetDiceRoll } from "./handleScoreDice";
import handleGameOver from "./handleGameOver";

const gameData: IGame = {
  turn: 0,
  diceRoll: [],
  diceLock: [],
  rollNumber: 0,
  mode: GameMode.ROLL,
  score: {
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
  },
};


async function loop(game: IGame) {
  clear();

  drawTitle();

  if (!game.diceRoll.length) {
    resetDiceRoll(game);
    resetDiceLock(game);
  }

  let newGame: IGame;

  if (game.mode === GameMode.ROLL) {
    newGame = await handleRollMode(game);
  }

  if (game.mode === GameMode.DICE_LOCKER) {
    newGame = await handleDiceLockMode(game);
  }

  if (game.mode === GameMode.VIEW_SCORE) {
    newGame = await handleScoresheetMode(game);
  }

  if (game.mode === GameMode.EDIT_SCORE) {
    newGame = await handleScoreDice(game);
  }

  if (game.mode === GameMode.GAME_OVER) {
    newGame = await handleGameOver(game);
  }

  return newGame ? loop(newGame) : null;
}

loop(gameData);