import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import LockDiceScreen from "./LockDiceScreen";
import GameActionScreen from "./GameActionScreen";
import DiceScorer from "../modules/DiceScorer";
import mockDice from "../testUtils/MockDice";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("../modules/DiceScorer");
jest.mock("./GameActionScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;

describe("LockDiceScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new LockDiceScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(LockDiceScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(LockDiceScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(LockDiceScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(LockDiceScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => ({}));
      handleInputSpy.mockClear().mockImplementation(() => new LockDiceScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new LockDiceScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(({}), mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      mockDrawUtils.drawTurnStats.mockClear();
      mockDrawUtils.drawDiceValues.mockClear();
    });

    test("draws turn stats and dice", () => {
      const screen = new LockDiceScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockDiceScorer).toHaveBeenCalledWith(mockGameState.dice.values, mockConfig);
      expect(drawUtils.drawTurnStats).toHaveBeenCalledTimes(1);
      expect(drawUtils.drawDiceValues).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChoices", () => {
    test("returns a choice for each dice", () => {
      const mockState = { ...mockGameState };
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };
      const screen = new LockDiceScreen();
      const choices = screen.getChoices(mockState);
      expect(choices).toEqual([
        { name: "0", message: "Dice 1", hint: "1", value: 0 },
        { name: "1", message: "Dice 2", hint: "2", value: 1 },
        { name: "2", message: "Dice 3", hint: "3", value: 2 },
        { name: "3", message: "Dice 4", hint: "4", value: 3 },
        { name: "4", message: "Dice 5", hint: "5", value: 4 },
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(LockDiceScreen.prototype, "getChoices");
    const getMultiselectInputSpy = jest.spyOn(MockPrompter.prototype, "getInputFromMultiselect");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        { name: "0", message: "Dice 1", hint: "1", value: 0 },
        { name: "1", message: "Dice 2", hint: "2", value: 1 },
        { name: "2", message: "Dice 3", hint: "3", value: 2 },
        { name: "3", message: "Dice 4", hint: "4", value: 3 },
        { name: "4", message: "Dice 5", hint: "5", value: 4 },
      ]);
      getMultiselectInputSpy.mockClear();
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
      getMultiselectInputSpy.mockRestore();
    });

    test("gets multiselect input from player", async () => {
      const screen = new LockDiceScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.LOCK_DICE,
        answer: { 0: 0, 1: 1, 2: 2 },
      }]);
      const mockState = { ...mockGameState };
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5] };
      const input = await screen.getInput(mockPrompter, mockState, mockConfig);
      expect(input).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
      expect(getMultiselectInputSpy).toHaveBeenCalledWith({
        name: Screen.LOCK_DICE,
        message: mockConfig.messages.diceLockPrompt,
        limit: 5,
        choices: [
          { name: "0", message: "Dice 1", hint: "1", value: 0 },
          { name: "1", message: "Dice 2", hint: "2", value: 1 },
          { name: "2", message: "Dice 3", hint: "3", value: 2 },
          { name: "3", message: "Dice 4", hint: "4", value: 3 },
          { name: "4", message: "Dice 5", hint: "5", value: 4 },
        ],
        initial: [],
      })
      expect(getChoicesSpy).toHaveBeenCalledWith(mockState);
    });

    test("gets multiselect input from player when some dice are already locked", async () => {
      const screen = new LockDiceScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.LOCK_DICE,
        answer: { 0: 0, 1: 1, 2: 2 },
      }]);
      const mockState = { ...mockGameState };
      mockState.dice = { ...mockDice, values: [1, 2, 3, 4, 5], lock: [false, true, true, false, false] };
      const input = await screen.getInput(mockPrompter, mockState, mockConfig);
      expect(input).toStrictEqual({ 0: 0, 1: 1, 2: 2 });
      expect(getMultiselectInputSpy).toHaveBeenCalledWith({
        name: Screen.LOCK_DICE,
        message: mockConfig.messages.diceLockPrompt,
        limit: 5,
        choices: [
          { name: "0", message: "Dice 1", hint: "1", value: 0 },
          { name: "1", message: "Dice 2", hint: "2", value: 1 },
          { name: "2", message: "Dice 3", hint: "3", value: 2 },
          { name: "3", message: "Dice 4", hint: "4", value: 3 },
          { name: "4", message: "Dice 5", hint: "5", value: 4 },
        ],
        initial: ["1", "2"],
      })
      expect(getChoicesSpy).toHaveBeenCalledWith(mockState);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      mockDice.resetLock.mockClear();
      mockDice.setLock.mockClear();
      MockGameActionScreen.mockClear();
    });

    test("handles locking dice", () => {
      const screen = new LockDiceScreen();
      const nextScreen = screen.handleInput({ 0: 0, 1: 1, 2: 2 }, mockGameState);
      expect(mockDice.resetLock).toHaveBeenCalledTimes(1);
      expect(mockDice.setLock).toHaveBeenCalledWith([true, true, true, false, false]);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });
  });
});
