import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import QuitConfirmScreen from "../QuitConfirmScreen";
import MainMenuScreen from "../MainMenuScreen";
import GameActionScreen from "../GameActionScreen";
import { Screen } from "../../types";

jest.mock("clear");
jest.mock("../../utils/draw");
jest.mock("../MainMenuScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("QuitConfirmScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new QuitConfirmScreen({ previousScreen: new GameActionScreen() });
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(QuitConfirmScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(QuitConfirmScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(QuitConfirmScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(QuitConfirmScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => true);
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

      const addPlayerScreen = new QuitConfirmScreen({ previousScreen: new GameActionScreen() });
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(true, mockGameState, mockConfig);
    });
  });
  
  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new QuitConfirmScreen({ previousScreen: new GameActionScreen() });
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getInput", () => {
    test("gets select input from player", async () => {
      const screen = new QuitConfirmScreen({ previousScreen: new GameActionScreen() });
      const mockPrompter = new MockPrompter([{
        promptName: Screen.QUIT_CONFIRM,
        answer: true,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(true);
    });

    test("gets select input from player - soft quit", async () => {
      const screen = new QuitConfirmScreen({ previousScreen: new GameActionScreen(), softQuit: true });
      const mockPrompter = new MockPrompter([{
        promptName: Screen.QUIT_CONFIRM,
        answer: false,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(false);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockMainMenuScreen.mockClear();
    });

    test("handles quit: true", () => {
      const previousScreen = new GameActionScreen();
      const screen = new QuitConfirmScreen({ previousScreen });
      const nextScreen = screen.handleInput(true);
      expect(nextScreen).toBe(null);
    });

    test("handles quit: false", () => {
      const previousScreen = new GameActionScreen();
      const screen = new QuitConfirmScreen({ previousScreen });
      const nextScreen = screen.handleInput(false);
      expect(nextScreen).toBe(previousScreen);
    });

    test("handles soft quit: true", () => {
      const previousScreen = new GameActionScreen();
      const screen = new QuitConfirmScreen({ previousScreen, softQuit: true });
      const nextScreen = screen.handleInput(true);
      expect(MockMainMenuScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockMainMenuScreen.mock.instances[0]);
    });

    test("handles soft quit: false", () => {
      const previousScreen = new GameActionScreen();
      const screen = new QuitConfirmScreen({ previousScreen, softQuit: true });
      const nextScreen = screen.handleInput(false);
      expect(nextScreen).toBe(previousScreen);
    });
  });
});
