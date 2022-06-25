import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import DiceScorer from "../DiceScorer";
import ScoreDiceScreen, { ScoreDiceScreenInput, choiceLabels } from "./ScoreDiceScreen";
import mockDice from "../testUtils/MockDice";
import { constructChoice } from "../utils/screenUtils";
import { GameMode, YahtzeeScoreCategory } from "../types";
import mockPlayer from "../testUtils/MockPlayer";
import GameActionScreen from "./GameActionScreen";
import ScoresheetScreen from "./ScoresheetScreen";
import ScoreJokerScreen from "./ScoreJokerScreen";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("../DiceScorer");
jest.mock("./GameActionScreen");
jest.mock("./ScoresheetScreen");
jest.mock("./ScoreJokerScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockScoresheetScreen = ScoresheetScreen as jest.MockedClass<typeof ScoresheetScreen>;
const MockScoreJokerScreen = ScoreJokerScreen as jest.MockedClass<typeof ScoreJokerScreen>;

describe("ScoreDiceScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new ScoreDiceScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(ScoreDiceScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(ScoreDiceScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(ScoreDiceScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(ScoreDiceScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => ScoreDiceScreenInput.CANCEL);
      handleInputSpy.mockClear().mockImplementation(() => new ScoreDiceScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new ScoreDiceScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(ScoreDiceScreenInput.CANCEL, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      mockDrawUtils.drawTurnStats.mockClear();
      mockDrawUtils.drawDiceValues.mockClear();
    });

    test("draws turn stats and dice", () => {
      const screen = new ScoreDiceScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockDiceScorer).toHaveBeenCalledWith(mockGameState.dice.values, mockConfig);
      expect(drawUtils.drawTurnStats).toHaveBeenCalledTimes(1);
      expect(drawUtils.drawDiceValues).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChoices", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      mockGameState.getDiceRollsLeft.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
    });

    test("when there are rolls left, gives option to score categories and cancel", () => {
      const mockState = { ...mockGameState };
      mockState.getDiceRollsLeft.mockImplementation(() => 1);
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 1);

      const screen = new ScoreDiceScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: "ones", value: "ones", message: "Aces", disabled: false, hint: "1" },
        { name: "twos", value: "twos", message: "Twos", disabled: false, hint: "1" },
        { name: "threes", value: "threes", message: "Threes", disabled: false, hint: "1" },
        { name: "fours", value: "fours", message: "Fours", disabled: false, hint: "1" },
        { name: "fives", value: "fives", message: "Fives", disabled: false, hint: "1" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: false, hint: "1" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: false, hint: "1" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: false, hint: "1" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: false, hint: "1" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: false, hint: "1" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: false, hint: "1" },
        { name: "yahtzee", value: "yahtzee", message: "Yahtzee", disabled: false, hint: "1" },
        { name: "chance", value: "chance", message: "Chance", disabled: false, hint: "1" },
        { name: "yahtzeeBonus", value: "yahtzeeBonus", message: "Bonus Yahtzees", disabled: true, hint: "[0]" },
        { name: "cancel", value: "cancel", message: "Cancel" },
      ]);
    });

    test("when there aren no rolls left, gives option to score categories", () => {
      const mockState = { ...mockGameState };
      mockState.getDiceRollsLeft.mockImplementation(() => 0);
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 1);

      const screen = new ScoreDiceScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: "ones", value: "ones", message: "Aces", disabled: false, hint: "1" },
        { name: "twos", value: "twos", message: "Twos", disabled: false, hint: "1" },
        { name: "threes", value: "threes", message: "Threes", disabled: false, hint: "1" },
        { name: "fours", value: "fours", message: "Fours", disabled: false, hint: "1" },
        { name: "fives", value: "fives", message: "Fives", disabled: false, hint: "1" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: false, hint: "1" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: false, hint: "1" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: false, hint: "1" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: false, hint: "1" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: false, hint: "1" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: false, hint: "1" },
        { name: "yahtzee", value: "yahtzee", message: "Yahtzee", disabled: false, hint: "1" },
        { name: "chance", value: "chance", message: "Chance", disabled: false, hint: "1" },
        { name: "yahtzeeBonus", value: "yahtzeeBonus", message: "Bonus Yahtzees", disabled: true, hint: "[0]" },
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(ScoreDiceScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(ScoreDiceScreenInput.CANCEL, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new ScoreDiceScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SCORE_DICE,
        answer: ScoreDiceScreenInput.CANCEL,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(ScoreDiceScreenInput.CANCEL);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });
  });

  describe("handleInput", () => {
    const getGameOverScreenSpy = jest.spyOn(ScoreDiceScreen.prototype, "getGameOverScreen");

    beforeEach(() => {
      getGameOverScreenSpy.mockClear().mockImplementation(() => null);
      MockDiceScorer.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
      mockGameState.nextPlayer.mockClear();
      mockPlayer.setScore.mockClear();
      MockGameActionScreen.mockClear();
      MockScoresheetScreen.mockClear();
      MockScoreJokerScreen.mockClear();
    });

    test("handles selecting any category except yahtzee bonus when next screen should be game over", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 1);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Ones, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones, 1);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBeNull();
    });

    test("handles selecting any category except yahtzee bonus when next screen should be scoresheet", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 2);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Twos, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos, 2);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).not.toHaveBeenCalledTimes(1);
      expect(MockScoresheetScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting yahtzee bonus", () => {
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementationOnce(() => 100);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.YahtzeeBonus, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreYahtzeeBonus).toHaveBeenCalledTimes(1);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.YahtzeeBonus, 100);
      expect(MockScoreJokerScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoreJokerScreen.mock.instances[0]);
    });

    test("handles selecting option: Cancel", () => {
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(ScoreDiceScreenInput.CANCEL, mockGameState, mockConfig);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
