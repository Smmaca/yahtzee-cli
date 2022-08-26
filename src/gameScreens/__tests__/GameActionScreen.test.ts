import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import DiceScorer from "../../modules/DiceScorer";
import GameActionScreen, { GameActionScreenInput, choiceLabels } from "../GameActionScreen";
import mockDice from "../../testUtils/MockDice";
import LockDiceScreen from "../LockDiceScreen";
import ScoresheetScreen from "../ScoresheetScreen";
import ScoreDiceScreen from "../ScoreDiceScreen";
import QuitConfirmScreen from "../QuitConfirmScreen";
import { constructChoice } from "../../utils/screen";
import { Screen } from "../../types";
import DiceDrawer from "../../modules/DiceDrawer";

jest.mock("clear");
jest.mock("../../utils/draw");
jest.mock("../../modules/DiceScorer");
jest.mock("../../modules/DiceDrawer");
jest.mock("../LockDiceScreen");
jest.mock("../ScoresheetScreen");
jest.mock("../ScoreDiceScreen");
jest.mock("../QuitConfirmScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockDiceDrawer = DiceDrawer as jest.MockedClass<typeof DiceDrawer>;
const MockLockDiceScreen = LockDiceScreen as jest.MockedClass<typeof LockDiceScreen>;
const MockScoresheetScreen = ScoresheetScreen as jest.MockedClass<typeof ScoresheetScreen>;
const MockScoreDiceScreen = ScoreDiceScreen as jest.MockedClass<typeof ScoreDiceScreen>;
const MockQuitConfirmScreen = QuitConfirmScreen as jest.MockedClass<typeof QuitConfirmScreen>;

describe("GameActionScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new GameActionScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(GameActionScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(GameActionScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(GameActionScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(GameActionScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => GameActionScreenInput.QUIT);
      handleInputSpy.mockClear().mockImplementation(() => new GameActionScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new GameActionScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(GameActionScreenInput.QUIT, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      MockDiceDrawer.mockClear();
      mockDrawUtils.drawTurnStats.mockClear();
    });

    test("draws turn stats and dice", () => {
      const screen = new GameActionScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockDiceScorer).toHaveBeenCalledWith(mockGameState.dice.values, mockConfig);
      expect(MockDiceDrawer).toHaveBeenCalledWith(mockGameState.diceDesign, mockGameState.dice.values, mockGameState.dice.lock);
      expect(drawUtils.drawTurnStats).toHaveBeenCalledTimes(1);
      expect(MockDiceDrawer.mock.instances[0].renderDice).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChoices", () => {
    test("when no rolls have been done, allows option to roll dice along with default options", () => {
      const screen = new GameActionScreen();
      const choices = screen.getChoices(mockGameState, mockConfig);

      expect(choices).toEqual([
        constructChoice(GameActionScreenInput.ROLL_DICE, choiceLabels),
        constructChoice(GameActionScreenInput.SEE_SCORESHEET, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT, choiceLabels),
      ]);
    });

    test("after rolling and before max rolls is reached, allows option to roll again, lock dice and score dice along with default option", () => {
      const mockState = { ...mockGameState };
      mockState.rollNumber = 1;

      const screen = new GameActionScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        constructChoice(GameActionScreenInput.ROLL_AGAIN, choiceLabels),
        constructChoice(GameActionScreenInput.LOCK_DICE, choiceLabels),
        constructChoice(GameActionScreenInput.SCORE_DICE, choiceLabels),
        constructChoice(GameActionScreenInput.SEE_SCORESHEET, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT, choiceLabels),
      ]);
    });

    test("after max rolls is reached, allows option to score dice along with default options", () => {
      const mockState = { ...mockGameState };
      mockState.rollNumber = 3;

      const screen = new GameActionScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        constructChoice(GameActionScreenInput.SCORE_DICE, choiceLabels),
        constructChoice(GameActionScreenInput.SEE_SCORESHEET, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameActionScreenInput.QUIT, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(GameActionScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(GameActionScreenInput.ROLL_DICE, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new GameActionScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.GAME_ACTION,
        answer: GameActionScreenInput.ROLL_DICE,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(GameActionScreenInput.ROLL_DICE);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      mockGameState.incrementRollNumber.mockClear();
      mockDice.roll.mockClear();

      MockLockDiceScreen.mockClear();
      MockScoresheetScreen.mockClear();
      MockScoreDiceScreen.mockClear();
      MockQuitConfirmScreen.mockClear();
    });

    test("handles selecting option: Roll dice", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.ROLL_DICE, mockGameState);
      expect(mockDice.roll).toHaveBeenCalledTimes(1);
      expect(mockGameState.incrementRollNumber).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting option: Roll again", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.ROLL_AGAIN, mockGameState);
      expect(mockDice.roll).toHaveBeenCalledTimes(1);
      expect(mockGameState.incrementRollNumber).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting option: Lock dice", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.LOCK_DICE, mockGameState);
      expect(MockLockDiceScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockLockDiceScreen.mock.instances[0]);
    });

    test("handles selecting option: See scoresheet", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.SEE_SCORESHEET, mockGameState);
      expect(MockScoresheetScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoresheetScreen.mock.instances[0]);
    });

    test("handles selecting option: Score dice", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.SCORE_DICE, mockGameState);
      expect(MockScoreDiceScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockScoreDiceScreen.mock.instances[0]);
    });

    test("handles selecting option: Quit to main menu", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.QUIT_TO_MAIN_MENU, mockGameState);
      expect(MockQuitConfirmScreen).toHaveBeenCalledWith({ previousScreen: screen, softQuit: true });
      expect(nextScreen).toBe(MockQuitConfirmScreen.mock.instances[0]);
    });

    test("handles selecting option: Quit", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(GameActionScreenInput.QUIT, mockGameState);
      expect(MockQuitConfirmScreen).toHaveBeenCalledWith({ previousScreen: screen });
      expect(nextScreen).toBe(MockQuitConfirmScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new GameActionScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState);
      expect(nextScreen).toBe(screen);
    });
  });
});
