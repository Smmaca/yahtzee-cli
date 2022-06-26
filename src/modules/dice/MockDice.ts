import Dice from "./Dice";

export default class MockDice extends Dice {
  constructor(private rolls: number[][] = []) {
    super();
  }

  roll() {
    const nextRoll = this.rolls.shift();
    if (nextRoll) {
      this.setValues(nextRoll);
    }
  }
}