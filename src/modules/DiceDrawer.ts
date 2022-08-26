import { DiceDesign, getDiceDesign } from "../utils/diceDesigns";

export default class DiceDrawer {
  diceValues: number[];
  diceLock: boolean[];

  diceLockSymbol = "L";
  diceTop = " ______ ";
  diceSide = "|";

  constructor(diceValues: number[], diceLock: boolean[]) {
    this.diceValues = diceValues;
    this.diceLock = diceLock;
  }

  drawDiceLock(index): string {
    return `    ${this.diceLock[index] ? this.diceLockSymbol : " "}    `;
  }

  drawDice(design: DiceDesign): string {
    if (!this.diceValues.length || !this.diceValues.filter(d => d).length) {
      return "\n";
    }

    const diceContents = getDiceDesign(design);

    let drawing = "";

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < this.diceValues.length; j++) {
        if (i === 0) {
          drawing += this.diceTop + " ";
        }
        if (i > 0 && i < 4) {
          drawing += this.diceSide + diceContents[this.diceValues[j] - 1][i - 1] + this.diceSide + " ";
        }
        if (i === 5) {
          drawing += this.drawDiceLock(j);
        }
      }
      drawing += "\n";
    }

    return drawing;
  }

  renderDice(design: DiceDesign): void {
    console.log(this.drawDice(design));
  }
}
