import GameState from "../GameState";
import { IChoice, IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screenUtils";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import NewGameScreen from "./NewGameScreen";
import QuitConfirmScreen from "./QuitConfirmScreen";
import StatisticsScreen from "./StatisticsScreen";

export enum MainMenuScreenInput {
  NEW_GAME = "newGame",
  STATISTICS = "statistics",
  SETTINGS = "settings",
  QUIT = "quit",
}

const choiceLabels: Record<MainMenuScreenInput, string> = {
  [MainMenuScreenInput.NEW_GAME]: "New Game",
  [MainMenuScreenInput.STATISTICS]: "Statistics",
  [MainMenuScreenInput.SETTINGS]: "Settings",
  [MainMenuScreenInput.QUIT]: "Quit",
}

export default class MainMenuScreen extends BaseGameScreen<MainMenuScreenInput> {
  draw() {}

  getChoices(): IChoice<MainMenuScreenInput, MainMenuScreenInput>[] {
    return [
      constructChoice(MainMenuScreenInput.NEW_GAME, choiceLabels),
      constructChoice(MainMenuScreenInput.STATISTICS, choiceLabels),
      // constructChoice(MainMenuScreenInput.SETTINGS, choiceLabels),
      constructChoice(MainMenuScreenInput.QUIT, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<MainMenuScreenInput> {
    return prompter.getInputFromSelect<MainMenuScreenInput>({
      name: Screen.MAIN_MENU,
      message: config.messages.mainMenuPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: MainMenuScreenInput, state: GameState, config: IConfig): BaseGameScreen<any> {
    switch (input) {
      case MainMenuScreenInput.NEW_GAME:
        return new NewGameScreen();
      case MainMenuScreenInput.STATISTICS:
        return new StatisticsScreen();
      case MainMenuScreenInput.SETTINGS:
        // TODO: Settings screen
      case MainMenuScreenInput.QUIT:
        return new QuitConfirmScreen({ previousScreen: this });
      default:
        return this;
    }
  }
}