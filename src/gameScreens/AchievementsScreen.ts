import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import { constructChoice } from "../utils/screen";
import Achievements from "../modules/Achievements";
import MainMenuScreen from "./MainMenuScreen";


export enum AchievementsScreenInput {
  BACK = "back",
}

export const choiceLabels: Record<AchievementsScreenInput, string> = {
  [AchievementsScreenInput.BACK]: "Back",
};

export default class AchievementsScreen extends BaseGameScreen<AchievementsScreenInput> {
  name = Screen.ACHIEVEMENTS;

  draw(state: GameState, config: IConfig) {
    const achievementsModule = new Achievements(config);
    const achievements = achievementsModule.getAchievements();
    for (const achievement in achievements) {
      const achievementCopy = config.achievements[achievement];
      const earned = achievements[achievement];
      console.log(earned ? "[X]" : "[ ]", achievementCopy.label, "-", achievementCopy.description);
    }
    console.log("");
  }

  getChoices() {
    return [
      constructChoice(AchievementsScreenInput.BACK, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<AchievementsScreenInput>({
      name: this.name,
      message: config.messages.achievementsPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: any) {
    switch (input) {
      case AchievementsScreenInput.BACK:
        return new MainMenuScreen();
      default:
        return this;
    }
  }
}