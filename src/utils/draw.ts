import figlet from "figlet";
import config from "../config";
import { isYahtzee } from "../handleScoreDiceMode";
import { IGame } from "../types";

export function drawTitle() {
  console.log(figlet.textSync("Yahtzee", { horizontalLayout: "default" }));
}

export function drawTurnStats(game: IGame) {
  console.log(`Turn: ${game.turn + 1}       Rolls left: ${
    config.rollsPerTurn - game.rollNumber}       ${
      isYahtzee(game.diceRoll) ? "Yahtzee!" : ""}`);
}

export function drawDiceValues(game: IGame) {
  if (!game.diceRoll.length || !game.diceRoll.filter(d => d).length) {
    console.log("\n");
    return;
  }

  const rows = ["", "", "", "", "", ""];
  const len = game.diceRoll.length;

  for (let i = 0; i < len; i += 1) {
    switch(game.diceRoll[i]) {
      case 1:
        rows[0] += " ______  ";
        rows[1] += "|      | ";
        rows[2] += "|   0  | ";
        rows[3] += "|______| ";
        break;
      case 2:
        rows[0] += " ______  ";
        rows[1] += "|    0 | ";
        rows[2] += "|      | ";
        rows[3] += "|_0____| ";
        break;
      case 3:
        rows[0] += " ______  ";
        rows[1] += "|    0 | ";
        rows[2] += "|   0  | ";
        rows[3] += "|_0____| ";
        break;
      case 4:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "|      | ";
        rows[3] += "|_0__0_| ";
        break;
      case 5:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "|   0  | ";
        rows[3] += "|_0__0_| ";
        break;
      case 6:
        rows[0] += " ______  ";
        rows[1] += "| 0  0 | ";
        rows[2] += "| 0  0 | ";
        rows[3] += "|_0__0_| ";
        break;
      default:
        rows[0] += "";
        rows[1] += "";
        rows[2] += "";
        rows[3] += "";
    }

    if (game.diceLock[i]) {
      rows[5] += "    L    "
    } else {
      rows[5] += "         "
    }
  }
  console.log(rows.join("\n") + "\n");
}

/*
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/
