import Prompt from "enquirer/lib/prompt";
import Table from "cli-table";

export interface YatzeeScore {
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  fives: number;
  sixes: number;
  threeOfAKind: number;
  fourOfAKind: number;
  fullHouse: number;
  smallStraight: number;
  largeStraight: number;
  yahtzee: number;
  chance: number;
  bonusYahtzees: number;
}

export default class ScoreSheet {
  diceRoll: number[];
  yahtzeeScore: YatzeeScore;

  constructor(options) {
    this.diceRoll = options.diceRoll;
    this.yahtzeeScore = options.yahtzeeScore;
  }

  scoreTopSection() {
    return this.yahtzeeScore.ones
        + this.yahtzeeScore.twos
        + this.yahtzeeScore.threes
        + this.yahtzeeScore.fours
        + this.yahtzeeScore.fives
        + this.yahtzeeScore.sixes;
  }

  scoreTopSectionBonus(topSectionScore: number) {
    return topSectionScore >= 63 ? 35 : 0;
  }

  render() {

    const table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    });

    table.push(
      ["Aces", this.yahtzeeScore.ones],
      ["Twos", this.yahtzeeScore.twos],
      ["Threes", this.yahtzeeScore.threes],
      ["Fours", this.yahtzeeScore.fours],
      ["Fives", this.yahtzeeScore.fives],
      ["Sixes", this.yahtzeeScore.sixes],
      ["Total score", this.scoreTopSection()],
      ["Bonus", this.scoreTopSectionBonus(this.scoreTopSection())],
      ["Total", this.scoreTopSection() + this.scoreTopSectionBonus(this.scoreTopSection())],
    );
  }
}