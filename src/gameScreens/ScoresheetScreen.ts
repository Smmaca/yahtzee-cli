import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { IConfig } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import { constructChoice } from "../utils/screenUtils";
import GameActionScreen from "./GameActionScreen";
import DiceScorer from "../modules/DiceScorer";
import { drawDiceValues, drawTurnStats } from "../utils/draw";

export enum ScoresheetScreenInput {
  CONTINUE = "continue",
}

export const choiceLabels: Record<ScoresheetScreenInput, string> = {
  [ScoresheetScreenInput.CONTINUE]: "Continue",
};

export default class ScoresheetScreen extends BaseGameScreen<ScoresheetScreenInput> {

  draw(state: GameState, config: IConfig) {
    const diceScorer = new DiceScorer(state.dice.values, config);
    const player = state.getCurrentPlayer();
    drawTurnStats(
      player.name,
      state.turn,
      state.getDiceRollsLeft(),
      diceScorer.scoreYahtzee() > 0,
    );
    drawDiceValues(state.dice.values, state.dice.lock);
    player.renderScoresheet();
  }

  getChoices() {
    return [
      constructChoice(ScoresheetScreenInput.CONTINUE, choiceLabels),
    ];
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<ScoresheetScreenInput>({
      name: Screen.SCORESHEET,
      message: config.messages.scoresheetPrompt,
      choices: this.getChoices(),
    });
  }

  handleInput(input: any) {
    switch (input) {
      case ScoresheetScreenInput.CONTINUE:
        return new GameActionScreen();
      default:
        return this;
    }
  }
}