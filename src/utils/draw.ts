import figlet from "figlet";

export function drawTitle() {
  console.log(figlet.textSync("Yahtzee!", { horizontalLayout: "default" }));
}

export function drawTurnStats(player: string, turn: number, rollsLeft: number, isYahtzee?: boolean) {
  console.log(`Player: ${player}     Turn: ${turn + 1}     Rolls left: ${rollsLeft}     ${isYahtzee ? "Yahtzee!" : ""}`);
}
