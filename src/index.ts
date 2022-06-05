import clear from "clear";
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import { drawDiceValues, drawTitle, drawTurnStats } from "./utils/draw";
import { rollDice } from "./utils/diceRoller";
import { GameMode, IGame } from "./types";
import config from "./config";
import handleRollMode from "./handleRollMode";

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
    const prompt = new MultiSelect({
      name: "diceLock",
      message: "Which dice do you want to lock?",
      limit: config.diceCount,
      choices: game.diceRoll.map((_, index) => ({
        name: `Dice ${index + 1}`,
        value: index,
      })),
      result(names) {
        return this.map(names);
      }
    });

    prompt.run().then((answer) => {
      console.log(answer);
      game.diceLock = [];
      const indicesToLock = Object.keys(answer).map(key => answer[key]);
      game.diceRoll.forEach((_, i) => {
        if (indicesToLock.includes(i)) {
          game.diceLock.push(true);
        } else {
          game.diceLock.push(false);
        }
      });
      game.mode = GameMode.ROLL;
      return loop(game);
    });
  }
}

loop(gameData);