import clear from "clear";
import { drawDiceValues, drawTitle, drawTurnStats } from "./utils/draw";
import { rollDice } from "./utils/diceRoller";
import { GameMode, IGame } from "./types";
import config from "./config";
import handleRollMode from "./handleRollMode";
import handleDiceLockMode from "./handleDiceLockMode";

const gameData: IGame = {
  turn: 0,
  diceRoll: [],
  diceLock: [],
  rollNumber: 0,
  mode: GameMode.ROLL,
};


function loop(game) {
  clear();

  drawTitle();
  drawTurnStats(game);
  drawDiceValues(game);

  if (!game.diceRoll.length) {
    game.diceRoll = rollDice(config.diceCount);
    game.diceRoll = game.diceRoll.map(() => 0);
    game.diceLock = game.diceRoll.map(() => false);  
  }

  if (game.mode === GameMode.ROLL) {
    handleRollMode(game, loop);
  }

  if (game.mode === GameMode.DICE_LOCKER) {
    handleDiceLockMode(game, loop);
  }
}

loop(gameData);