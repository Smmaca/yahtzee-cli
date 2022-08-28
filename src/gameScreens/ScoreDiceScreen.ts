import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { Achievement, IConfig, Screen, YahtzeeScoreCategory } from "../types";
import BaseGameScreen from "./BaseGameScreen";
import { constructChoice } from "../utils/screen";
import DiceScorer from "../modules/DiceScorer";
import { drawTurnStats } from "../utils/draw";
import ScoresheetScreen from "./ScoresheetScreen";
import { scoreLabels } from "../modules/Scoresheet";
import GameActionScreen from "./GameActionScreen";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameOverMultiplayerScreen from "./GameOverMultiplayerScreen";
import Statistics from "../modules/Statistics";
import DiceDrawer from "../modules/DiceDrawer";
import Achievements from "../modules/Achievements";

export enum ScoreDiceScreenInput {
  CANCEL = "cancel",
}

type ScoreDiceScreenInputs = ScoreDiceScreenInput | YahtzeeScoreCategory;

export const choiceLabels: Record<ScoreDiceScreenInputs, string> = {
  ...scoreLabels,
  [ScoreDiceScreenInput.CANCEL]: "Cancel",
};

const numberCategories = [
  YahtzeeScoreCategory.Ones,
  YahtzeeScoreCategory.Twos,
  YahtzeeScoreCategory.Threes,
  YahtzeeScoreCategory.Fours,
  YahtzeeScoreCategory.Fives,
  YahtzeeScoreCategory.Sixes,
];

export interface IScoreDiceOptions {
  jokerMode?: boolean;
  earnedAchievements: Achievement[];
}

export default class ScoreDiceScreen extends BaseGameScreen<ScoreDiceScreenInputs> {
  name = Screen.SCORE_DICE;

  constructor(private options: IScoreDiceOptions = { earnedAchievements: [] }) {
    super();
  }

  getGameOverScreen(state: GameState, config: IConfig, earnedScoreAchievements: Achievement[]): BaseGameScreen<any> {
    if (state.players.length === 1) {
      state.setCurrentPlayer(0);
      const player = state.getCurrentPlayer();

      const statsModule = new Statistics(config);
      statsModule.saveGameStatistics({ score: player.totalScore });

      const achievements = new Achievements(config);
      const earnedAchievements = [...earnedScoreAchievements]
        .concat(achievements.validateEndGameAchievements(state, player.score));

      return new GameOverSinglePlayerScreen({ earnedAchievements });
    } else if (state.players.length > 1) {
      return new GameOverMultiplayerScreen();
    } else {
      throw new Error("Cannot handle game over with no players");
    }
  }

  draw(state: GameState, config: IConfig) {
    const achievements = new Achievements(config);
    this.options.earnedAchievements.forEach(achievement => {
      achievements.renderAchievement(achievement);
    });

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

  getScoreDiceChoices(state: GameState, config: IConfig) {
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
          : `${diceScorer.scoreCategory(category) || ""}`;
        choices.push(choice);
      }
    });
  
    if (state.getDiceRollsLeft() > 0) {
      choices.push(constructChoice(ScoreDiceScreenInput.CANCEL, choiceLabels));
    }
  
    return choices;
  }

  /**
   * Joker rules
   * Score the total of all 5 dice in the appropriate upper section box.
   * If this box has already been filled in, score as follows in any open
   * lower section box:
   * - 3 of a kind: total of all five dice
   * - 4 of a kind: total of all five dice
   * - full house: 25
   * - small straight: 30
   * - large straight: 40
   * - chance: total of all five dice
   */
  getScoreJokerChoices(state: GameState, config: IConfig) {
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
        choice.hint = score[category] === null ? "" : `[${score[category]}]`,
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
    return prompter.getInputFromSelect<ScoreDiceScreenInput>({
      name: this.name,
      message: this.options.jokerMode
        ? config.messages.scoreJokerPrompt
        : config.messages.scoreDicePrompt,
      choices: this.options.jokerMode
        ? this.getScoreJokerChoices(state, config)
        : this.getScoreDiceChoices(state, config),
    });
  }

  handleInput(input: any, state: GameState, config: IConfig) {
    if (input === ScoreDiceScreenInput.CANCEL) {
      return new GameActionScreen();
    }

    const category = input as YahtzeeScoreCategory;
    const player = state.getCurrentPlayer();
    const diceScorer = new DiceScorer(state.dice.values, config);
    const achievements = new Achievements(config);
    const earnedAchievements: Achievement[] = [];

    if (this.options?.jokerMode) {
      if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        player.setScore(category, config.scoreValues[category]);
      } else if (numberCategories.includes(category)) {
        const score = diceScorer.scoreCategory(category);
        player.setScore(category, score);

        // Check for rollercoaster achievement (score 0 for a joker)
        if (score === 0 && achievements.validateAchievement(Achievement.ROLLERCOASTER, state, player.score)) {
          earnedAchievements.push(Achievement.ROLLERCOASTER);
          achievements.saveAchievements({ [Achievement.ROLLERCOASTER]: true });
        }
      } else if (Object.keys(scoreLabels).includes(category)) {
        player.setScore(category, diceScorer.scoreCategory(category));

        // Check for fortune achievement (score 30 in chance)
        if (category === YahtzeeScoreCategory.Chance
          && achievements.validateAchievement(Achievement.ROLLERCOASTER, state, player.score)
        ) {
          earnedAchievements.push(Achievement.FORTUNE);
          achievements.saveAchievements({ [Achievement.FORTUNE]: true });
        }
      } else {
        return this;
      }
    } else {
      if (category === YahtzeeScoreCategory.YahtzeeBonus) {
        player.setScore(
          YahtzeeScoreCategory.YahtzeeBonus,
          player.score[YahtzeeScoreCategory.YahtzeeBonus] += diceScorer.scoreYahtzeeBonus(),
        );

        // Check for joker and triple threat achievements
        earnedAchievements.push(...achievements.validateAchievements([
          Achievement.JOKER,
          Achievement.TRIPLE_THREAT,
        ], state, player.score));

        return new ScoreDiceScreen({ jokerMode: true, earnedAchievements });
      } else if (Object.keys(scoreLabels).includes(category)) {
        player.setScore(category, diceScorer.scoreCategory(category));

        // Check for fortune achievement (score 30 in chance)
        if (category === YahtzeeScoreCategory.Chance) {
          earnedAchievements.push(...achievements.validateAchievements([Achievement.FORTUNE], state, player.score));
        }

        // Check for yahtzee achievement (score yahtzee)
        if (category === YahtzeeScoreCategory.Yahtzee) {
          earnedAchievements.push(...achievements.validateAchievements([Achievement.YAHTZEE], state, player.score));
        }
      } else {
        return this;
      }
    }

    const gameOver = state.nextPlayer(); 

    return gameOver
      ? this.getGameOverScreen(state, config, earnedAchievements)
      : new ScoresheetScreen({ earnedAchievements });
  }
}