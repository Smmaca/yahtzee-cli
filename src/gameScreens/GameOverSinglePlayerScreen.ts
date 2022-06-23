import GameState from "../GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import GameActionScreen from "./GameActionScreen";
import MainMenuScreen from "./MainMenuScreen";


export default class GameOverSinglePlayerScreen extends BaseGameScreen<boolean> {
  draw(state: GameState) {
    const player = state.players[0];

    console.log("Game over!\n");
    player.renderScoresheet();
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<boolean> {
    return prompter.getInputFromConfirm({
      name: Screen.GAME_OVER_SINGLE_PLAYER,
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