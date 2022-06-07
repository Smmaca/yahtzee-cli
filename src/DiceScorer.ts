import { IConfig, YahtzeeScoreCategory } from "./types";

export default class DiceScorer {
  values: number[];

  fullHouseScore: number;
  smallStraightScore: number;
  largeStraightScore: number;
  yahtzeeScore: number;
  bonusYahtzeeScore: number;

  constructor(diceValues: number[], config: IConfig) {
    this.values = diceValues;
    this.fullHouseScore = config.scoreValues[YahtzeeScoreCategory.FullHouse];
    this.smallStraightScore = config.scoreValues[YahtzeeScoreCategory.SmallStraight];
    this.largeStraightScore = config.scoreValues[YahtzeeScoreCategory.LargeStraight];
    this.yahtzeeScore = config.scoreValues[YahtzeeScoreCategory.Yahtzee];
    this.bonusYahtzeeScore = config.scoreValues[YahtzeeScoreCategory.BonusYahtzees];
  }

  getCategoryScoreValue(category: YahtzeeScoreCategory): number {
    switch (category) {
      case YahtzeeScoreCategory.FullHouse:
        return this.fullHouseScore;
      case YahtzeeScoreCategory.SmallStraight:
        return this.smallStraightScore;
      case YahtzeeScoreCategory.LargeStraight:
        return this.largeStraightScore;
      case YahtzeeScoreCategory.Yahtzee:
        return this.yahtzeeScore;
      case YahtzeeScoreCategory.BonusYahtzees:
        return this.bonusYahtzeeScore;
      default:
        return 0;
    }
  }

  scoreCategory(category: YahtzeeScoreCategory): number {
    switch (category) {
      case YahtzeeScoreCategory.Ones:
        return this.scoreNumberCategory(1);
      case YahtzeeScoreCategory.Twos:
        return this.scoreNumberCategory(2);
      case YahtzeeScoreCategory.Threes:
        return this.scoreNumberCategory(3);
      case YahtzeeScoreCategory.Fours:
        return this.scoreNumberCategory(4);
      case YahtzeeScoreCategory.Fives:
        return this.scoreNumberCategory(5);
      case YahtzeeScoreCategory.Sixes:
        return this.scoreNumberCategory(6);
      case YahtzeeScoreCategory.ThreeOfAKind:
        return this.scoreNOfAKind(3);
      case YahtzeeScoreCategory.FourOfAKind:
        return this.scoreNOfAKind(4);
      case YahtzeeScoreCategory.FullHouse:
        return this.scoreFullHouse();
      case YahtzeeScoreCategory.SmallStraight:
        return this.scoreSmallStraight();
      case YahtzeeScoreCategory.LargeStraight:
        return this.scoreLargeStraight();
      case YahtzeeScoreCategory.Yahtzee:
        return this.scoreYahtzee();
      case YahtzeeScoreCategory.Chance:
        return this.sumDiceValues();
      case YahtzeeScoreCategory.BonusYahtzees:
        return this.scoreYahtzeeBonus();
      default:
        return 0;
    }
  }

  sumDiceValues(): number {
    return this.values.reduce((acc, cur) => acc + cur, 0);
  }

  scoreNumberCategory(number: number): number {
    return number * this.values.filter(v => v === number).length;
  }

  scoreNOfAKind(number: number): number {
    return this.values.some(v => this.values.filter(vv => vv === v).length >= number)
        ? this.sumDiceValues() : 0;
  }

  scoreFullHouse(): number {
    const uniqueNumbers = Array.from(new Set(this.values));
    // full house only works with 5 numbers, has only 2 unique numbers, and
    // has at least 2 of each number (there would be 3 of one number to make 5)
    return (this.values.length === 5 && uniqueNumbers.length === 2 
      && this.values.filter(v => v === uniqueNumbers[0]).length > 1 
      && this.values.filter(v => v === uniqueNumbers[1]).length > 1)
      ? this.fullHouseScore : 0;
  }

  scoreSmallStraight(): number {
    return ["12345", "23456", "1234", "2345", "3456", "13456", "12346"]
      .includes(Array.from(new Set(this.values)).sort().join(""))
      ? this.smallStraightScore : 0;
  }

  scoreLargeStraight() : number {
    return ["12345", "23456"].includes(this.values.slice().sort().join(""))
      ? this.largeStraightScore : 0;
  }

  scoreYahtzee(): number {
    const uniqueNumbers = Array.from(new Set(this.values));
    return (uniqueNumbers.length === 1 && uniqueNumbers[0] !== 0)
      ? this.yahtzeeScore : 0;
  }

  scoreYahtzeeBonus(): number {
    return this.scoreYahtzee() > 0 ? this.bonusYahtzeeScore : 0;
  }
}
