import Achievements from "../modules/Achievements";
import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { Achievement, IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import GameActionScreen from "./GameActionScreen";
import MainMenuScreen from "./MainMenuScreen";

export interface IGameOverSinglePlayerScreenOptions {
  earnedAchievements: Achievement[];
}

export default class GameOverSinglePlayerScreen extends BaseGameScreen<boolean> {
  name = Screen.GAME_OVER_SINGLE_PLAYER;

  constructor(private options: IGameOverSinglePlayerScreenOptions) {
    super();
  }

  draw(state: GameState, config: IConfig) {
    const achievements = new Achievements(config);
    this.options.earnedAchievements.forEach(earnedAchievement => {
      achievements.renderAchievement(earnedAchievement);
    });

    const player = state.players[0];

    console.log("Game over!\n");

    player.renderScoresheet();
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<boolean> {
    return prompter.getInputFromConfirm({
      name: this.name,
      message: config.messages.playAgainPrompt,
    });
  }

  handleInput(playAgain: boolean, state: GameState): BaseGameScreen<any> {
    if (playAgain) {
      state.resetGame();
      return new GameActionScreen();
    }
    return new MainMenuScreen();
  }
}