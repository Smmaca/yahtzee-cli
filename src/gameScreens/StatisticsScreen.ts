import GameState from "../GameState";
import { IChoice, IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screenUtils";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import MainMenuScreen from "./MainMenuScreen";

export enum StatisticsScreenInput {
  BACK = "back",
  CLEAR_STATS = "clearStats",
}

const choiceLabels: Record<StatisticsScreenInput, string> = {
  [StatisticsScreenInput.BACK]: "Back",
  [StatisticsScreenInput.CLEAR_STATS]: "Clear stats",
};

export default class StatisticsScreen extends BaseGameScreen<StatisticsScreenInput> {
  draw() {}

  getChoices(): IChoice<StatisticsScreenInput, StatisticsScreenInput>[] {
    return [
      constructChoice(StatisticsScreenInput.BACK, choiceLabels),
      constructChoice(StatisticsScreenInput.CLEAR_STATS, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<StatisticsScreenInput> {
    return prompter.getInputFromSelect<StatisticsScreenInput>({
      name: Screen.STATISTICS,
      message: config.messages.statisticsPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: StatisticsScreenInput, state: GameState, config: IConfig): BaseGameScreen<any> {
    switch (input) {
      case StatisticsScreenInput.BACK:
        return new MainMenuScreen();
      case StatisticsScreenInput.CLEAR_STATS:
        // TODO: Clear stats
        return this;
      default:
        return this;
    }
  }
}