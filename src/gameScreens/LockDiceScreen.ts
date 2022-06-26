import DiceScorer from "../modules/DiceScorer";
import GameState from "../modules/GameState";
import { IChoice, IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import { drawDiceValues, drawTurnStats } from "../utils/draw";
import BaseGameScreen from "./BaseGameScreen";
import GameActionScreen from "./GameActionScreen";


export default class LockDiceScreen extends BaseGameScreen<Record<string, number>> {
  name = Screen.LOCK_DICE;

  draw(state: GameState, config: IConfig) {
    const diceScorer = new DiceScorer(state.dice.values, config);
    drawTurnStats(
      state.getCurrentPlayer()?.name,
      state.turn,
      state.getDiceRollsLeft(),
      diceScorer.scoreYahtzee() > 0,
    );
    drawDiceValues(state.dice.values, state.dice.lock);
  }

  getChoices(state: GameState): IChoice<string, number>[] {
    return state.dice.values.map((value, index) => ({
      name: `${index}`,
      message: `Dice ${index + 1}`,
      hint: `${value}`,
      value: index,
    }));
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<Record<string, number>> {
    const choices = this.getChoices(state);
    return prompter.getInputFromMultiselect({
      name: this.name,
      message: config.messages.diceLockPrompt,
      limit: 5,
      choices,
      initial: choices.filter((_, i) => state.dice.lock[i]).map((choice) => choice.name),
    });
  }

  handleInput(input: Record<string, number>, state: GameState): BaseGameScreen<any> {
    state.dice.resetLock();
    const indicesToLock = Object.keys(input).map(key => input[key]);
    const diceLock = state.dice.values.map((_, i) => indicesToLock.includes(i));
    state.dice.setLock(diceLock);
    return new GameActionScreen();
  }
}