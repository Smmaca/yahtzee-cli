import MockDice from "./MockDice";

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
});
