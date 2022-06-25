import GameState from "../modules/GameState";
import Statistics from "../modules/Statistics";
import { IChoice, IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screen";
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
  draw(state: GameState, config: IConfig) {
    const statsModule = new Statistics(config);
    const stats = statsModule.getGameStatistics();
    console.log(`Games played: ${stats.gamesPlayed}`);
    console.log(`High score: ${stats.highScore}`);
    console.log(`Low score: ${stats.lowScore}`);
    console.log(`Average score: ${stats.averageScore}\n`);
  }

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
        const statsModule = new Statistics(config);
        statsModule.clearGameStatistics();
        return this;
      default:
        return this;
    }
  }
}