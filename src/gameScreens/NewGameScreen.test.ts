import clear from "clear";
import MockPrompter from "../modules/prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import * as drawUtils from "../utils/draw";
import { constructChoice } from "../utils/screen";
import NewGameScreen, { choiceLabels, NewGameScreenInput } from "./NewGameScreen";
import GameActionScreen from "./GameActionScreen";
import NewMultiplayerGameScreen from "./NewMultiplayerGameScreen";
import MainMenuScreen from "./MainMenuScreen";
import { Screen } from "../types";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("./GameActionScreen");
jest.mock("./NewMultiplayerGameScreen");
jest.mock("./MainMenuScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockNewMultiplayerGameScreen = NewMultiplayerGameScreen as jest.MockedClass<typeof NewMultiplayerGameScreen>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("NewGameScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new NewGameScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(NewGameScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(NewGameScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(NewGameScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(NewGameScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => NewGameScreenInput.CANCEL);
      handleInputSpy.mockClear().mockImplementation(() => new NewGameScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new NewGameScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(NewGameScreenInput.CANCEL, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new NewGameScreen();
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new NewGameScreen();
      const choices = screen.getChoices();

      expect(choices).toEqual([
        constructChoice(NewGameScreenInput.SINGLEPLAYER, choiceLabels),
        constructChoice(NewGameScreenInput.MULTIPLAYER, choiceLabels),
        constructChoice(NewGameScreenInput.CANCEL, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(NewGameScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(NewGameScreenInput.CANCEL, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new NewGameScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.NEW_GAME,
        answer: NewGameScreenInput.CANCEL,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(NewGameScreenInput.CANCEL);
      expect(getChoicesSpy).toHaveBeenCalledWith();
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      mockGameState.newGame.mockClear();
      mockGameState.initSinglePlayer.mockClear();
      MockGameActionScreen.mockClear
      MockNewMultiplayerGameScreen.mockClear();
      MockMainMenuScreen.mockClear();
    });

    test("handles selecting option: Single player", () => {
      const screen = new NewGameScreen();
      const nextScreen = screen.handleInput(NewGameScreenInput.SINGLEPLAYER, mockGameState);
      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.initSinglePlayer).toHaveBeenCalledTimes(1);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles selecting option: Multiplayer", () => {
      const screen = new NewGameScreen();
      const nextScreen = screen.handleInput(NewGameScreenInput.MULTIPLAYER, mockGameState);
      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(MockNewMultiplayerGameScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockNewMultiplayerGameScreen.mock.instances[0]);
    });

    test("handles selecting option: Cancel", () => {
      const screen = new NewGameScreen();
      const nextScreen = screen.handleInput(NewGameScreenInput.CANCEL, mockGameState);
      expect(MockMainMenuScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockMainMenuScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new NewGameScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState);
      expect(nextScreen).toBe(screen);
    });
  });
});
