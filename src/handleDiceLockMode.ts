import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import config from "./config";
import { GameMode, IGame } from "./types";
import { drawDiceValues, drawTurnStats } from "./utils/draw";

export function resetDiceLock(game: IGame) {
  game.diceLock = game.diceRoll.map(() => false);
}

export default async function handleDiceLockMode(game: IGame): Promise<IGame> {
  const _game = { ...game };

  drawTurnStats(game);
  drawDiceValues(game);

  const choices = _game.diceRoll.map((value, index) => ({
    name: `Dice ${index + 1}`,
    hint: value,
    value: index,
    enabled: _game.diceLock[index],
  }));

  const prompt = new MultiSelect({
    name: "diceLockMenu",
    message: config.messages.diceLockPrompt,
    limit: config.diceCount,
    choices,
    initial: choices.filter((choice) => choice.enabled).map((choice) => choice.name),
    result(names) {
      return this.map(names);
    }
  });

  return prompt.run().then((answer) => {
    resetDiceLock(_game);
    const indicesToLock = Object.keys(answer).map(key => answer[key]);
    _game.diceLock = _game.diceLock.map((_, i) => indicesToLock.includes(i));
    _game.mode = GameMode.ROLL;
    return _game;
  });
}