import GameState from "../GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import NewGameScreen from "./NewGameScreen";
import { constructChoice } from "../utils/screenUtils";
import GameActionScreen from "./GameActionScreen";
import AddPlayerScreen from "./AddPlayerScreen";

export enum NewMultiplayerGameScreenInput {
  ADD_PLAYER = "addPlayer",
  START_GAME = "startGame",
  CANCEL = "cancel",
}

const choiceLabels: Record<NewMultiplayerGameScreenInput, string> = {
  [NewMultiplayerGameScreenInput.ADD_PLAYER]: "Add player",
  [NewMultiplayerGameScreenInput.START_GAME]: "Start game",
  [NewMultiplayerGameScreenInput.CANCEL]: "Cancel",
};

export default class NewMultiplayerGameScreen extends BaseGameScreen<NewMultiplayerGameScreenInput> {

  draw() {}

  getChoices(state: GameState, config: IConfig) {
    const choices = [];

    if (state.players.length < config.maxPlayers) {
      choices.push(constructChoice(NewMultiplayerGameScreenInput.ADD_PLAYER, choiceLabels));
    }
    if (state.players.length >= 2) {
      choices.push(constructChoice(NewMultiplayerGameScreenInput.START_GAME, choiceLabels));
    }
    choices.push(constructChoice(NewMultiplayerGameScreenInput.CANCEL, choiceLabels));

    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<NewMultiplayerGameScreenInput>({
      name: Screen.NEW_MULTIPLAYER_GAME,
      message: config.messages.newMultiplayerGamePrompt,
      choices: this.getChoices(state, config),
    });
  }

  handleInput(input: any) {
    switch (input) {
      case NewMultiplayerGameScreenInput.ADD_PLAYER:
        return new AddPlayerScreen();
      case NewMultiplayerGameScreenInput.START_GAME:
        return new GameActionScreen();
      case NewMultiplayerGameScreenInput.CANCEL:
        return new NewGameScreen();
      default:
        return this;
    }
  }
}