import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import { constructChoice } from "../utils/screen";
import { drawDiceValues } from "../utils/draw";
import QuitConfirmScreen from "./QuitConfirmScreen";
import ScoresheetScreen from "./ScoresheetScreen";
import LockDiceScreen from "./LockDiceScreen";
import ScoreDiceScreen from "./ScoreDiceScreen";
import { DiceDesign } from "../modules/Settings";

export enum DiceDesignerScreenInput {
  BACK = "back",
}

type DiceDesignerScreenInputs = DiceDesign | DiceDesignerScreenInput;

export const choiceLabels: Record<DiceDesignerScreenInputs, string> = {
  [DiceDesign.CLASSIC]: "Classic",
  [DiceDesign.DIGITS]: "Digits",
  [DiceDesignerScreenInput.BACK]: "Back",
};

export default class DiceDesignerScreen extends BaseGameScreen<DiceDesignerScreenInputs> {
  name = Screen.GAME_ACTION;

  draw() {
    drawDiceValues([1, 2, 3, 4, 5, 6], [false, false, false, false, false, false]);
  }

  getChoices(state: GameState, config: IConfig) {
    const choices = [];
    
    [
      DiceDesign.CLASSIC,
    ].forEach(diceDesign => {
      const choice = constructChoice(diceDesign, choiceLabels);
      if (state.diceDesign === diceDesign) {
        choice.hint = "[Current]"
      }
    });

    choices.push(constructChoice(DiceDesignerScreenInput.BACK, choiceLabels));
    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<DiceDesignerScreenInputs>({
      name: this.name,
      message: config.messages.diceDesignerPrompt,
      choices: this.getChoices(state, config),
    });
  }

  handleInput(input: any, state: GameState) {
    switch(input) {
      case DiceDesignerScreenInput.ROLL_DICE:
      case DiceDesignerScreenInput.ROLL_AGAIN:
        state.dice.roll();
        state.incrementRollNumber();
        return this;
      case DiceDesignerScreenInput.LOCK_DICE:
        return new LockDiceScreen();
      case DiceDesignerScreenInput.SEE_SCORESHEET:
        return new ScoresheetScreen();
      case DiceDesignerScreenInput.SCORE_DICE:
        return new ScoreDiceScreen();
      case DiceDesignerScreenInput.QUIT_TO_MAIN_MENU:
        return new QuitConfirmScreen({ previousScreen: this, softQuit: true });
      case DiceDesignerScreenInput.QUIT:
        return new QuitConfirmScreen({ previousScreen: this });
      default:
        return this;
    }
  }
}