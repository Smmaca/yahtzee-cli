import GameState from "../modules/GameState";
import { IChoice, IPrompter } from "../modules/prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screen";
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

export const choiceLabels: Record<MainMenuScreenInput, string> = {
  [MainMenuScreenInput.NEW_GAME]: "New Game",
  [MainMenuScreenInput.STATISTICS]: "Statistics",
  [MainMenuScreenInput.SETTINGS]: "Settings",
  [MainMenuScreenInput.QUIT]: "Quit",
}

export default class MainMenuScreen extends BaseGameScreen<MainMenuScreenInput> {
  name = Screen.MAIN_MENU;

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
      name: this.name,
      message: config.messages.mainMenuPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: MainMenuScreenInput): BaseGameScreen<any> {
    switch (input) {
      case MainMenuScreenInput.NEW_GAME:
        return new NewGameScreen();
      case MainMenuScreenInput.STATISTICS:
        return new StatisticsScreen();
      case MainMenuScreenInput.QUIT:
        return new QuitConfirmScreen({ previousScreen: this });
      default:
        return this;
    }
  }
}