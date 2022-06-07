import DiceScorer from "./DiceScorer";
import config from "./config";
import { YahtzeeScoreCategory } from "./types";

const fakeConfig = {
  ...config,
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: 10,
    [YahtzeeScoreCategory.SmallStraight]: 20,
    [YahtzeeScoreCategory.LargeStraight]: 30,
    [YahtzeeScoreCategory.Yahtzee]: 40,
    [YahtzeeScoreCategory.YahtzeeBonus]: 50,
  },
};

describe("DiceScorer", () => {
  test("sets dice values and score value on instantiation", () => {
    // Instantiate dice scorer
    const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

    // Expect values to be correct
    expect(diceScorer.values).toEqual([1, 2, 3, 4, 5]);

    // Expect score values to be correct
    expect(diceScorer.fullHouseScore).toEqual(10);
    expect(diceScorer.smallStraightScore).toEqual(20);
    expect(diceScorer.largeStraightScore).toEqual(30);
    expect(diceScorer.yahtzeeScore).toEqual(40);
    expect(diceScorer.bonusYahtzeeScore).toEqual(50);
  });

  describe("getCategoryScoreValue", () => {
    test("gets full house score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.FullHouse)).toEqual(10);
    });
    test("gets small straight score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.SmallStraight)).toEqual(20);
    });
    test("gets large straight score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.LargeStraight)).toEqual(30);
    });
    test("gets yahtzee score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.Yahtzee)).toEqual(40);
    });
    test("gets yahtzee bonus score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.YahtzeeBonus)).toEqual(50);
    });
    test("returns zero for a category without a score value", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);
  
      // Expect values to be correct
      expect(diceScorer.getCategoryScoreValue(YahtzeeScoreCategory.Chance)).toEqual(0);
    });
  });

  describe("sumDiceValues", () => {
    test("gets sum of dice values", () => {
       // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Sum the values
      const sum = diceScorer.sumDiceValues();

      // Expect sum to be correct
      expect(sum).toEqual(15);
    });
  });

  describe("scoreNumberCategory", () => {
    test("score number category: 1", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(1);

      // Expect score to be correct
      expect(score).toEqual(1);
    });
    test("score number category: 2", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(2);

      // Expect score to be correct
      expect(score).toEqual(2);
    });
    test("score number category: 3", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(3);

      // Expect score to be correct
      expect(score).toEqual(3);
    });
    test("score number category: 4", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(4);

      // Expect score to be correct
      expect(score).toEqual(4);
    });
    test("score number category: 5", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(5);

      // Expect score to be correct
      expect(score).toEqual(5);
    });
    test("score number category: 6", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNumberCategory(6);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
  });

  describe("scoreNOfAKind", () => {
    test("score zero for 3 of a kind when all numbers are different", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(3);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero for 3 of a kind when there's 2 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 3, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(3);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score sum of dice for 3 of a kind when there's 3 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(3);

      // Expect score to be correct
      expect(score).toEqual(12);
    });
    test("score sum of dice for 3 of a kind when there's 4 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(3);

      // Expect score to be correct
      expect(score).toEqual(9);
    });
    test("score sum of dice for 3 of a kind when there's 5 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(3);

      // Expect score to be correct
      expect(score).toEqual(5);
    });
    test("score zero for 4 of a kind when all numbers are different", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(4);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero for 4 of a kind when there's 2 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 3, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(4);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero for 4 of a kind when there's 3 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(4);

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score sum of dice for 4 of a kind when there's 4 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(4);

      // Expect score to be correct
      expect(score).toEqual(9);
    });
    test("score sum of dice for 4 of a kind when there's 5 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      // Score the category
      const score = diceScorer.scoreNOfAKind(4);

      // Expect score to be correct
      expect(score).toEqual(5);
    });
  });

  describe("scoreFullHouse", () => {
    test("score zero when all numbers are different", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreFullHouse();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's three of a kind but the other two numbers are different", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 3, 3, 3, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreFullHouse();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score full house score value when there's a three of a kind and a two of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 2, 2], fakeConfig);

      // Score the category
      const score = diceScorer.scoreFullHouse();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.fullHouse);
    });
    test("score zero when there's a 4 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreFullHouse();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's a 5 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      // Score the category
      const score = diceScorer.scoreFullHouse();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
  });

  describe("scoreSmallStraight", () => {
    test("score zero when there's no straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 3, 5, 5, 6], fakeConfig);

      // Score the category
      const score = diceScorer.scoreSmallStraight();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score small straight score value when there's a small straight with a duplicate", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 4], fakeConfig);

      // Score the category
      const score = diceScorer.scoreSmallStraight();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.smallStraight);
    });
    test("score small straight score value when there's a small straight with an outlier", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 6], fakeConfig);

      // Score the category
      const score = diceScorer.scoreSmallStraight();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.smallStraight);
    });
    test("score small straight score value when there's a large straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreSmallStraight();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.smallStraight);
    });
  });

  describe("scoreLargeStraight", () => {
    test("score zero when there's no straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 3, 5, 5, 6], fakeConfig);

      // Score the category
      const score = diceScorer.scoreLargeStraight();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score large straight score value when there's a large straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([2, 3, 4, 5, 6], fakeConfig);

      // Score the category
      const score = diceScorer.scoreLargeStraight();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.largeStraight);
    });
    test("score zero when there's a small straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 4], fakeConfig);

      // Score the category
      const score = diceScorer.scoreLargeStraight();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
  });

  describe("scoreYahtzee", () => {
    test("score zero when there's no yahtzee", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzee();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 2 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzee();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 3 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzee();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 4 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzee();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score yahtzee score value when there's 5 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzee();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.yahtzee);
    });
  });

  describe("scoreYahtzeeBonus", () => {
    test("score zero when there's no yahtzee", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzeeBonus();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 2 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 3, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzeeBonus();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 3 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 4, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzeeBonus();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score zero when there's 4 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 5], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzeeBonus();

      // Expect score to be correct
      expect(score).toEqual(0);
    });
    test("score yahtzee bonus score value when there's 5 of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      // Score the category
      const score = diceScorer.scoreYahtzeeBonus();

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.yahtzeeBonus);
    });
  });

  describe("scoreCategory", () => {
    test("score ones", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 2, 3, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Ones);

      // Expect score to be correct
      expect(score).toEqual(2);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(1);
    });
    test("score twos", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 2, 3, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Twos);

      // Expect score to be correct
      expect(score).toEqual(4);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(2);
    });
    test("score threes", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 3, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Threes);

      // Expect score to be correct
      expect(score).toEqual(6);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(3);
    });
    test("score fours", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 4, 4, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Fours);

      // Expect score to be correct
      expect(score).toEqual(8);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(4);
    });
    test("score fives", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 5, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Fives);

      // Expect score to be correct
      expect(score).toEqual(10);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(5);
    });
    test("score sixes", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 6, 4, 6], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNumberCategory");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Sixes);

      // Expect score to be correct
      expect(score).toEqual(12);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(6);
    });
    test("score three of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([6, 6, 6, 2, 3], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNOfAKind");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.ThreeOfAKind);

      // Expect score to be correct
      expect(score).toEqual(23);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(3);
    });
    test("score four of a kind", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([6, 6, 6, 6, 3], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreNOfAKind");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.FourOfAKind);

      // Expect score to be correct
      expect(score).toEqual(27);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalledWith(4);
    });
    test("score full house", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([6, 6, 6, 2, 2], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreFullHouse");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.FullHouse);

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.fullHouse);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score small straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 2], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreSmallStraight");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.SmallStraight);

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.smallStraight);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score large straight", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreLargeStraight");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.LargeStraight);

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.largeStraight);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score yahtzee", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreYahtzee");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Yahtzee);

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.yahtzee);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score chance", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      const spy = jest.spyOn(diceScorer, "sumDiceValues");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.Chance);

      // Expect score to be correct
      expect(score).toEqual(15);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score yahtzee bonus", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 1, 1, 1, 1], fakeConfig);

      const spy = jest.spyOn(diceScorer, "scoreYahtzeeBonus");

      // Score the category
      const score = diceScorer.scoreCategory(YahtzeeScoreCategory.YahtzeeBonus);

      // Expect score to be correct
      expect(score).toEqual(fakeConfig.scoreValues.yahtzeeBonus);

      // Expect scoreNumberCategory to be called
      expect(spy).toHaveBeenCalled();
    });
    test("score zero for unknown category", () => {
      // Instantiate dice scorer
      const diceScorer = new DiceScorer([1, 2, 3, 4, 5], fakeConfig);

      // Score the category
      // @ts-ignore
      const score = diceScorer.scoreCategory("unknown");

      // Expect score to be correct
      expect(score).toEqual(0);
    });
  });
});
