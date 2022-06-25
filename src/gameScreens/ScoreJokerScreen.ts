import GameState from "../modules/GameState";
import { IPrompter } from "../prompters/BasePrompter";
import { GameMode, IConfig, YahtzeeScoreCategory } from "../types";
import BaseGameScreen, { Screen } from "./BaseGameScreen";
import { constructChoice } from "../utils/screenUtils";
import DiceScorer from "../modules/DiceScorer";
import { drawDiceValues, drawTurnStats } from "../utils/draw";
import ScoresheetScreen from "./ScoresheetScreen";
import { scoreLabels } from "../modules/Scoresheet";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameOverMultiplayerScreen from "./GameOverMultiplayerScreen";

export type ScoreJokerScreenInput = YahtzeeScoreCategory;

export const choiceLabels: Record<ScoreJokerScreenInput, string> = {
  ...scoreLabels,
};

const numberCategories = [
  YahtzeeScoreCategory.Ones,
  YahtzeeScoreCategory.Twos,
  YahtzeeScoreCategory.Threes,
  YahtzeeScoreCategory.Fours,
  YahtzeeScoreCategory.Fives,
  YahtzeeScoreCategory.Sixes,
];

export default class ScoreJokerScreen extends BaseGameScreen<ScoreJokerScreenInput> {

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

    const score = state.getCurrentPlayer().score;
    const diceScorer = new DiceScorer(state.dice.values, config);

    const yahtzeeNumberCategory = numberCategories[state.dice.values[0] - 1];
    const yahtzeeOtherNumberCategories = numberCategories
      .filter(category => category !== yahtzeeNumberCategory);

    [
      ">> Score in the relevant number category <<",
      yahtzeeNumberCategory,
      ">> Score in any lower section category <<",
      YahtzeeScoreCategory.ThreeOfAKind,
      YahtzeeScoreCategory.FourOfAKind,
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
      YahtzeeScoreCategory.Chance,
      ">> Score zero in any number category <<",
      ...yahtzeeOtherNumberCategories,
    ].forEach((key, i) => {
      const category = key as YahtzeeScoreCategory;
      if (key.startsWith(">>")) {
        choices.push({
          message: key,
          name: i,
          value: i,
          role: "separator",
        });
      } else if (category === yahtzeeNumberCategory) {
        const choice = constructChoice(category, choiceLabels);
        choice.hint = score[category] === null
          ? `${diceScorer.scoreCategory(category)}`
          : `[${score[category]}]`;
        choice.disabled = score[category] !== null;
        choices.push(choice);
      } else if (yahtzeeOtherNumberCategories.includes(category)) {
        const choice = constructChoice(category, choiceLabels);
        choice.hint = score[category] === null ? "0" : `[${score[category]}]`,
        choice.disabled = score[category] !== null
          || score[yahtzeeNumberCategory] === null
          || [
            YahtzeeScoreCategory.ThreeOfAKind,
            YahtzeeScoreCategory.FourOfAKind,
            YahtzeeScoreCategory.FullHouse,
            YahtzeeScoreCategory.SmallStraight,
            YahtzeeScoreCategory.LargeStraight,
            YahtzeeScoreCategory.Chance
          ].some(c => score[c] === null);
        choices.push(choice);
      } else if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        const choice = constructChoice(category, choiceLabels);
        choice.hint = score[category] === null
          ? `${diceScorer.getCategoryScoreValue(category)}`
          : `[${score[category]}]`;
        choice.disabled = score[category] !== null || score[yahtzeeNumberCategory] === null;
        choices.push(choice);
      } else {
        const choice = constructChoice(category, choiceLabels);
        choice.hint = score[category] === null
          ? `${diceScorer.scoreCategory(category)}`
          : `[${score[category]}]`;
        choice.disabled = score[category] !== null || score[yahtzeeNumberCategory] === null;
        choices.push(choice);
      }
    });

    return choices;
  }

  getInput(prompter: IPrompter, state: GameState, config: IConfig) {
    return prompter.getInputFromSelect<ScoreJokerScreenInput>({
      name: Screen.SCORE_JOKER,
      message: config.messages.scoreJokerPrompt,
      choices: this.getChoices(state, config),
    });
  }

  handleInput(input: any, state: GameState, config: IConfig) {
    const category = input as YahtzeeScoreCategory;
    const player = state.getCurrentPlayer();
    const diceScorer = new DiceScorer(state.dice.values, config);

    if ([
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
    ].includes(category)) {
      player.setScore(category, config.scoreValues[category]);
    } else if (Object.keys(scoreLabels).includes(category)) {
      player.setScore(category, diceScorer.scoreCategory(category));
    } else {
      return this;
    }
    
    // TODO: fix this way of getting next screen
    const nextScreen = state.nextPlayer(); 

    if (nextScreen === GameMode.GAME_OVER) {
      return this.getGameOverScreen(state);
    } else if (nextScreen === GameMode.VIEW_SCORE) {
      return new ScoresheetScreen();
    }

    return this;
  }
}