import figlet from "figlet";
import { DiceDesign } from "../modules/Settings";

export function drawTitle() {
  console.log(figlet.textSync("Yahtzee!", { horizontalLayout: "default" }));
}

export function drawTurnStats(player: string, turn: number, rollsLeft: number, isYahtzee?: boolean) {
  console.log(`Player: ${player}     Turn: ${turn + 1}     Rolls left: ${rollsLeft}     ${isYahtzee ? "Yahtzee!" : ""}`);
}

export function drawDiceValues(diceRoll: number[], diceLock: boolean[], style: DiceDesign = DiceDesign.CLASSIC) {
  if (!diceRoll.length || !diceRoll.filter(d => d).length) {
    console.log("\n");
    return;
  }

  const rows = ["", "", "", "", "", ""];
  const len = diceRoll.length;

  for (let i = 0; i < len; i += 1) {
    switch(diceRoll[i]) {
      case 1:
        rows[0] += " ______  ";
        rows[1] += "|      | ";
        rows[2] += "|   0  | ";
        rows[3] += "|______| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      case 2:
        rows[0] += " ______  ";
        rows[1] += "|    0 | ";
        rows[2] += "|      | ";
        rows[3] += "|_0____| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      case 3:
        rows[0] += " ______  ";
        rows[1] += "|    0 | ";
        rows[2] += "|   0  | ";
        rows[3] += "|_0____| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      case 4:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "|      | ";
        rows[3] += "|_0__0_| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      case 5:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "|   0  | ";
        rows[3] += "|_0__0_| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      case 6:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "| 0  0 | ";
        rows[3] += "|_0__0_| ";
        if (diceLock[i]) {
          rows[5] += "    L    "
        } else {
          rows[5] += "         "
        }
        break;
      default:
        rows[0] += "";
        rows[1] += "";
        rows[2] += "";
        rows[3] += "";
        rows[5] += "";
    }
  }
  console.log(rows.join("\n") + "\n");
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