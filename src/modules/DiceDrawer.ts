import { DiceDesign } from "./Settings";

export default class DiceDrawer {
  diceDesign: DiceDesign;
  diceValues: number[];
  diceLock: boolean[];

  constructor(diceDesign: DiceDesign, diceValues: number[], diceLock: boolean[]) {
    this.diceDesign = diceDesign;
    this.diceValues = diceValues;
    this.diceLock = diceLock;
  }

  drawDiceLock(index) {
    return this.diceLock[index] ? "    L    " : "         ";
  }

  drawDice() {
    if (!this.diceValues.length || !this.diceValues.filter(d => d).length) {
      console.log("\n");
      return;
    }

    const rows = ["", "", "", "", "", ""];
    const len = this.diceValues.length;

    for (let i = 0; i < len; i += 1) {
      switch(this.diceValues[i]) {
        case 1:
          rows[0] += " ______  ";
          rows[1] += "|      | ";
          rows[2] += "|   0  | ";
          rows[3] += "|______| ";
          rows[5] += this.drawDiceLock(i);
          break;
        case 2:
          rows[0] += " ______  ";
          rows[1] += "|    0 | ";
          rows[2] += "|      | ";
          rows[3] += "|_0____| ";
          rows[5] += this.drawDiceLock(i);
          break;
        case 3:
          rows[0] += " ______  ";
          rows[1] += "|    0 | ";
          rows[2] += "|   0  | ";
          rows[3] += "|_0____| ";
          rows[5] += this.drawDiceLock(i);
          break;
        case 4:
          rows[0] += " ______  ";
          rows[1] += "| 0  0 | ";
          rows[2] += "|      | ";
          rows[3] += "|_0__0_| ";
          rows[5] += this.drawDiceLock(i);
          break;
        case 5:
          rows[0] += " ______  ";
          rows[1] += "| 0  0 | ";
          rows[2] += "|   0  | ";
          rows[3] += "|_0__0_| ";
          rows[5] += this.drawDiceLock(i);
          break;
        case 6:
          rows[0] += " ______  ";
          rows[1] += "| 0  0 | ";
          rows[2] += "| 0  0 | ";
          rows[3] += "|_0__0_| ";
          rows[5] += this.drawDiceLock(i);
          break;

        default:
          rows[0] += "";
          rows[1] += "";
          rows[2] += "";
          rows[3] += "";
          rows[5] += "";
      }
    }
  }
}