import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { GameMode, IConfig, YahtzeeScoreCategory } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import { constructChoice } from "../utils/screenUtils";
import DiceScorer from "../modules/DiceScorer";
import { drawDiceValues, drawTurnStats } from "../utils/draw";
import ScoresheetScreen from "./ScoresheetScreen";
import { scoreLabels } from "../modules/Scoresheet";
import GameActionScreen from "./GameActionScreen";
import ScoreJokerScreen from "./ScoreJokerScreen";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameOverMultiplayerScreen from "./GameOverMultiplayerScreen";

export enum ScoreDiceScreenInput {
  CANCEL = "cancel",
}

type ScoreDiceScreenInputs = ScoreDiceScreenInput | YahtzeeScoreCategory;

export const choiceLabels: Record<ScoreDiceScreenInputs, string> = {
  ...scoreLabels,
  [ScoreDiceScreenInput.CANCEL]: "Cancel",
};

export default class ScoreDiceScreen extends BaseGameScreen<ScoreDiceScreenInputs> {

  getGameOverScreen(state: GameState): BaseGameScreen<any> {
    if (state.players.length === 1) {
      state.setCurrentPlayer(0);
      // const stats = statsLoader.getData();
      // const score = state.getCurrentPlayer().totalScore;
      // stats.scores.push(({ score, timestamp: Date.now() }));
      // statsLoader.setData(stats);
      return new GameOverSinglePlayerScreen();
    } else if (state.players.length > 1) {
      return new GameOverMultiplayerScreen();
    } else {
      throw new Error("Cannot handle game over with no players");
    }
  }

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

  getChoices(state: GameState, config: IConfig) {
    const choices = [];

    const diceScorer = new DiceScorer(state.dice.values, config);
    const score = state.getCurrentPlayer().score;

    Object.keys(score).forEach(key => {
      const category = key as YahtzeeScoreCategory;
      const choice = constructChoice(category, choiceLabels);

      if (category === YahtzeeScoreCategory.YahtzeeBonus) {
        choice.disabled = !score[YahtzeeScoreCategory.Yahtzee]
        || !diceScorer.scoreYahtzeeBonus();
        choice.hint = `[${score[category]}]${
          !choice.disabled ? ` + ${diceScorer.scoreYahtzeeBonus()}` : ""}`;
        choices.push(choice);
      } else {
        choice.disabled = score[category] !== null;
        choice.hint = score[category] !== null
          ? `[${score[category]}]`
          : `${diceScorer.scoreCategory(category)}`;
        choices.push(choice);
      }
    });
  
    if (state.getDiceRollsLeft() > 0) {
      choices.push(constructChoice(ScoreDiceScreenInput.CANCEL, choiceLabels));
    }
  
    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<ScoreDiceScreenInput>({
      name: Screen.SCORE_DICE,
      message: config.messages.scoreDicePrompt,
      choices: this.getChoices(state, config),
    });
  }

  handleInput(input: any, state: GameState, config: IConfig) {
    if (input === ScoreDiceScreenInput.CANCEL) {
      return new GameActionScreen();
    }

    const category = input as YahtzeeScoreCategory;
    const player = state.getCurrentPlayer();
    const diceScorer = new DiceScorer(state.dice.values, config);

    if (category === YahtzeeScoreCategory.YahtzeeBonus) {
      player.setScore(
        YahtzeeScoreCategory.YahtzeeBonus,
        player.score[YahtzeeScoreCategory.YahtzeeBonus] += diceScorer.scoreYahtzeeBonus(),
      );
      return new ScoreJokerScreen();
    } else if (Object.keys(scoreLabels).includes(category)) {
      player.setScore(category, diceScorer.scoreCategory(category));

      // TODO: fix this way of getting next screen
     const nextScreen = state.nextPlayer(); 

     if (nextScreen === GameMode.GAME_OVER) {
       return this.getGameOverScreen(state);
     } else if (nextScreen === GameMode.VIEW_SCORE) {
       return new ScoresheetScreen();
     }
    }

    return this;
  }
}