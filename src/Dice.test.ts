import Dice, { getRandomIntInclusive } from "./Dice";

describe("getRandomIntInclusive", () => {
  test("returns random integers between 1 and 6", () => {
    const min = 1;
    const max = 6;

    // Get 100 random numbers to make sure the numbers in within the range
    const numbers = [];
    for (let i = 0; i < 100; i++) {
      numbers.push(getRandomIntInclusive(1, 6));
    }

    // Expect all 100 numbers to be in range
    expect(numbers.some(num => num >= 1 && num <= 6)).toBeTrue();

    // Expect to find at least one of the min number and one of the max number (inclusive range)
    expect(numbers.some(num => num === min)).toBeTrue(); 
    expect(numbers.some(num => num === max)).toBeTrue();
  });
});

describe("Dice", () => {
  test("sets dice values", () => {
    const dice = new Dice();

    // Set values
    dice.setValues([1, 2, 3, 4, 5]);

    // Expect values to be set
    expect(dice.values).toEqual([1, 2, 3, 4, 5]);
  });

  test("sets lock values", () => {
    const dice = new Dice();

    // Set lock values
    dice.setLock([true, false, true, false, true]);

    // Expect lock values to be set
    expect(dice.lock).toEqual([true, false, true, false, true]);
  });

  test("unlocked dice count is 5 when dice are unlocked", () => {
    const dice = new Dice();

    // Initial state is all unlocked and values are all zeroes

    // Expect unlocked dice count to be 5
    expect(dice.unlockedDiceCount).toBe(5);
  });

  test("unlocked dice count is equal to number of falses in lock array", () => {
    const dice = new Dice();

    // Set lock values
    dice.setLock([true, false, true, false, true]);

    // Expect unlocked dice count to be equal to number of falses in lock array
    expect(dice.unlockedDiceCount).toBe(2);
  });

  test("sets up dice values and dice lock on instantiation", () => {
    const dice = new Dice();

    // Expect there to be 5 dice values
    expect(dice.values.length).toBe(5);

    // Expect the dice values to be 0
    expect(dice.values.every(v => v === 0)).toBeTrue();

    // Expect there to be 5 lock values
    expect(dice.lock.length).toBe(5);

    // Expect the dice lock to be fully unlocked
    expect(dice.lock.every(l => !l)).toBeTrue();
  });

  test("on fresh roll, replaces all dice values with new values when dice are all unlocked", () => {
    const dice = new Dice();

    // Initial state is all unlocked and values are all zeroes

    const oldValues = dice.values.slice();
    
    // Roll the dice
    dice.roll();

    // Expect all the dice values to have changed
    expect(dice.values.every((v, i) => v !== oldValues[i])).toBeTrue();
  });

  test("never replaces locked dice values when rolling", () => {
    const dice = new Dice();

    // Initial state is all unlocked and values are all zeroes

    // Lock the first and third dice
    dice.setLock([true, false, true, false, false]);

    // Roll the dice
    dice.roll();

    // Expect the first and third dice to have not changed
    expect(dice.values[0]).toBe(0);
    expect(dice.values[2]).toBe(0);

    // Expect the second, fourth and fifth dice to have changed
    expect(dice.values[1]).not.toBe(0);
    expect(dice.values[3]).not.toBe(0);
    expect(dice.values[4]).not.toBe(0);
  });

  test("resets dice values to all zeroes", () => {
    const dice = new Dice();
    
    // Roll the dice to change the values then reset them
    dice.roll();
    dice.resetValues();

    // Expect all dice values to be 0
    expect(dice.values.every(v => v === 0)).toBeTrue();
  });

  test("resets dice lock to all unlocked", () => {
    const dice = new Dice();
    
    // Lock the dice then reset the lock
    dice.setLock([true, false, true, false, false]);
    dice.resetLock();

    // Expect all dice lock to be false
    expect(dice.lock.every(l => !l)).toBeTrue();
  });

  test("resets dice values and lock on full reset", () => {
    const dice = new Dice();
    
    // Roll the dice to change the values, lock the dice, then reset them
    dice.roll();
    dice.setLock([true, false, true, false, false]);
    dice.reset();

    // Expect all dice values to be 0
    expect(dice.values.every(v => v === 0)).toBeTrue();

    // Expect all dice lock to be false
    expect(dice.lock.every(l => !l)).toBeTrue();
  });

  test("returns json of its state", () => {
    const dice = new Dice();

    // Roll the dice to change the values and lock the dice
    dice.roll();
    dice.setLock([true, false, true, false, false]);

    const diceValues = dice.values.slice();

    // Expect the json to be correct
    expect(dice.toJSON()).toMatchObject({
      values: diceValues,
      lock: [true, false, true, false, false],
    });
  });
});
