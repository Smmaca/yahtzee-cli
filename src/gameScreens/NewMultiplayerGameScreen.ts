import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import NewGameScreen from "./NewGameScreen";
import { constructChoice } from "../utils/screen";
import GameActionScreen from "./GameActionScreen";
import AddPlayerScreen from "./AddPlayerScreen";

export enum NewMultiplayerGameScreenInput {
  ADD_PLAYER = "addPlayer",
  START_GAME = "startGame",
  CANCEL = "cancel",
}

export const choiceLabels: Record<NewMultiplayerGameScreenInput, string> = {
  [NewMultiplayerGameScreenInput.ADD_PLAYER]: "Add player",
  [NewMultiplayerGameScreenInput.START_GAME]: "Start game",
  [NewMultiplayerGameScreenInput.CANCEL]: "Cancel",
};

export default class NewMultiplayerGameScreen extends BaseGameScreen<NewMultiplayerGameScreenInput> {
  name = Screen.NEW_MULTIPLAYER_GAME;

  draw(state: GameState) {
    if (state.players.length) {
      state.players.forEach((player, i) => console.log(`Player ${i + 1}: ${player.name}`));
    } else {
      console.log("No players added yet");
    }
    console.log("\n");
  }

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
      name: this.name,
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