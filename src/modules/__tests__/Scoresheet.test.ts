import Scoresheet from "../Scoresheet";
import { YahtzeeScore } from "../../types";

describe("Scoresheet", () => {
  test("instantiates with score", () => {
    const score: YahtzeeScore = {
      ones: 1,
      twos: 2,
      threes: 3,
      fours: 4,
      fives: 5,
      sixes: 6,
      threeOfAKind: 5,
      fourOfAKind: 5,
      fullHouse: 25,
      smallStraight: 30,
      largeStraight: 40,
      yahtzee: 50,
      chance: 15,
      yahtzeeBonus: 0,
    };

    const scoresheet = new Scoresheet(score);

    // Expect the score to be the same as the score passed in
    expect(scoresheet.score).toMatchObject(score);
  });

  describe("scoreTopSection", () => {
    test("gets the sum of all top section categories", () => {
      const score: YahtzeeScore = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: null,
        threeOfAKind: 5,
        fourOfAKind: 5,
        fullHouse: 25,
        smallStraight: 30,
        largeStraight: 40,
        yahtzee: 50,
        chance: 15,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const topSectionScore = scoresheet.scoreTopSection();

      // Expect the score to be the sum of all top section categories
      expect(topSectionScore).toBe(15);
    });

    test("returns 0 if no top section categories are scored", () => {
      const score: YahtzeeScore = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const topSectionScore = scoresheet.scoreTopSection();

      // Expect the score to be 0
      expect(topSectionScore).toBe(0);
    });
  });

  describe("scoreTopSectionBonus", () => {
    test("returns bonus if top section score >= 63", () => {
      const score: YahtzeeScore = {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 12,
        fives: 15,
        sixes: 18,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const topSectionScore = scoresheet.scoreTopSection();
      const topSectionBonus = scoresheet.scoreTopSectionBonus(topSectionScore);

      // Expect the bonus to be 35
      expect(topSectionBonus).toBe(35);
    });

    test("returns 0 if top section score < 63", () => {
      const score: YahtzeeScore = {
        ones: 2,
        twos: 4,
        threes: 6,
        fours: 8,
        fives: 10,
        sixes: 12,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const topSectionScore = scoresheet.scoreTopSection();
      const topSectionBonus = scoresheet.scoreTopSectionBonus(topSectionScore);

      // Expect the bonus to be 0
      expect(topSectionBonus).toBe(0);
    });
  });

  describe("scoreBottomSection", () => {
    test("gets the sum of all bottom section categories", () => {
      const score: YahtzeeScore = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: 1,
        fourOfAKind: 2,
        fullHouse: 3,
        smallStraight: 4,
        largeStraight: null,
        yahtzee: 5,
        chance: 6,
        yahtzeeBonus: 7,
      };
  
      const scoresheet = new Scoresheet(score);
      const bottomSectionScore = scoresheet.scoreBottomSection();
  
      // Expect the score to be the sum of all bottom section categories
      expect(bottomSectionScore).toBe(28);
    });

    test("returns 0 if no bottom section categories are scored", () => {
      const score: YahtzeeScore = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };
  
      const scoresheet = new Scoresheet(score);
      const bottomSectionScore = scoresheet.scoreBottomSection();
  
      // Expect the score to be 0
      expect(bottomSectionScore).toBe(0);
    });
  });

  describe("scoreTotal", () => {
    test("gets the sum of all categories", () => {
      const score: YahtzeeScore = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: null,
        threeOfAKind: 5,
        fourOfAKind: 5,
        fullHouse: 25,
        smallStraight: 30,
        largeStraight: 40,
        yahtzee: 50,
        chance: 15,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const totalScore = scoresheet.scoreTotal();

      // Expect the score to be the sum of all categories
      expect(totalScore).toBe(185);
    });

    test("returns 0 if no categories are scored", () => {
      const score: YahtzeeScore = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };
  
      const scoresheet = new Scoresheet(score);
      const bottomSectionScore = scoresheet.scoreTotal();
  
      // Expect the score to be 0
      expect(bottomSectionScore).toBe(0);
    });

    test("gets the sum of all categories with top section bonus if top section score >= 63", () => {
      const score: YahtzeeScore = {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 12,
        fives: 15,
        sixes: 18,
        threeOfAKind: 5,
        fourOfAKind: 5,
        fullHouse: 25,
        smallStraight: null,
        largeStraight: 40,
        yahtzee: 50,
        chance: 15,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const totalScore = scoresheet.scoreTotal();

      // Expect the score to be the sum of all categories with top section bonus
      expect(totalScore).toBe(238);
    });
  });

  describe("renderScore", () => {
    test("returns the score if score is not null", () => {
      const score: YahtzeeScore = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: null,
        threeOfAKind: 5,
        fourOfAKind: 5,
        fullHouse: 25,
        smallStraight: 30,
        largeStraight: 40,
        yahtzee: 50,
        chance: 15,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const renderedScore = scoresheet.renderScore(45);

      // Expect the score to be the score
      expect(renderedScore).toBe(45);
    });

    test("returns empty string if score is null", () => {
      const score: YahtzeeScore = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };

      const scoresheet = new Scoresheet(score);
      const renderedScore = scoresheet.renderScore(null);

      // Expect the score to be empty string
      expect(renderedScore).toBe("");
    });
  });

  describe("render", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    beforeEach(() => {
      log.mockClear();
    });

    test("renders the scoresheet", () => {
      const score: YahtzeeScore = {
        ones: 1,
        twos: 2,
        threes: 3,
        fours: 4,
        fives: 5,
        sixes: null,
        threeOfAKind: 5,
        fourOfAKind: 5,
        fullHouse: 25,
        smallStraight: 30,
        largeStraight: 40,
        yahtzee: 50,
        chance: 15,
        yahtzeeBonus: 0,
      };
      
      const scoresheet = new Scoresheet(score);
      scoresheet.render();

      // Expect the scoresheet to be rendered
      expect(log).toHaveBeenCalledWith(`╔═════════════╤════╤══╤═════════════════╤═════╗
║ Aces        │ 1  │  │ Three of a Kind │ 5   ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Twos        │ 2  │  │ Four of a Kind  │ 5   ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Threes      │ 3  │  │ Full House      │ 25  ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Fours       │ 4  │  │ Small Straight  │ 30  ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Fives       │ 5  │  │ Large Straight  │ 40  ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Sixes       │    │  │ Yahtzee         │ 50  ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Total score │ 15 │  │ Chance          │ 15  ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Bonus       │ 0  │  │ Bonus Yahtzees  │ 0   ║
╟─────────────┼────┼──┼─────────────────┼─────╢
║ Total       │ 15 │  │ Total           │ 170 ║
╚═════════════╧════╧══╧═════════════════╧═════╝`);

      // Expect the grand total to be rendered
      expect(log).toHaveBeenCalledWith(`╔═════════════╤═════╗
║ Grand total │ 185 ║
╚═════════════╧═════╝
`);
    });
  });
});
