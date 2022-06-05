import Select from "enquirer/lib/prompts/Select";
import config from "./config";
import { GameMode, IGame } from "./types";
import { rollDice } from "./utils/diceRoller";
import { drawDiceValues, drawTurnStats } from "./utils/draw";

export enum RollModeChoice {
  ROLL_DICE = "Roll dice",
  ROLL_AGAIN = "Roll again",
  LOCK_DICE = "Lock dice",
  SCORE_DICE = "Score dice",
  SEE_SCORESHEET = "See scoresheet",
  QUIT = "Quit",
}

function getPromptChoices(game: IGame) {
  const choices = [];
  if (game.rollNumber === 0) {
    choices.push(RollModeChoice.ROLL_DICE);
  } else {
    if (game.rollNumber > 0 && game.rollNumber < config.rollsPerTurn) {
      choices.push(RollModeChoice.ROLL_AGAIN, RollModeChoice.LOCK_DICE);
    }
    if (game.rollNumber > 0) {
      choices.push(RollModeChoice.SCORE_DICE);
    }
  }
  choices.push(RollModeChoice.SEE_SCORESHEET, RollModeChoice.QUIT);
  return choices;
}

export default async function handleRollMode(game: IGame): Promise<IGame> {
  const _game = { ...game };

  drawTurnStats(game);
  drawDiceValues(game);

  const prompt = new Select({
    name: "gameAction",
    message: config.messages.rollPrompt,
    choices: getPromptChoices(_game),
  });

  return prompt.run().then((answer) => {
    switch(answer) {
      case RollModeChoice.LOCK_DICE:
        _game.mode = GameMode.DICE_LOCKER;
        return _game;
      case RollModeChoice.ROLL_DICE:
      case RollModeChoice.ROLL_AGAIN:
        const lockedDice = _game.diceLock.filter((dice) => dice === true).length;
        const diceRoll = rollDice(config.diceCount - lockedDice);
        _game.diceRoll = _game.diceRoll.map((oldRoll, i) => {
          if (_game.diceLock[i]) {
            return oldRoll;
          } else {
            return diceRoll.shift();
          }
        });
        _game.rollNumber += 1;
        return _game;
      case RollModeChoice.SEE_SCORESHEET:
        _game.mode = GameMode.VIEW_SCORE;
        return _game;
      case RollModeChoice.SCORE_DICE:
        _game.mode = GameMode.EDIT_SCORE;
        return _game;
      case RollModeChoice.QUIT:
        return;
      default:
        return _game;
    }
  });
}