import { DiceDesign, getDiceDesign } from "../utils/diceDesigns";

export default class DiceDrawer {
  diceDesign: DiceDesign;
  diceValues: number[];
  diceLock: boolean[];

  diceLockSymbol = "L";
  diceTop = " ______ ";
  diceSide = "|";
  diceContents: string[][];

  constructor(diceDesign: DiceDesign, diceValues: number[], diceLock: boolean[]) {
    this.diceDesign = diceDesign;
    this.diceValues = diceValues;
    this.diceLock = diceLock;
    this.diceContents = getDiceDesign(this.diceDesign);
  }

  setDiceDesign(diceDesign: DiceDesign) {
    this.diceDesign = diceDesign;
    this.diceContents = getDiceDesign(this.diceDesign);
  }

  drawDiceLock(index): string {
    return `    ${this.diceLock[index] ? this.diceLockSymbol : " "}    `;
  }

  drawDice(): string {
    if (!this.diceValues.length || !this.diceValues.filter(d => d).length) {
      return "\n";
    }

    let drawing = "";

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < this.diceValues.length; j++) {
        if (i === 0) {
          drawing += this.diceTop + " ";
        }
        if (i > 0 && i < 4) {
          drawing += this.diceSide + this.diceContents[this.diceValues[j] - 1][i - 1] + this.diceSide + " ";
        }
        if (i === 5) {
          drawing += this.drawDiceLock(j);
        }
      }
      drawing += "\n";
    }

    return drawing;
  }

  renderDice(): void {
    console.log(this.drawDice());
  }
}
