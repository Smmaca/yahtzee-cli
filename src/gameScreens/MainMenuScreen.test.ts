import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import { constructChoice } from "../utils/screenUtils";
import MainMenuScreen, { choiceLabels, MainMenuScreenInput } from "./MainMenuScreen";
import NewGameScreen from "./NewGameScreen";
import StatisticsScreen from "./StatisticsScreen";
import QuitConfirmScreen from "./QuitConfirmScreen";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("./NewGameScreen");
jest.mock("./StatisticsScreen");
jest.mock("./QuitConfirmScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockNewGameScreen = NewGameScreen as jest.MockedClass<typeof NewGameScreen>;
const MockStatisticsScreen = StatisticsScreen as jest.MockedClass<typeof StatisticsScreen>;
const MockQuitConfirmScreen = QuitConfirmScreen as jest.MockedClass<typeof QuitConfirmScreen>;

describe("MainMenuScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new MainMenuScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(MainMenuScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(MainMenuScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(MainMenuScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(MainMenuScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => MainMenuScreenInput.QUIT);
      handleInputSpy.mockClear().mockImplementation(() => new MainMenuScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new MainMenuScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(MainMenuScreenInput.QUIT, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new MainMenuScreen();
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new MainMenuScreen();
      const choices = screen.getChoices();

      expect(choices).toEqual([
        constructChoice(MainMenuScreenInput.NEW_GAME, choiceLabels),
        constructChoice(MainMenuScreenInput.STATISTICS, choiceLabels),
        constructChoice(MainMenuScreenInput.QUIT, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(MainMenuScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(MainMenuScreenInput.NEW_GAME, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new MainMenuScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.MAIN_MENU,
        answer: MainMenuScreenInput.NEW_GAME,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(MainMenuScreenInput.NEW_GAME);
      expect(getChoicesSpy).toHaveBeenCalledWith();
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockNewGameScreen.mockClear();
      MockStatisticsScreen.mockClear();
      MockQuitConfirmScreen.mockClear();
    });

    test("handles selecting option: New game", () => {
      const screen = new MainMenuScreen();
      const nextScreen = screen.handleInput(MainMenuScreenInput.NEW_GAME);
      expect(MockNewGameScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockNewGameScreen.mock.instances[0]);
    });

    test("handles selecting option: Statistics", () => {
      const screen = new MainMenuScreen();
      const nextScreen = screen.handleInput(MainMenuScreenInput.STATISTICS);
      expect(MockStatisticsScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockStatisticsScreen.mock.instances[0]);
    });

    test("handles selecting option: Quit", () => {
      const screen = new MainMenuScreen();
      const nextScreen = screen.handleInput(MainMenuScreenInput.QUIT);
      expect(MockQuitConfirmScreen).toHaveBeenCalledWith({ previousScreen: screen });
      expect(nextScreen).toBe(MockQuitConfirmScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new MainMenuScreen();
      const nextScreen = screen.handleInput(undefined);
      expect(nextScreen).toBe(screen);
    });
  });
});
