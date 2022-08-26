import GameState from "../modules/GameState";
import { IChoice, IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import { constructChoice } from "../utils/screen";
import BaseGameScreen from "./BaseGameScreen";
import DiceDesignerScreen from "./DiceDesignerScreen";
import MainMenuScreen from "./MainMenuScreen";

export enum SettingsScreenInput {
  DICE_DESIGN = "diceDesign",
  BACK = "back",
}

export const choiceLabels: Record<SettingsScreenInput, string> = {
  [SettingsScreenInput.DICE_DESIGN]: "Dice Design",
  [SettingsScreenInput.BACK]: "Back",
};

export default class SettingsScreen extends BaseGameScreen<SettingsScreenInput> {
  name = Screen.SETTINGS;

  draw() {}

  getChoices(state: GameState): IChoice<SettingsScreenInput, SettingsScreenInput>[] {
    const choices = [constructChoice(SettingsScreenInput.BACK, choiceLabels)];

    const diceDesignChoice = constructChoice(SettingsScreenInput.DICE_DESIGN, choiceLabels);
    diceDesignChoice.hint = `[${state.diceDesign}]`
    choices.push(diceDesignChoice);
    
    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<SettingsScreenInput> {
    return prompter.getInputFromSelect<SettingsScreenInput>({
      name: this.name,
      message: config.messages.settingsPrompt,
      choices: this.getChoices(state),
    });
  }

  handleInput(input: SettingsScreenInput, state: GameState, config: IConfig): BaseGameScreen<any> {
    switch (input) {
      case SettingsScreenInput.BACK:
        return new MainMenuScreen();
      case SettingsScreenInput.DICE_DESIGN:
        return new DiceDesignerScreen();
      default:
        return this;
    }
  }
}