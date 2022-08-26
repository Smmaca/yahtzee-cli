import MockDice from "../MockDice";

describe("MockDice", () => {
  test("takes the next preset roll from the list when rolling", () => {
    const dice = new MockDice([
      [1, 2, 3, 4, 5],
    ]);
    
    // Roll the dice
    dice.roll();

    // Expect all the dice values to have changed
    expect(dice.values).toEqual([1, 2, 3, 4, 5]);
  });

  test("Does nothing if there are no preset rolls left when rolling", () => {
    const dice = new MockDice();

    // Roll the dice
    dice.roll();

    expect(dice.values).toEqual([0, 0, 0, 0, 0]);
  });
});
