import { YahtzeeScore, YahtzeeScoreCategory } from "./types";
import Scoresheet from "./utils/Scoresheet";

export default class Player {
  name: string;
  score: YahtzeeScore;

  constructor(name: string) {
    this.name = name;
    this.resetScore();
  }

  get totalScore(): number {
    const scoresheet = new Scoresheet(this.score);
    return scoresheet.scoreTotal();
  }

  setScore(category: YahtzeeScoreCategory, score: number) {
    this.score[category] = score;
  }

  resetScore() {
    this.score = {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      yahtzee: null,
      chance: null,
      bonusYahtzees: 0,
    };
  }

  renderScoresheet() {
    const scoresheet = new Scoresheet(this.score);
    scoresheet.render();
  }
}