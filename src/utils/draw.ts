import figlet from "figlet";

export function drawTitle() {
  console.log(figlet.textSync("Yahtzee", { horizontalLayout: "default" }));
}

export function drawTurnStats(player: string, turn: number, rollsLeft: number, isYahtzee?: boolean) {
  console.log(`Player: ${player}     Turn: ${turn + 1}     Rolls left: ${rollsLeft}     ${isYahtzee ? "Yahtzee!" : ""}`);
}

export function drawDiceValues(diceRoll: number[], diceLock: boolean[]) {
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

/*
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/
