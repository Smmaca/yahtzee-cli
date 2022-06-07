import Table from "cli-table";
import { YahtzeeScore, YahtzeeScoreCategory } from "./types";

export const scoreLabels: Record<YahtzeeScoreCategory, string> = {
  [YahtzeeScoreCategory.Ones]: "Aces",
  [YahtzeeScoreCategory.Twos]: "Twos",
  [YahtzeeScoreCategory.Threes]: "Threes",
  [YahtzeeScoreCategory.Fours]: "Fours",
  [YahtzeeScoreCategory.Fives]: "Fives",
  [YahtzeeScoreCategory.Sixes]: "Sixes",
  [YahtzeeScoreCategory.ThreeOfAKind]: "Three of a Kind",
  [YahtzeeScoreCategory.FourOfAKind]: "Four of a Kind",
  [YahtzeeScoreCategory.FullHouse]: "Full House",
  [YahtzeeScoreCategory.SmallStraight]: "Small Straight",
  [YahtzeeScoreCategory.LargeStraight]: "Large Straight",
  [YahtzeeScoreCategory.Yahtzee]: "Yahtzee",
  [YahtzeeScoreCategory.Chance]: "Chance",
  [YahtzeeScoreCategory.YahtzeeBonus]: "Bonus Yahtzees",
};

export default class Scoresheet {
  score: YahtzeeScore;

  constructor(score: YahtzeeScore) {
    this.score = score;
  }

  scoreTopSection() {
    return (this.score.ones || 0)
        + (this.score.twos || 0)
        + (this.score.threes || 0)
        + (this.score.fours || 0)
        + (this.score.fives || 0)
        + (this.score.sixes || 0);
  }

  scoreTopSectionBonus(topSectionScore: number) {
    return topSectionScore >= 63 ? 35 : 0;
  }

  scoreBottomSection() {
    return (this.score.threeOfAKind || 0)
        + (this.score.fourOfAKind || 0)
        + (this.score.fullHouse || 0)
        + (this.score.smallStraight || 0)
        + (this.score.largeStraight || 0)
        + (this.score.yahtzee || 0)
        + (this.score.chance || 0)
        + (this.score.yahtzeeBonus || 0);
  }

  scoreTotal() {
    return this.scoreTopSection()
      + this.scoreTopSectionBonus(this.scoreTopSection())
      + this.scoreBottomSection();
  }

  renderScore(score: number) {
    if (score === null) {
      return ""
    } else {
      return score;
    }
  }

  render() {
    const table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    });

    table.push(
      [scoreLabels[YahtzeeScoreCategory.Ones], this.renderScore(this.score.ones), "", scoreLabels[YahtzeeScoreCategory.ThreeOfAKind], this.renderScore(this.score.threeOfAKind)],
      [scoreLabels[YahtzeeScoreCategory.Twos], this.renderScore(this.score.twos), "", scoreLabels[YahtzeeScoreCategory.FourOfAKind], this.renderScore(this.score.fourOfAKind)],
      [scoreLabels[YahtzeeScoreCategory.Threes], this.renderScore(this.score.threes), "", scoreLabels[YahtzeeScoreCategory.FullHouse], this.renderScore(this.score.fullHouse)],
      [scoreLabels[YahtzeeScoreCategory.Fours], this.renderScore(this.score.fours), "", scoreLabels[YahtzeeScoreCategory.SmallStraight], this.renderScore(this.score.smallStraight)],
      [scoreLabels[YahtzeeScoreCategory.Fives], this.renderScore(this.score.fives), "", scoreLabels[YahtzeeScoreCategory.LargeStraight], this.renderScore(this.score.largeStraight)],
      [scoreLabels[YahtzeeScoreCategory.Sixes], this.renderScore(this.score.sixes), "", scoreLabels[YahtzeeScoreCategory.Yahtzee], this.renderScore(this.score.yahtzee)],
      ["Total score", this.scoreTopSection(), "", scoreLabels[YahtzeeScoreCategory.Chance], this.renderScore(this.score.chance)],
      ["Bonus", this.scoreTopSectionBonus(this.scoreTopSection()), "", scoreLabels[YahtzeeScoreCategory.YahtzeeBonus], this.score.yahtzeeBonus],
      ["Total", this.scoreTopSection() + this.scoreTopSectionBonus(this.scoreTopSection()), "", "Total", this.scoreBottomSection()],
    );

    console.log(table.toString());

    const grandTotal = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
          , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
          , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
          , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    });

    grandTotal.push(
      ["Grand total", this.scoreTotal()],
    );

    console.log(grandTotal.toString() + "\n");
  }
}