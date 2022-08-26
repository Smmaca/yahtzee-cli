import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import { constructChoice } from "../../utils/screen";
import { Screen } from "../../types";
import DiceDesignerScreen, { choiceLabels, DiceDesignerScreenInput } from "../DiceDesignerScreen";
import SettingsScreen from "../SettingsScreen";
import { DiceDesign } from "../../utils/diceDesigns";
import Settings from "../../modules/Settings";
import DiceDrawer from "../../modules/DiceDrawer";

jest.mock("clear");
jest.mock("../../utils/draw");
jest.mock("../SettingsScreen");
jest.mock("../../modules/Settings");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockSettingsScreen = SettingsScreen as jest.MockedClass<typeof SettingsScreen>;
const MockSettingsModule = Settings as jest.MockedClass<typeof Settings>;

describe("DiceDesignerScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new DiceDesignerScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(DiceDesignerScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(DiceDesignerScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(DiceDesignerScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(DiceDesignerScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => DiceDesignerScreenInput.BACK);
      handleInputSpy.mockClear().mockImplementation(() => new MockSettingsScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const screen = new DiceDesignerScreen();
      await screen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(DiceDesignerScreenInput.BACK, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new DiceDesignerScreen();
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new DiceDesignerScreen();
      const choices = screen.getChoices(mockGameState);

      const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5, 6], [false, false, false, false, false, false]);

      expect(choices).toEqual([
        { ...constructChoice(DiceDesignerScreenInput.BACK, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.CLASSIC) },
        { ...constructChoice(DiceDesign.CLASSIC, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.CLASSIC), hint: "[Current]" },
        { ...constructChoice(DiceDesign.DIGITS, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.DIGITS) },
        { ...constructChoice(DiceDesign.PALMS, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.PALMS) },
        { ...constructChoice(DiceDesign.WORDY, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.WORDY) },
        { ...constructChoice(DiceDesign.VOID, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.VOID) },
        { ...constructChoice(DiceDesign.ROMAN, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.ROMAN) },
        { ...constructChoice(DiceDesign.TWINKLE, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.TWINKLE) },
        { ...constructChoice(DiceDesign.MONEYMAKER, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.MONEYMAKER) },
        { ...constructChoice(DiceDesign.RIDDLER, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.RIDDLER) },
        { ...constructChoice(DiceDesign.SYMBOLS, choiceLabels), preview: diceDrawer.drawDice(DiceDesign.SYMBOLS) },
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(DiceDesignerScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(DiceDesign.CLASSIC, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new DiceDesignerScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.DICE_DESIGNER,
        answer: DiceDesign.CLASSIC,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(DiceDesign.CLASSIC);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockSettingsScreen.mockClear();
      MockSettingsModule.mockClear();
    });

    test("handles selecting option: Back", () => {
      const screen = new DiceDesignerScreen();
      const nextScreen = screen.handleInput(DiceDesignerScreenInput.BACK, { ...mockGameState }, mockConfig);
      expect(MockSettingsScreen).toHaveBeenCalledWith();
      expect(nextScreen).toBe(MockSettingsScreen.mock.instances[0]);
    });

    test("handles selecting option: Classic", () => {
      const gameState = { ...mockGameState };
      const screen = new DiceDesignerScreen();
      const nextScreen = screen.handleInput(DiceDesign.CLASSIC, gameState, mockConfig);
      expect(MockSettingsModule).toHaveBeenCalledTimes(1);
      expect(MockSettingsModule.mock.instances[0].saveSettings).toHaveBeenCalledWith({ diceDesign: DiceDesign.CLASSIC });
      expect(gameState.diceDesign).toBe(DiceDesign.CLASSIC);
      expect(MockSettingsScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockSettingsScreen.mock.instances[0]);
    });

    test("handles selecting option: Digits", () => {
      const gameState = { ...mockGameState };
      const screen = new DiceDesignerScreen();
      const nextScreen = screen.handleInput(DiceDesign.DIGITS, gameState, mockConfig);
      expect(MockSettingsModule).toHaveBeenCalledTimes(1);
      expect(MockSettingsModule.mock.instances[0].saveSettings).toHaveBeenCalledWith({ diceDesign: DiceDesign.DIGITS });
      expect(gameState.diceDesign).toBe(DiceDesign.DIGITS);
      expect(MockSettingsScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockSettingsScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new DiceDesignerScreen();
      const nextScreen = screen.handleInput(undefined, { ...mockGameState }, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
