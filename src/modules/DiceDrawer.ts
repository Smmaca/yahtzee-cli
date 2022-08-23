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

/* Classic
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/

/* Digits
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|   1  | |   2  | |   3  | |   4  | |   5  | |   6  |
|______| |______| |______| |______| |______| |______|
*/

/* Palms
 ______   ______   ______   ______   ______   ______
|      | |    * | |    * | | *  * | | *  * | | *  * |
|   *  | |      | |   *  | |      | |   *  | | *  * |
|______| |_*____| |_*____| |_*__*_| |_*__*_| |_*__*_|
*/

/* Void
 ______   ______   ______   ______   ______   ______
|      | |    O | |    O | | O  O | | O  O | | O  O |
|   O  | |      | |   O  | |      | |   O  | | O  O |
|______| |_O____| |_O____| |_O__O_| |_O__O_| |_O__O_|
*/

/* Roman
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|   I  | |  II  | |  III | |  IV  | |   V  | |  VI  |
|______| |______| |______| |______| |______| |______|
*/

/* Twinkle
 ______   ______   ______   ______   ______   ______
|      | |    + | |    + | | +  + | | +  + | | +  + |
|   +  | |      | |   +  | |      | |   +  | | +  + |
|______| |_+____| |_+____| |_+__+_| |_+__+_| |_+__+_|
*/

/* Moneymaker
 ______   ______   ______   ______   ______   ______
|      | |    $ | |    $ | | $  $ | | $  $ | | $  $ |
|   $  | |      | |   $  | |      | |   $  | | $  $ |
|______| |_$____| |_$____| |_$__$_| |_$__$_| |_$__$_|
*/

/* Riddler
 ______   ______   ______   ______   ______   ______
|      | |    ? | |    ? | | ?  ? | | ?  ? | | ?  ? |
|   ?  | |      | |   ?  | |      | |   ?  | | ?  ? |
|______| |_?____| |_?____| |_?__?_| |_?__?_| |_?__?_|
*/

/* Wordy
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|  ONE | | TWO  | |THREE | | FOUR | | FIVE | |  SIX |
|______| |______| |______| |______| |______| |______|
*/

/* @#$%&!
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|   !  | |   @  | |   #  | |   $  | |   %  | |   &  |
|______| |______| |______| |______| |______| |______|
*/