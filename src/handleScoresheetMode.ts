import Select from "enquirer/lib/prompts/Select";
import config from "./config";
import { GameMode, IGame } from "./types";
import { drawDiceValues, drawTurnStats } from "./utils/draw";
import Scoresheet from "./utils/Scoresheet";


function getPromptChoices(game: IGame) {
  return ["Go back", "Quit"];
}

export default async function handleScoresheetMode(game: IGame): Promise<IGame> {
  const _game = { ...game };

  drawTurnStats(game);
  drawDiceValues(game);

  const scoresheet = new Scoresheet({ diceRoll: _game.diceRoll, score: _game.score }); 

  scoresheet.render();

  const prompt = new Select({
    name: "scoresheetMenu",
    message: config.messages.scoresheetPrompt,
    choices: getPromptChoices(_game),
  });

  return prompt.run().then(answer => {
    switch(answer) {
      case "Go back":
        _game.mode = GameMode.ROLL;
        return _game;
      case "Quit":
        return;
      default:
        return _game;
    }
  });
}