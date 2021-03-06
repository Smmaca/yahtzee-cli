
import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import MainMenuScreen from "./MainMenuScreen";

export interface IQuitConfirmOptions {
  previousScreen: BaseGameScreen<any>;
  softQuit?: boolean;
}

export default class QuitConfirmScreen extends BaseGameScreen<boolean> {
  name = Screen.QUIT_CONFIRM;

  constructor(private options: IQuitConfirmOptions) {
    super();
  }

  draw() {}

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<boolean> {
    return prompter.getInputFromConfirm({
      name: this.name,
      message: this.options.softQuit
        ? config.messages.quitToMainMenuConfirmPrompt
        : config.messages.quitConfirmPrompt,
    });
  }

  handleInput(shouldQuit: boolean): BaseGameScreen<any> {
    if (shouldQuit) {
      return this.options.softQuit ? new MainMenuScreen() : null;
    }
    return this.options.previousScreen;
  }
}