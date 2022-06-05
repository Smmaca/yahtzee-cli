import { IGame } from "./types";
import Confirm from "enquirer/lib/prompts/Confirm";
import config from "./config";
import { revertMode } from "./utils/modeHelper";

export default function handleQuitConfirm(game: IGame) {
  const _game = { ...game };

  const prompt = new Confirm({
    name: "quitConfirm",
    message: config.messages.quitConfirmPrompt,
  });

  return prompt.run().then(quit => {
    return quit ? undefined : revertMode(_game);
  });
}