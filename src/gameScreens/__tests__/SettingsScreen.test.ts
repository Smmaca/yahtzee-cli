import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import { constructChoice } from "../../utils/screen";
import { Screen } from "../../types";
import SettingsScreen, { choiceLabels, SettingsScreenInput } from "../SettingsScreen";
import MainMenuScreen from "../MainMenuScreen";
import DiceDesignerScreen from "../DiceDesignerScreen";

jest.mock("clear");
jest.mock("../../utils/draw");
jest.mock("../MainMenuScreen");
jest.mock("../DiceDesignerScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;
const MockDiceDesignerScreen = DiceDesignerScreen as jest.MockedClass<typeof DiceDesignerScreen>;

describe("SettingsScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new SettingsScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(SettingsScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(SettingsScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(SettingsScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(SettingsScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => SettingsScreenInput.BACK);
      handleInputSpy.mockClear().mockImplementation(() => new MockMainMenuScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const screen = new SettingsScreen();
      await screen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(SettingsScreenInput.BACK, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new SettingsScreen();
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new SettingsScreen();
      const choices = screen.getChoices(mockGameState);

      expect(choices).toEqual([
        constructChoice(SettingsScreenInput.BACK, choiceLabels),
        { ...constructChoice(SettingsScreenInput.DICE_DESIGN, choiceLabels), hint: "[classic]" },
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(SettingsScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(SettingsScreenInput.BACK, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new SettingsScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SETTINGS,
        answer: SettingsScreenInput.BACK,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(SettingsScreenInput.BACK);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockMainMenuScreen.mockClear();
      MockDiceDesignerScreen.mockClear();
    });

    test("handles selecting option: Back", () => {
      const screen = new SettingsScreen();
      const nextScreen = screen.handleInput(SettingsScreenInput.BACK, { ...mockGameState }, mockConfig);
      expect(MockMainMenuScreen).toHaveBeenCalledWith();
      expect(nextScreen).toBe(MockMainMenuScreen.mock.instances[0]);
    });

    test("handles selecting option: Dice Design", () => {
      const screen = new SettingsScreen();
      const nextScreen = screen.handleInput(SettingsScreenInput.DICE_DESIGN, { ...mockGameState }, mockConfig);
      expect(MockDiceDesignerScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockDiceDesignerScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new SettingsScreen();
      const nextScreen = screen.handleInput(undefined, { ...mockGameState }, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
