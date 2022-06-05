import Select from "enquirer/lib/prompts/Select";
import config from "./config";
import { resetDiceLock } from "./handleDiceLockMode";
import { GameMode, IGame, YahtzeeScoreCategory } from "./types";
import { rollDice } from "./utils/diceRoller";
import { drawDiceValues, drawTurnStats } from "./utils/draw";
import { changeMode } from "./utils/modeHelper";
import { scoreLabels } from "./utils/Scoresheet";

export function isYahtzee(_diceRoll: number[]): boolean {
  const diceRoll = _diceRoll.slice();
  const filtered = Array.from(new Set(diceRoll));
  return filtered.length === 1 && filtered[0] !== 0;
}

function calculateScore(category: YahtzeeScoreCategory, _diceRoll: number[]) {
  const diceRoll = _diceRoll.slice();
  switch (category) {
    case YahtzeeScoreCategory.Ones:
      return 1 * diceRoll.filter(d => d === 1).length;
    case YahtzeeScoreCategory.Twos:
      return 2 * diceRoll.filter(d => d === 2).length;
    case YahtzeeScoreCategory.Threes:
      return 3 * diceRoll.filter(d => d === 3).length;
    case YahtzeeScoreCategory.Fours:
      return 4 * diceRoll.filter(d => d === 4).length;
    case YahtzeeScoreCategory.Fives:
      return 5 * diceRoll.filter(d => d === 5).length;
    case YahtzeeScoreCategory.Sixes:
      return 6 * diceRoll.filter(d => d === 6).length;
    case YahtzeeScoreCategory.ThreeOfAKind:
      return diceRoll.some(d => diceRoll.filter(dd => dd === d).length >= 3)
        ? sumDiceRoll(diceRoll) : 0;
    case YahtzeeScoreCategory.FourOfAKind:
      return diceRoll.some(d => diceRoll.filter(dd => dd === d).length >= 4)
        ? sumDiceRoll(diceRoll) : 0;
    case YahtzeeScoreCategory.FullHouse:
      return (diceRoll.find(d => diceRoll.filter(dd => dd === d).length === 2)
        && diceRoll.find(d => diceRoll.filter(dd => dd === d).length === 3))
        ? 25 : 0;
    case YahtzeeScoreCategory.SmallStraight:
      return ["12345", "23456", "1234", "2345", "3456", "13456", "12346"]
        .includes(Array.from(new Set(diceRoll)).sort().join("")) ? 30 : 0;
    case YahtzeeScoreCategory.LargeStraight:
      return ["12345", "23456"]
        .includes(diceRoll.sort().join("")) ? 40 : 0;
    case YahtzeeScoreCategory.Yahtzee:
      return isYahtzee(diceRoll) ? 50 : 0;
    case YahtzeeScoreCategory.Chance:
      return sumDiceRoll(diceRoll);
    case YahtzeeScoreCategory.BonusYahtzees:
      return isYahtzee(diceRoll) ? 100 : 0;
    default:
      return 0;
  }
}

function sumDiceRoll(diceRoll: number[]) {
  return diceRoll.reduce((acc, cur) => acc + cur, 0);
}

function getPromptChoices(game: IGame) {
  const choices = [];

  Object.keys(game.score).forEach(key => {
    const category = key as YahtzeeScoreCategory;

    if (category === YahtzeeScoreCategory.BonusYahtzees) {
      choices.push({
        message: scoreLabels[category],
        name: category,
        value: category,
        hint: `[${game.score[category]}]${
          category === YahtzeeScoreCategory.BonusYahtzees ? " + 100" : ""}`,
        disabled: game.score[YahtzeeScoreCategory.Yahtzee] === null
          || calculateScore(category, game.diceRoll) === 0
      });
    } else {
      choices.push({
        message: scoreLabels[category],
        name: category,
        value: category,
        hint: game.score[category] !== null
          ? `[${game.score[category]}]`
          : calculateScore(category, game.diceRoll),
        disabled: game.score[category] !== null,
      });
    }
  });

  if (config.rollsPerTurn - game.rollNumber > 0) {
    choices.push({
      message: "Cancel",
      name: "cancel",
      value: "cancel",
    });
  }

  return choices;
}

export function resetDiceRoll(game: IGame) {
  game.diceRoll = rollDice(config.diceCount);
  game.diceRoll = game.diceRoll.map(() => 0);
}

export default async function handleScoreDiceMode(game: IGame): Promise<IGame> {
  const _game = { ...game };

  drawTurnStats(game);
  drawDiceValues(game);

  const prompt = new Select({
    name: "scoreDiceMenu",
    message: config.messages.scoreDicePrompt,
    choices: getPromptChoices(_game),
  });

  return prompt.run().then((answer) => {
    if (answer === "cancel") {
      return changeMode(_game, GameMode.ROLL);
    }
    const category = answer as YahtzeeScoreCategory;
    if (category === YahtzeeScoreCategory.BonusYahtzees
      && _game.score[YahtzeeScoreCategory.Yahtzee] !== null) {
      _game.score[YahtzeeScoreCategory.BonusYahtzees] += calculateScore(category, _game.diceRoll);
    } else {
      _game.score[category] = calculateScore(category, _game.diceRoll);
    }
    if (_game.turn === 12) {
      return changeMode(_game, GameMode.GAME_OVER);
    } 
    resetDiceLock(_game);
    _game.turn++;
    _game.rollNumber = 0;
    resetDiceRoll(_game);
    resetDiceLock(_game);
    return changeMode(_game, GameMode.VIEW_SCORE);
  });
}
