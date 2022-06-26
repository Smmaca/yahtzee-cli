import { IDice } from "./types";

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min); // no floats
  max = Math.floor(max); // no floats
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default class Dice implements IDice{
  diceCount: 5 = 5;
  values: number[];
  lock: boolean[];

  constructor() {
    this.reset();
  }

  get unlockedDiceCount() {
    return this.diceCount - this.lock.filter(l => l).length;
  }

  roll() {
    const unlockedValues = [];
    for (let i = 0; i < this.unlockedDiceCount; i += 1) {
      unlockedValues.push(getRandomIntInclusive(1,6));
    }

    const values = this.values.map((oldRoll, i) => {
      if (this.lock[i]) {
        return oldRoll;
      } else {
        return unlockedValues.shift();
      }
    });
    
    this.setValues(values);
  }

  setValues(values: number[]) {
    this.values = values;
  }

  setLock(lock: boolean[]) {
    this.lock = lock;
  }

  reset() {
    this.resetValues();
    this.resetLock();
  }

  resetValues() {
    const values = [];
    for (let i = 0; i < this.diceCount; i++) {
      values.push(0);
    }
    this.setValues(values);
  }

  resetLock() {
    const lock = [];
    for (let i = 0; i < this.diceCount; i++) {
      lock.push(false);
    }
    this.setLock(lock);
  }

  toJSON() {
    return {
      values: this.values,
      lock: this.lock,
    };
  }
}