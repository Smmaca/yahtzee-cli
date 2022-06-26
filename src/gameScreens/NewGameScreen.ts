import GameState from "../modules/GameState";
import { IChoice, IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import { constructChoice } from "../utils/screen";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import MainMenuScreen from "./MainMenuScreen";
import NewMultiplayerGameScreen from "./NewMultiplayerGameScreen";
import GameActionScreen from "./GameActionScreen";

export enum NewGameScreenInput {
  SINGLEPLAYER = "singleplayer",
  MULTIPLAYER = "multiplayer",
  CANCEL = "cancel",
}

export const choiceLabels: Record<NewGameScreenInput, string> = {
  [NewGameScreenInput.SINGLEPLAYER]: "Single player",
  [NewGameScreenInput.MULTIPLAYER]: "Multiplayer",
  [NewGameScreenInput.CANCEL]: "Cancel",
}

export default class NewGameScreen extends BaseGameScreen<NewGameScreenInput> {
  name = Screen.NEW_GAME;

  draw() {}

  getChoices(): IChoice<NewGameScreenInput, NewGameScreenInput>[] {
    return [
      constructChoice(NewGameScreenInput.SINGLEPLAYER, choiceLabels),
      constructChoice(NewGameScreenInput.MULTIPLAYER, choiceLabels),
      constructChoice(NewGameScreenInput.CANCEL, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<NewGameScreenInput> {
    return prompter.getInputFromSelect<NewGameScreenInput>({
      name: this.name,
      message: config.messages.newGamePrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: NewGameScreenInput, state: GameState): BaseGameScreen<any> {
    switch (input) {
      case NewGameScreenInput.SINGLEPLAYER:
        state.newGame()
        state.initSinglePlayer();
        return new GameActionScreen();
      case NewGameScreenInput.MULTIPLAYER:
        state.newGame();
        return new NewMultiplayerGameScreen();
      case NewGameScreenInput.CANCEL:
        return new MainMenuScreen();
      default:
        return this;
    }
  }
}