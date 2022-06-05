import figlet from "figlet";

export function drawTitle() {
  console.log(figlet.textSync("Yahtzee", { horizontalLayout: "full" }));
}

export function drawTurnStats(game) {
  console.log(`Turn: ${game.turn + 1}     Rolls left: ${3 - game.rollNumber}`);
}

export function drawDiceValues(game) {
  let row1 = "";
  let row2 = "";
  let row3 = "";
  let row4 = "";
  let row6 = "";
  const len = game.diceRoll.length;
  for(var i = 0; i < len; i += 1) {
    row1 += " ______  ";
    switch(game.diceRoll[i]) {
      case 1:
        row2 += "|      | ";
        row3 += "|   0  | ";
        row4 += "|______| ";
        break;
      case 2:
        row2 += "|    0 | ";
        row3 += "|      | ";
        row4 += "|_0____| ";
        break;
      case 3:
        row2 += "|    0 | ";
        row3 += "|   0  | ";
        row4 += "|_0____| ";
        break;
      case 4:
        row2 += "| 0  0 | ";
        row3 += "|      | ";
        row4 += "|_0__0_| ";
        break;
      case 5:
        row2 += "| 0  0 | ";
        row3 += "|   0  | ";
        row4 += "|_0__0_| ";
        break;
      case 6:
        row2 += "| 0  0 | ";
        row3 += "| 0  0 | ";
        row4 += "|_0__0_| ";
        break;
      default:
        row2 += "";
        row3 += "";
        row4 += "";
    }

    if (game.diceLock[i]) {
      row6 += "    L    "
    } else {
      row6 += "         "
    }
  }
  console.log(row1 + "\n" + row2 + "\n" + row3 + "\n" + row4 + "\n" + "\n" + row6 + "\n");
}

/*
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/
