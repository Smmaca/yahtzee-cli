import Select from "enquirer/lib/prompts/Select";
import config from "./config";
import { GameMode, IGame } from "./types";
import { rollDice } from "./utils/diceRoller";

export default function handleRollMode(game: IGame, loop: (game: IGame) => void) {
  let choices = [];
    if (game.rollNumber === 0) {
      choices.push("Roll dice");
    } else {
      if (game.rollNumber > 0 && game.rollNumber < 3) {
        choices.push("Lock dice", "Roll again");
      }
      if (game.rollNumber > 0) {
        choices.push("Score dice");
      }
    }
    choices.push("See scoresheet", "Quit");

    const prompt = new Select({
      name: "gameAction",
      message: "What do you want to do?",
      choices,
    });

    prompt.run().then((answer) => {
      switch(answer) {
        case "Lock dice":
          game.mode = GameMode.DICE_LOCKER;
          return loop(game);
        case "Roll dice":
        case "Roll again":
          const lockedDice = game.diceLock.filter((dice) => dice === true).length;
          const diceRoll = rollDice(config.diceCount - lockedDice);
          game.diceRoll = game.diceRoll.map((oldRoll, i) => {
            if (game.diceLock[i]) {
              return oldRoll;
            } else {
              return diceRoll.shift();
            }
          });
          game.rollNumber += 1;
          return loop(game);
        case "See scoresheet":
          game.mode = GameMode.VIEW_SCORE;
          return loop(game);
        case "Score dice":
          game.mode = GameMode.EDIT_SCORE;
          return loop(game);
        case "quit":
          return;
        default:
          return loop(game);
      }
    });
}