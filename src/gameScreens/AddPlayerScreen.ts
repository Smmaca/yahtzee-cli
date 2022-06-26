import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import NewMultiplayerGameScreen from "./NewMultiplayerGameScreen";


export default class AddPlayerScreen extends BaseGameScreen<string> {
  name = Screen.ADD_PLAYER;

  draw() {}

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<string> {
    return prompter.getInput({
      name: this.name,
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