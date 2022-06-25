import clear from "clear";
import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { drawTitle } from "../utils/draw";

export enum Screen {
  MAIN_MENU = "mainMenu",
  NEW_GAME = "newGameMenu",
  QUIT_CONFIRM = "quitConfirm",
  STATISTICS = "statistics",
  NEW_MULTIPLAYER_GAME = "newMultiplayerGame",
  ADD_PLAYER = "addPlayer",
  GAME_ACTION = "gameAction",
  SCORESHEET = "scoresheet",
  LOCK_DICE = "lockDice",
  SCORE_DICE = "scoreDice",
  SCORE_JOKER = "scoreJoker",
  GAME_OVER_SINGLE_PLAYER = "gameOverSinglePlayer",
  GAME_OVER_MULTIPLAYER = "gameOverMultiplayer",
}

export interface IRunParams {
  config: IConfig;
  prompter: IPrompter;
  state: GameState;
}

export default abstract class BaseGameScreen<T> {
  drawScreenStart() {
    clear();
    drawTitle();
  };

  abstract draw(state: GameState, config: IConfig): void;

  abstract getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<T>;

  abstract handleInput(input: T, state: GameState, config: IConfig): BaseGameScreen<any>;
  
  async run({ config, prompter, state }: IRunParams): Promise<BaseGameScreen<any>> {
    this.drawScreenStart();
    this.draw(state, config);
    const input = await this.getInput(prompter, state, config);
    return this.handleInput(input, state, config);
  }
}