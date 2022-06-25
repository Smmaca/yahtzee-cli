
import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import MainMenuScreen from "./MainMenuScreen";

export interface IQuitConfirmOptions {
  previousScreen: BaseGameScreen<any>;
  softQuit?: boolean;
}

export default class QuitConfirmScreen extends BaseGameScreen<boolean> {
  constructor(private options: IQuitConfirmOptions) {
    super();
  }

  draw() {}

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<boolean> {
    return prompter.getInputFromConfirm({
      name: Screen.QUIT_CONFIRM,
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