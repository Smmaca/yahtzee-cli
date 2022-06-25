import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import DiceScorer from "../modules/DiceScorer";
import ScoreDiceScreen, { ScoreDiceScreenInput, choiceLabels } from "./ScoreDiceScreen";
import mockDice from "../testUtils/MockDice";
import { constructChoice } from "../utils/screen";
import { GameMode, YahtzeeScoreCategory } from "../types";
import mockPlayer from "../testUtils/MockPlayer";
import GameActionScreen from "./GameActionScreen";
import ScoresheetScreen from "./ScoresheetScreen";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameOverMultiplayerScreen from "./GameOverMultiplayerScreen";
import { defaultScore } from "../modules/Player";
import Statistics from "../modules/Statistics";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("../modules/DiceScorer");
jest.mock("../modules/Statistics");
jest.mock("./GameActionScreen");
jest.mock("./ScoresheetScreen");
jest.mock("./GameOverSinglePlayerScreen");
jest.mock("./GameOverMultiplayerScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockStatistics = Statistics as jest.MockedClass<typeof Statistics>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockScoresheetScreen = ScoresheetScreen as jest.MockedClass<typeof ScoresheetScreen>;
const MockGameOverSinglePlayerScreen = GameOverSinglePlayerScreen as jest.MockedClass<typeof GameOverSinglePlayerScreen>;
const MockGameOverMultiplayerScreen = GameOverMultiplayerScreen as jest.MockedClass<typeof GameOverMultiplayerScreen>;

describe("ScoreDiceScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new ScoreDiceScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledOnce();
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledOnce();
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
      expect(drawUtils.drawTurnStats).toHaveBeenCalledOnce();
      expect(drawUtils.drawDiceValues).toHaveBeenCalledOnce();
    });
  });

  describe("getGameOverScreen", () => {
    beforeEach(() => {
      MockGameOverSinglePlayerScreen.mockClear();
      MockGameOverMultiplayerScreen.mockClear();
      MockStatistics.mockClear();
      mockGameState.setCurrentPlayer.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
    });

    test("returns correct screen and saves stats for a singleplayer game", () => {
      mockGameState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      const screen = new ScoreDiceScreen();
      const gameOverScreen = screen.getGameOverScreen(mockGameState, mockConfig);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(0);
      expect(mockGameState.getCurrentPlayer).toHaveBeenCalledOnce();
      expect(MockStatistics).toHaveBeenCalledOnce();
      expect(MockStatistics.mock.instances[0].saveGameStatistics).toHaveBeenCalledWith({ score: 0 });
      expect(MockGameOverSinglePlayerScreen).toHaveBeenCalledOnce();
      expect(gameOverScreen).toBe(MockGameOverSinglePlayerScreen.mock.instances[0]);
    });

    test("returns correct screen for a multiplayer game", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
      ];
      const screen = new ScoreDiceScreen();
      const gameOverScreen = screen.getGameOverScreen(mockState, mockConfig);
      expect(MockGameOverMultiplayerScreen).toHaveBeenCalledOnce();
      expect(gameOverScreen).toBe(MockGameOverMultiplayerScreen.mock.instances[0]);
    });

    test("throws an error if there are no players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [];
      const screen = new ScoreDiceScreen();
      try {
        screen.getGameOverScreen(mockState, mockConfig);
        throw new Error("Expected error to be thrown");
      } catch (err) {
        expect(err.message).toBe("Cannot handle game over with no players");
      }
    });
  });

  describe("getScoreDiceChoices", () => {
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
      const choices = screen.getScoreDiceChoices(mockState, mockConfig);

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

    test("when there are no rolls left, gives option to score categories", () => {
      const mockState = { ...mockGameState };
      mockState.getDiceRollsLeft.mockImplementation(() => 0);
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 1);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreDiceChoices(mockState, mockConfig);

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

    test("allows scoring bonus yahtzee if yahtzee is rolled and already scored", () => {
      const mockState = { ...mockGameState };
      mockState.getDiceRollsLeft.mockImplementation(() => 0);
      const mockPlayer1 = { ...mockPlayer, score: { ...defaultScore, [YahtzeeScoreCategory.Yahtzee]: 50 } };
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      mockState.dice = { ...mockDice, values: [1, 1, 1, 1, 1] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 1);
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementation(() => 100);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreDiceChoices(mockState, mockConfig);

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
        { name: "yahtzee", value: "yahtzee", message: "Yahtzee", disabled: true, hint: "[50]" },
        { name: "chance", value: "chance", message: "Chance", disabled: false, hint: "1" },
        { name: "yahtzeeBonus", value: "yahtzeeBonus", message: "Bonus Yahtzees", disabled: false, hint: "[0] + 100" },
      ]);
    });

    test("displays no hint when the category would score a 0", () => {
      const mockState = { ...mockGameState };
      mockState.getDiceRollsLeft.mockImplementation(() => 1);
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreDiceChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: "ones", value: "ones", message: "Aces", disabled: false, hint: "" },
        { name: "twos", value: "twos", message: "Twos", disabled: false, hint: "" },
        { name: "threes", value: "threes", message: "Threes", disabled: false, hint: "" },
        { name: "fours", value: "fours", message: "Fours", disabled: false, hint: "" },
        { name: "fives", value: "fives", message: "Fives", disabled: false, hint: "" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: false, hint: "" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: false, hint: "" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: false, hint: "" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: false, hint: "" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: false, hint: "" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: false, hint: "" },
        { name: "yahtzee", value: "yahtzee", message: "Yahtzee", disabled: false, hint: "" },
        { name: "chance", value: "chance", message: "Chance", disabled: false, hint: "" },
        { name: "yahtzeeBonus", value: "yahtzeeBonus", message: "Bonus Yahtzees", disabled: true, hint: "[0]" },
        { name: "cancel", value: "cancel", message: "Cancel" },
      ]);
    });
  });

  describe("getScoreJokerChoices", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      mockGameState.getDiceRollsLeft.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
    });

    test("allows scoring relevant number category if available", () => {
      const mockState = { ...mockGameState };
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      mockState.dice = { ...mockDice, values: [1, 1, 1, 1, 1] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 5);
      MockDiceScorer.prototype.getCategoryScoreValue.mockImplementation(() => 25);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreJokerChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: 0, value: 0, message: ">> Score in the relevant number category <<", role: "separator" },
        { name: "ones", value: "ones", message: "Aces", disabled: false, hint: "5" },
        { name: 2, value: 2, message: ">> Score in any lower section category <<", role: "separator" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: true, hint: "5" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: true, hint: "5" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: true, hint: "25" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: true, hint: "25" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: true, hint: "25" },
        { name: "chance", value: "chance", message: "Chance", disabled: true, hint: "5" },
        { name: 9, value: 9, message: ">> Score zero in any number category <<", role: "separator" },
        { name: "twos", value: "twos", message: "Twos", disabled: true, hint: "" },
        { name: "threes", value: "threes", message: "Threes", disabled: true, hint: "" },
        { name: "fours", value: "fours", message: "Fours", disabled: true, hint: "" },
        { name: "fives", value: "fives", message: "Fives", disabled: true, hint: "" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: true, hint: "" },
      ]);
    });

    test("allows scoring in lower section category if relevant number category is unavailable", () => {
      const mockState = { ...mockGameState };
      const mockPlayer1 = { ...mockPlayer, score: { ...defaultScore, ones: 5 } };
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      mockState.dice = { ...mockDice, values: [1, 1, 1, 1, 1] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 5);
      MockDiceScorer.prototype.getCategoryScoreValue.mockImplementation(() => 25);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreJokerChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: 0, value: 0, message: ">> Score in the relevant number category <<", role: "separator" },
        { name: "ones", value: "ones", message: "Aces", disabled: true, hint: "[5]" },
        { name: 2, value: 2, message: ">> Score in any lower section category <<", role: "separator" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: false, hint: "5" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: false, hint: "5" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: false, hint: "25" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: false, hint: "25" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: false, hint: "25" },
        { name: "chance", value: "chance", message: "Chance", disabled: false, hint: "5" },
        { name: 9, value: 9, message: ">> Score zero in any number category <<", role: "separator" },
        { name: "twos", value: "twos", message: "Twos", disabled: true, hint: "" },
        { name: "threes", value: "threes", message: "Threes", disabled: true, hint: "" },
        { name: "fours", value: "fours", message: "Fours", disabled: true, hint: "" },
        { name: "fives", value: "fives", message: "Fives", disabled: true, hint: "" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: true, hint: "" },
      ]);
    });

    test("allows scoring in any number category if everything else is unavailable", () => {
      const mockState = { ...mockGameState };
      const mockPlayer1 = {
        ...mockPlayer,
        score: {
          ...defaultScore,
          ones: 5,
          twos: 10,
          threeOfAKind: 5,
          fourOfAKind: 5,
          fullHouse: 25,
          smallStraight: 25,
          largeStraight: 25,
          chance: 5,
        },
      };
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      mockState.dice = { ...mockDice, values: [1, 1, 1, 1, 1] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 5);
      MockDiceScorer.prototype.getCategoryScoreValue.mockImplementation(() => 25);

      const screen = new ScoreDiceScreen();
      const choices = screen.getScoreJokerChoices(mockState, mockConfig);

      expect(choices).toEqual([
        { name: 0, value: 0, message: ">> Score in the relevant number category <<", role: "separator" },
        { name: "ones", value: "ones", message: "Aces", disabled: true, hint: "[5]" },
        { name: 2, value: 2, message: ">> Score in any lower section category <<", role: "separator" },
        { name: "threeOfAKind", value: "threeOfAKind", message: "Three of a Kind", disabled: true, hint: "[5]" },
        { name: "fourOfAKind", value: "fourOfAKind", message: "Four of a Kind", disabled: true, hint: "[5]" },
        { name: "fullHouse", value: "fullHouse", message: "Full House", disabled: true, hint: "[25]" },
        { name: "smallStraight", value: "smallStraight", message: "Small Straight", disabled: true, hint: "[25]" },
        { name: "largeStraight", value: "largeStraight", message: "Large Straight", disabled: true, hint: "[25]" },
        { name: "chance", value: "chance", message: "Chance", disabled: true, hint: "[5]" },
        { name: 9, value: 9, message: ">> Score zero in any number category <<", role: "separator" },
        { name: "twos", value: "twos", message: "Twos", disabled: true, hint: "[10]" },
        { name: "threes", value: "threes", message: "Threes", disabled: false, hint: "" },
        { name: "fours", value: "fours", message: "Fours", disabled: false, hint: "" },
        { name: "fives", value: "fives", message: "Fives", disabled: false, hint: "" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: false, hint: "" },
      ]);
    });
  });

  describe("getInput", () => {
    const getScoreDiceChoicesSpy = jest.spyOn(ScoreDiceScreen.prototype, "getScoreDiceChoices");
    const getScoreJokerChoicesSpy = jest.spyOn(ScoreDiceScreen.prototype, "getScoreJokerChoices");

    beforeAll(() => {
      getScoreDiceChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(ScoreDiceScreenInput.CANCEL, choiceLabels),
      ]);
      getScoreJokerChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(YahtzeeScoreCategory.Ones, choiceLabels),
      ]);
    });

    afterAll(() => {
      getScoreDiceChoicesSpy.mockRestore();
      getScoreJokerChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new ScoreDiceScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SCORE_DICE,
        answer: ScoreDiceScreenInput.CANCEL,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(ScoreDiceScreenInput.CANCEL);
      expect(getScoreDiceChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });

    test("gets select input from player in joker mode", async () => {
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SCORE_JOKER,
        answer: YahtzeeScoreCategory.Ones,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(YahtzeeScoreCategory.Ones);
      expect(getScoreJokerChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });
  });

  describe("handleInput", () => {
    let getGameOverScreenSpy;
    let setJokerModeSpy;

    beforeAll(() => {
      getGameOverScreenSpy = jest.spyOn(ScoreDiceScreen.prototype, "getGameOverScreen")
        .mockImplementation(() => null);
        setJokerModeSpy = jest.spyOn(ScoreDiceScreen.prototype, "setJokerMode");
    });

    beforeEach(() => {
      getGameOverScreenSpy.mockClear();
      setJokerModeSpy.mockClear();
      MockDiceScorer.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
      mockGameState.nextPlayer.mockClear();
      mockPlayer.setScore.mockClear();
      MockGameActionScreen.mockClear();
      MockScoresheetScreen.mockClear();
    });

    afterAll(() => {
      getGameOverScreenSpy.mockRestore();
      setJokerModeSpy.mockRestore();
    });

    test("handles selecting any category except yahtzee bonus when next screen should be game over", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 1);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Ones, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones, 1);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).toHaveBeenCalledOnce();
      expect(nextScreen).toBeNull();
    });

    test("handles selecting any category except yahtzee bonus when next screen should be scoresheet", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 2);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Twos, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos, 2);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).not.toHaveBeenCalledOnce();
      expect(MockScoresheetScreen).toHaveBeenCalledOnce();
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting yahtzee bonus", () => {
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementationOnce(() => 100);
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.YahtzeeBonus, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreYahtzeeBonus).toHaveBeenCalledOnce();
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.YahtzeeBonus, 100);
      expect(setJokerModeSpy).toHaveBeenCalledWith(true);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting full house and straights when next screen should be game over in joker mode", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.FullHouse, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.FullHouse);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.FullHouse, 25);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).toHaveBeenCalledOnce();
      expect(nextScreen).toBeNull();
    });

    test("handles selecting full house and straights when next screen should be scoresheet in joker mode", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.SmallStraight, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.SmallStraight);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.SmallStraight, 30);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).not.toHaveBeenCalledOnce();
      expect(MockScoresheetScreen).toHaveBeenCalledOnce();
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting full house and straights when next screen is invalid in joker mode", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.STATISTICS);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.LargeStraight, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.LargeStraight);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.LargeStraight, 40);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).not.toHaveBeenCalledOnce();
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting any other category when next screen should be game over in joker mode", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 1);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Ones, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones, 1);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).toHaveBeenCalledOnce();
      expect(nextScreen).toBeNull();
    });

    test("handles selecting any other category when next screen should be scoresheet in joker mode", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 2);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Twos, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos, 2);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).not.toHaveBeenCalledOnce();
      expect(MockScoresheetScreen).toHaveBeenCalledOnce();
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting any other category when next screen is invalid in joker mode", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 3);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.STATISTICS);
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Threes, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Threes);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Threes, 3);
      expect(mockGameState.nextPlayer).toHaveBeenCalledOnce();
      expect(getGameOverScreenSpy).not.toHaveBeenCalledOnce();
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting option: Cancel", () => {
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(ScoreDiceScreenInput.CANCEL, mockGameState, mockConfig);
      expect(MockGameActionScreen).toHaveBeenCalledOnce();
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new ScoreDiceScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(nextScreen).toBe(screen);
    });

    test("handles no selected option in joker mode", () => {
      const screen = new ScoreDiceScreen({ jokerMode: true });
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
