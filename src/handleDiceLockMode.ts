import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import config from "./config";
import { GameMode, IGame } from "./types";

export default function handleDiceLockMode(game: IGame, loop: (game: IGame) => void) {
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