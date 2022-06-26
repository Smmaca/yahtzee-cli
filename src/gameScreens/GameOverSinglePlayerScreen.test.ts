import clear from "clear";
import MockPrompter from "../modules/prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import mockPlayer from "../testUtils/MockPlayer";
import GameOverSinglePlayerScreen from "./GameOverSinglePlayerScreen";
import GameActionScreen from "./GameActionScreen";
import MainMenuScreen from "./MainMenuScreen";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("./GameActionScreen");
jest.mock("./MainMenuScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("GameOverSinglePlayerScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new GameOverSinglePlayerScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(GameOverSinglePlayerScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(GameOverSinglePlayerScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(GameOverSinglePlayerScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(GameOverSinglePlayerScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => true);
      handleInputSpy.mockClear().mockImplementation(() => new GameOverSinglePlayerScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new GameOverSinglePlayerScreen();
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

    beforeEach(() => {
      mockPlayer.renderScoresheet.mockClear();
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    afterAll(() => {
      consoleLogSpy.mockRestore();
    });

    test("draws scoresheet for player", () => {
      const screen = new GameOverSinglePlayerScreen();
      screen.draw(mockGameState);
      expect(consoleLogSpy).toHaveBeenCalledWith("Game over!\n");
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
    });
  });

  describe("getInput", () => {
    test("gets select input from player", async () => {
      const screen = new GameOverSinglePlayerScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.GAME_OVER_SINGLE_PLAYER,
        answer: true,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(true);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      mockGameState.resetGame.mockClear();
      MockGameActionScreen.mockClear();
      MockMainMenuScreen.mockClear();
    });

    test("handles play again: true", () => {
      const screen = new GameOverSinglePlayerScreen();
      const nextScreen = screen.handleInput(true, mockGameState);
      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles play again: false", () => {
      const screen = new GameOverSinglePlayerScreen();
      const nextScreen = screen.handleInput(false, mockGameState);
      expect(MockMainMenuScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockMainMenuScreen.mock.instances[0]);
    });
  });
});
