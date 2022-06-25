import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import DiceScorer from "../modules/DiceScorer";
import ScoreJokerScreen, { choiceLabels } from "./ScoreJokerScreen";
import mockDice from "../testUtils/MockDice";
import { constructChoice } from "../utils/screenUtils";
import { GameMode, YahtzeeScoreCategory } from "../types";
import mockPlayer from "../testUtils/MockPlayer";
import GameActionScreen from "./GameActionScreen";
import ScoresheetScreen from "./ScoresheetScreen";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameOverMultiplayerScreen from "./GameOverMultiplayerScreen";
import { defaultScore } from "../modules/Player";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("../modules/DiceScorer");
jest.mock("./GameActionScreen");
jest.mock("./ScoresheetScreen");
jest.mock("./GameOverSinglePlayerScreen");
jest.mock("./GameOverMultiplayerScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockScoresheetScreen = ScoresheetScreen as jest.MockedClass<typeof ScoresheetScreen>;
const MockGameOverSinglePlayerScreen = GameOverSinglePlayerScreen as jest.MockedClass<typeof GameOverSinglePlayerScreen>;
const MockGameOverMultiplayerScreen = GameOverMultiplayerScreen as jest.MockedClass<typeof GameOverMultiplayerScreen>;

describe("ScoreJokerScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new ScoreJokerScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(ScoreJokerScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(ScoreJokerScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(ScoreJokerScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(ScoreJokerScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => YahtzeeScoreCategory.Ones);
      handleInputSpy.mockClear().mockImplementation(() => new ScoreJokerScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new ScoreJokerScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      mockDrawUtils.drawTurnStats.mockClear();
      mockDrawUtils.drawDiceValues.mockClear();
    });

    test("draws turn stats and dice", () => {
      const screen = new ScoreJokerScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockDiceScorer).toHaveBeenCalledWith(mockGameState.dice.values, mockConfig);
      expect(drawUtils.drawTurnStats).toHaveBeenCalledTimes(1);
      expect(drawUtils.drawDiceValues).toHaveBeenCalledTimes(1);
    });
  });

  describe("getGameOverScreen", () => {
    beforeEach(() => {
      MockGameOverSinglePlayerScreen.mockClear();
      MockGameOverMultiplayerScreen.mockClear();
    });

    test("returns correct screen for a singleplayer game", () => {
      const screen = new ScoreJokerScreen();
      const gameOverScreen = screen.getGameOverScreen(mockGameState);
      expect(MockGameOverSinglePlayerScreen).toHaveBeenCalledTimes(1);
      expect(gameOverScreen).toBe(MockGameOverSinglePlayerScreen.mock.instances[0]);
    });

    test("returns correct screen for a multiplayer game", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
      ];
      const screen = new ScoreJokerScreen();
      const gameOverScreen = screen.getGameOverScreen(mockState);
      expect(MockGameOverMultiplayerScreen).toHaveBeenCalledTimes(1);
      expect(gameOverScreen).toBe(MockGameOverMultiplayerScreen.mock.instances[0]);
    });

    test("throws an error if there are no players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [];
      const screen = new ScoreJokerScreen();
      try {
        screen.getGameOverScreen(mockState);
        throw new Error("Expected error to be thrown");
      } catch (err) {
        expect(err.message).toBe("Cannot handle game over with no players");
      }
    });
  });

  describe("getChoices", () => {
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

      const screen = new ScoreJokerScreen();
      const choices = screen.getChoices(mockState, mockConfig);

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
        { name: "twos", value: "twos", message: "Twos", disabled: true, hint: "0" },
        { name: "threes", value: "threes", message: "Threes", disabled: true, hint: "0" },
        { name: "fours", value: "fours", message: "Fours", disabled: true, hint: "0" },
        { name: "fives", value: "fives", message: "Fives", disabled: true, hint: "0" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: true, hint: "0" },
      ]);
    });

    test("allows scoring in lower section category if relevant number category is unavailable", () => {
      const mockState = { ...mockGameState };
      const mockPlayer1 = { ...mockPlayer, score: { ...defaultScore, ones: 5 } };
      mockState.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      mockState.dice = { ...mockDice, values: [1, 1, 1, 1, 1] };

      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 5);
      MockDiceScorer.prototype.getCategoryScoreValue.mockImplementation(() => 25);

      const screen = new ScoreJokerScreen();
      const choices = screen.getChoices(mockState, mockConfig);

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
        { name: "twos", value: "twos", message: "Twos", disabled: true, hint: "0" },
        { name: "threes", value: "threes", message: "Threes", disabled: true, hint: "0" },
        { name: "fours", value: "fours", message: "Fours", disabled: true, hint: "0" },
        { name: "fives", value: "fives", message: "Fives", disabled: true, hint: "0" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: true, hint: "0" },
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

      const screen = new ScoreJokerScreen();
      const choices = screen.getChoices(mockState, mockConfig);

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
        { name: "threes", value: "threes", message: "Threes", disabled: false, hint: "0" },
        { name: "fours", value: "fours", message: "Fours", disabled: false, hint: "0" },
        { name: "fives", value: "fives", message: "Fives", disabled: false, hint: "0" },
        { name: "sixes", value: "sixes", message: "Sixes", disabled: false, hint: "0" },
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(ScoreJokerScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(YahtzeeScoreCategory.Ones, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new ScoreJokerScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SCORE_JOKER,
        answer: YahtzeeScoreCategory.Ones,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(YahtzeeScoreCategory.Ones);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });
  });

  describe("handleInput", () => {
    const getGameOverScreenSpy = jest.spyOn(ScoreJokerScreen.prototype, "getGameOverScreen");

    beforeEach(() => {
      getGameOverScreenSpy.mockClear().mockImplementation(() => null);
      MockDiceScorer.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
      mockGameState.nextPlayer.mockClear();
      mockPlayer.setScore.mockClear();
      MockGameActionScreen.mockClear();
      MockScoresheetScreen.mockClear();
    });

    test("handles selecting full house and straights when next screen should be game over", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.FullHouse, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.FullHouse);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.FullHouse, 25);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBeNull();
    });

    test("handles selecting full house and straights when next screen should be scoresheet", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.SmallStraight, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.SmallStraight);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.SmallStraight, 30);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).not.toHaveBeenCalledTimes(1);
      expect(MockScoresheetScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting full house and straights when next screen is invalid", () => {
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.STATISTICS);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.LargeStraight, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).not.toHaveBeenCalledWith(YahtzeeScoreCategory.LargeStraight);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.LargeStraight, 40);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).not.toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting any other category when next screen should be game over", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 1);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.GAME_OVER);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Ones, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Ones, 1);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBeNull();
    });

    test("handles selecting any other category when next screen should be scoresheet", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 2);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.VIEW_SCORE);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Twos, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Twos, 2);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).not.toHaveBeenCalledTimes(1);
      expect(MockScoresheetScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting any other category when next screen is invalid", () => {
      MockDiceScorer.prototype.scoreCategory.mockImplementationOnce(() => 3);
      mockGameState.nextPlayer.mockImplementationOnce(() => GameMode.STATISTICS);
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(YahtzeeScoreCategory.Threes, mockGameState, mockConfig);
      expect(MockDiceScorer.mock.instances[0].scoreCategory).toHaveBeenCalledWith(YahtzeeScoreCategory.Threes);
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Threes, 3);
      expect(mockGameState.nextPlayer).toHaveBeenCalledTimes(1);
      expect(getGameOverScreenSpy).not.toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(screen);
    });

    test("handles no selected option", () => {
      const screen = new ScoreJokerScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
