import GameState from "../modules/GameState";
import { IChoicePreview, IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import { constructChoice } from "../utils/screen";
import SettingsScreen from "./SettingsScreen";
import DiceDrawer from "../modules/DiceDrawer";
import { DiceDesign } from "../utils/diceDesigns";
import Settings from "../modules/Settings";

export enum DiceDesignerScreenInput {
  BACK = "back",
}

type DiceDesignerScreenInputs = DiceDesign | DiceDesignerScreenInput;

export const choiceLabels: Record<DiceDesignerScreenInputs, string> = {
  [DiceDesign.CLASSIC]: "Classic",
  [DiceDesign.DIGITS]: "Digits",
  [DiceDesign.PALMS]: "Palms",
  [DiceDesign.WORDY]: "Wordy",
  [DiceDesign.VOID]: "Void",
  [DiceDesign.ROMAN]: "Roman",
  [DiceDesign.TWINKLE]: "Twinkle",
  [DiceDesign.MONEYMAKER]: "Moneymaker",
  [DiceDesign.RIDDLER]: "Riddler",
  [DiceDesign.SYMBOLS]: "@#$%&!",
  [DiceDesignerScreenInput.BACK]: "Back",
};

export default class DiceDesignerScreen extends BaseGameScreen<DiceDesignerScreenInputs> {
  name = Screen.DICE_DESIGNER;

  preview: DiceDesign;

  draw() {}

  getChoices(state: GameState) {
    const choices = [];

    const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5, 6], [false, false, false, false, false, false]);
    const backChoice: IChoicePreview<DiceDesignerScreenInputs> = constructChoice(DiceDesignerScreenInput.BACK, choiceLabels);
    backChoice.preview = diceDrawer.drawDice(state.diceDesign);

    choices.push(backChoice);
    
    [
      DiceDesign.CLASSIC,
      DiceDesign.DIGITS,
      DiceDesign.PALMS,
      DiceDesign.WORDY,
      DiceDesign.VOID,
      DiceDesign.ROMAN,
      DiceDesign.TWINKLE,
      DiceDesign.MONEYMAKER,
      DiceDesign.RIDDLER,
      DiceDesign.SYMBOLS,
    ].forEach(diceDesign => {
      const choice: IChoicePreview<DiceDesignerScreenInputs> = constructChoice(diceDesign, choiceLabels);
      choice.preview = diceDrawer.drawDice(diceDesign);
      if (state.diceDesign === diceDesign) {
        choice.hint = "[Current]";
      }
      choices.push(choice);
    });
    
    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromPreviewSelect<DiceDesignerScreenInputs>({
      name: this.name,
      message: config.messages.diceDesignerPrompt,
      choices: this.getChoices(state),
    });
  }

  handleInput(input: DiceDesignerScreenInputs, state: GameState, config: IConfig) {
    if (!input) {
      return this;
    }
    
    if (input === DiceDesignerScreenInput.BACK) {
      return new SettingsScreen();
    }

    // Set new dice design
    const settingsModule = new Settings(config);
    state.diceDesign = input;
    settingsModule.saveSettings({ diceDesign: input });

    return new SettingsScreen();
  }
}