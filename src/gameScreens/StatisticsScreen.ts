import GameState from "../modules/GameState";
import { IChoice, IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screenUtils";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import MainMenuScreen from "./MainMenuScreen";

export enum StatisticsScreenInput {
  BACK = "back",
  CLEAR_STATS = "clearStats",
}

export const choiceLabels: Record<StatisticsScreenInput, string> = {
  [StatisticsScreenInput.BACK]: "Back",
  [StatisticsScreenInput.CLEAR_STATS]: "Clear stats",
};

export default class StatisticsScreen extends BaseGameScreen<StatisticsScreenInput> {
  draw() {
    // TODO: Draw stats
  }

  getChoices(): IChoice<StatisticsScreenInput, StatisticsScreenInput>[] {
    return [
      constructChoice(StatisticsScreenInput.BACK, choiceLabels),
      // constructChoice(StatisticsScreenInput.CLEAR_STATS, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<StatisticsScreenInput> {
    return prompter.getInputFromSelect<StatisticsScreenInput>({
      name: Screen.STATISTICS,
      message: config.messages.statisticsPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: StatisticsScreenInput): BaseGameScreen<any> {
    switch (input) {
      case StatisticsScreenInput.BACK:
        return new MainMenuScreen();
      default:
        return this;
    }
  }
}