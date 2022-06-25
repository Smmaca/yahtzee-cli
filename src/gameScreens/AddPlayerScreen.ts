import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import NewMultiplayerGameScreen from "./NewMultiplayerGameScreen";


export default class AddPlayerScreen extends BaseGameScreen<string> {
  draw() {}

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<string> {
    return prompter.getInput({
      name: Screen.ADD_PLAYER,
      message: config.messages.addPlayerPrompt,
      initial: `Player ${state.players.length + 1}`,
    });
  }

  handleInput(input: string, state: GameState, config: IConfig): BaseGameScreen<any> {
    if (input) {
      state.addPlayer(input);
      return new NewMultiplayerGameScreen();
    }
    return this;
  }
}