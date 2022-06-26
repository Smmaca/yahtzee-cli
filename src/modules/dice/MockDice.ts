import Dice from "./Dice";

export default class MockDice extends Dice {
  constructor(private rolls: number[][]) {
    super();
  }

  roll() {
    this.setValues(this.rolls.shift());
  }
}