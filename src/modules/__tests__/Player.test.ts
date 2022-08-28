import Player from "../Player";
import { YahtzeeScoreCategory } from "../../types";
import Scoresheet from "../Scoresheet";
import mockConfig from "../../testUtils/MockConfig";

jest.mock("../Scoresheet");

const MockScoresheet = Scoresheet as jest.MockedClass<typeof Scoresheet>;

describe("Player", () => {
  beforeEach(() => {
    MockScoresheet.mockClear();
  });

  test("creates player with name and empty score on instantiation", () => {
    const player = new Player(mockConfig, "test player");

    // Expect player to have name and empty score
    expect(player.name).toBe("test player");
    expect(player.score).toMatchObject({
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
    });
  });

  test("returns json of its state", () => {
    const player = new Player(mockConfig, "test player");

    // Expect the json to be correct
    expect(player.toJSON()).toMatchObject({
      name: "test player",
      score: {
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
      },
    });
  });

  test("sets score for a category", () => {
    const player = new Player(mockConfig, "test player");

    // Set the score for a category
    player.setScore(YahtzeeScoreCategory.Ones, 1);

    // Expect the score to be unchanged except for that category
    expect(player.score).toMatchObject({
      ones: 1,
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
    });
  });

  test("resets score correctly", () => {
    const player = new Player(mockConfig, "test player");

    // Set the score for some categories
    player.setScore(YahtzeeScoreCategory.Yahtzee, 50);
    player.setScore(YahtzeeScoreCategory.SmallStraight, 30);

    // Reset the score
    player.resetScore();

    // Expect the name to remain the same
    expect(player.name).toBe("test player");

    // Expect the score to be empty
    expect(player.score).toMatchObject({
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
    });
  });

  test("gets total score from scoresheet", () => {
    const player = new Player(mockConfig, "test player");

    // Set the score for some categories
    player.setScore(YahtzeeScoreCategory.Yahtzee, 50);
    player.setScore(YahtzeeScoreCategory.SmallStraight, 30);

    MockScoresheet.prototype.scoreTotal.mockReturnValue(80);

    // Get score total
    const totalScore = player.totalScore;

    // Expect a scoresheet to be created
    expect(MockScoresheet).toHaveBeenCalledWith({
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: 30,
      largeStraight: null,
      yahtzee: 50,
      chance: null,
      yahtzeeBonus: 0,
    });

    const mockScoresheetInstance = MockScoresheet.mock.instances[0];

    // Expect to get the total from the scoresheet
    expect(mockScoresheetInstance.scoreTotal).toHaveBeenCalledTimes(1);

    // Expect the total score to be correct
    expect(totalScore).toBe(80);
  });

  test("is able to render a scoresheet", () => {
    const player = new Player(mockConfig, "test player");

    // Render scoresheet
    player.renderScoresheet();

    // Expect a scoresheet to be created
    expect(MockScoresheet).toHaveBeenCalledWith({
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
    });

    const mockScoresheetInstance = MockScoresheet.mock.instances[0];

    // Expect scoresheet to try render itself
    expect(mockScoresheetInstance.render).toHaveBeenCalledTimes(1);
  });
});
