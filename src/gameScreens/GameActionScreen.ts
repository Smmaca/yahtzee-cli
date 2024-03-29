import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import { constructChoice } from "../utils/screen";
import DiceScorer from "../modules/DiceScorer";
import { drawTurnStats } from "../utils/draw";
import QuitConfirmScreen from "./QuitConfirmScreen";
import ScoresheetScreen from "./ScoresheetScreen";
import LockDiceScreen from "./LockDiceScreen";
import ScoreDiceScreen from "./ScoreDiceScreen";
import DiceDrawer from "../modules/DiceDrawer";

export enum GameActionScreenInput {
  ROLL_DICE = "rollDice",
  ROLL_AGAIN = "rollAgain",
  LOCK_DICE = "lockDice",
  SCORE_DICE = "scoreDice",
  SEE_SCORESHEET = "seeScoresheet",
  QUIT_TO_MAIN_MENU = "quitToMainMenu",
  QUIT = "quit",
}

export const choiceLabels: Record<GameActionScreenInput, string> = {
  [GameActionScreenInput.ROLL_DICE]: "Roll dice",
  [GameActionScreenInput.ROLL_AGAIN]: "Roll again",
  [GameActionScreenInput.LOCK_DICE]: "Lock dice",
  [GameActionScreenInput.SCORE_DICE]: "Score dice",
  [GameActionScreenInput.SEE_SCORESHEET]: "See scoresheet",
  [GameActionScreenInput.QUIT_TO_MAIN_MENU]: "Quit to main menu",
  [GameActionScreenInput.QUIT]: "Quit",
};

export default class GameActionScreen extends BaseGameScreen<GameActionScreenInput> {
  name = Screen.GAME_ACTION;

  draw(state: GameState, config: IConfig) {
    const diceScorer = new DiceScorer(state.dice.values, config);
    drawTurnStats(
      state.getCurrentPlayer()?.name,
      state.turn,
      state.getDiceRollsLeft(),
      diceScorer.scoreYahtzee() > 0,
    );
    const diceDrawer = new DiceDrawer(state.dice.values, state.dice.lock);
    diceDrawer.renderDice(state.diceDesign);
  }

  getChoices(state: GameState, config: IConfig) {
    const choices = [];
    if (state.rollNumber === 0) {
      choices.push(constructChoice(GameActionScreenInput.ROLL_DICE, choiceLabels));
    } else {
      if (state.rollNumber < config.rollsPerTurn) {
        choices.push(
          constructChoice(GameActionScreenInput.ROLL_AGAIN, choiceLabels),
          constructChoice(GameActionScreenInput.LOCK_DICE, choiceLabels),
        );
      }
      choices.push(constructChoice(GameActionScreenInput.SCORE_DICE, choiceLabels));
    }
    choices.push(
      constructChoice(GameActionScreenInput.SEE_SCORESHEET, choiceLabels),
      constructChoice(GameActionScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
      constructChoice(GameActionScreenInput.QUIT, choiceLabels),
    );
    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<GameActionScreenInput>({
      name: this.name,
      message: config.messages.gameActionPrompt,
      choices: this.getChoices(state, config),
    });
  }

  handleInput(input: any, state: GameState) {
    switch(input) {
      case GameActionScreenInput.ROLL_DICE:
      case GameActionScreenInput.ROLL_AGAIN:
        state.dice.roll();
        state.incrementRollNumber();
        return this;
      case GameActionScreenInput.LOCK_DICE:
        return new LockDiceScreen();
      case GameActionScreenInput.SEE_SCORESHEET:
        return new ScoresheetScreen();
      case GameActionScreenInput.SCORE_DICE:
        return new ScoreDiceScreen();
      case GameActionScreenInput.QUIT_TO_MAIN_MENU:
        return new QuitConfirmScreen({ previousScreen: this, softQuit: true });
      case GameActionScreenInput.QUIT:
        return new QuitConfirmScreen({ previousScreen: this });
      default:
        return this;
    }
  }
}