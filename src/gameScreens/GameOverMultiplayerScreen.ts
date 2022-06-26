import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screen";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import GameActionScreen from "./GameActionScreen";
import QuitConfirmScreen from "./QuitConfirmScreen";

export enum GameOverMultiplayerScreenInput {
  FINAL_SCORES = "finalScores",
  PLAY_AGAIN = "playAgain",
  QUIT_TO_MAIN_MENU = "quitToMainMenu",
  QUIT = "quit",
}

export const choiceLabels: Record<GameOverMultiplayerScreenInput, string> = {
  [GameOverMultiplayerScreenInput.FINAL_SCORES]: "See final scores",
  [GameOverMultiplayerScreenInput.PLAY_AGAIN]: "Play Again",
  [GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU]: "Quit to main menu",
  [GameOverMultiplayerScreenInput.QUIT]: "Quit",
}

export type GameOverMultiplayerScreenInputs = GameOverMultiplayerScreenInput | string;

export default class GameOverMultiplayerScreen extends BaseGameScreen<GameOverMultiplayerScreenInputs> {
  name = Screen.GAME_OVER_MULTIPLAYER;

  draw(state: GameState) {
    if (state.currentPlayerIndex !== null) {
      state.getCurrentPlayer().renderScoresheet();
    } else {
      console.log(`${state.getWinner().name} wins!`);
      state.renderPlayerScores();
    }
  }

  getChoices(state: GameState) {
    const choices: any[] = [
      constructChoice(GameOverMultiplayerScreenInput.FINAL_SCORES, choiceLabels),
    ];
    
    state.players.forEach((player, i) => {
      choices.push({
        name: player.name,
        value: i,
        message: `See ${player.name}'s scoresheet`,
      });
    });

    choices.push(
      constructChoice(GameOverMultiplayerScreenInput.PLAY_AGAIN, choiceLabels),
      constructChoice(GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
      constructChoice(GameOverMultiplayerScreenInput.QUIT, choiceLabels),
    );

    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<GameOverMultiplayerScreenInputs> {
    return prompter.getInputFromSelect<GameOverMultiplayerScreenInputs>({
      name: this.name,
      message: config.messages.gameOverPrompt,
      choices: this.getChoices(state),
    });
  }

  handleInput(input: GameOverMultiplayerScreenInputs, state: GameState): BaseGameScreen<any> {
    if (input === GameOverMultiplayerScreenInput.FINAL_SCORES) {
      state.setCurrentPlayer(null);
      return this;
    }
    if (input === GameOverMultiplayerScreenInput.PLAY_AGAIN) {
      state.resetGame();
      return new GameActionScreen();
    }
    if (input === GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU) {
      return new QuitConfirmScreen({ previousScreen: this, softQuit: true });
    }
    if (input === GameOverMultiplayerScreenInput.QUIT) {
      return new QuitConfirmScreen({ previousScreen: this });
    }

    const index = state.players.findIndex(player => player.name === input);

    if (index >= 0) {
      state.setCurrentPlayer(index);
    }

    return this;
  }
}