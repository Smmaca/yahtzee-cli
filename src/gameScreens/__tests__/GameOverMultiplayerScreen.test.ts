import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import QuitConfirmScreen from "../QuitConfirmScreen";
import { constructChoice } from "../../utils/screen";
import mockPlayer from "../../testUtils/MockPlayer";
import GameOverMultiplayerScreen, { choiceLabels, GameOverMultiplayerScreenInput } from "../GameOverMultiplayerScreen";
import GameActionScreen from "../GameActionScreen";
import { Screen } from "../../types";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("./GameActionScreen");
jest.mock("./QuitConfirmScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockQuitConfirmScreen = QuitConfirmScreen as jest.MockedClass<typeof QuitConfirmScreen>;

describe("GameOverMultiplayerScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new GameOverMultiplayerScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(GameOverMultiplayerScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(GameOverMultiplayerScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(GameOverMultiplayerScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(GameOverMultiplayerScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => GameOverMultiplayerScreenInput.QUIT);
      handleInputSpy.mockClear().mockImplementation(() => new GameOverMultiplayerScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new GameOverMultiplayerScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(GameOverMultiplayerScreenInput.QUIT, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeEach(() => {
      mockGameState.getCurrentPlayer.mockClear();
      mockGameState.getWinner.mockClear();
      mockGameState.renderPlayerScores.mockClear();
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    afterAll(() => {
      consoleLogSpy.mockRestore();
    });

    test("draws scoresheet for selected player", () => {
      const mockState = { ...mockGameState };
      mockState.getCurrentPlayer.mockImplementationOnce(() => mockPlayer);
      mockState.currentPlayerIndex = 0;
      const screen = new GameOverMultiplayerScreen();
      screen.draw(mockState);
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
    });

    test("draws final scores if no selected player", () => {
      const mockState = { ...mockGameState };
      mockState.currentPlayerIndex = null;
      mockState.getWinner.mockImplementationOnce(() => mockPlayer);
      const screen = new GameOverMultiplayerScreen();
      screen.draw(mockState);
      expect(consoleLogSpy).toHaveBeenCalledWith("Player 1 wins!");
      expect(mockState.renderPlayerScores).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChoices", () => {
    test("gives correct options for a two player game", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
      ];

      const screen = new GameOverMultiplayerScreen();
      const choices = screen.getChoices(mockState);

      expect(choices).toEqual([
        constructChoice(GameOverMultiplayerScreenInput.FINAL_SCORES, choiceLabels),
        { name: "Player 1", value: 0, message: "See Player 1's scoresheet" },
        { name: "Player 2", value: 1, message: "See Player 2's scoresheet" },
        constructChoice(GameOverMultiplayerScreenInput.PLAY_AGAIN, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT, choiceLabels),
      ]);
    });

    test("gives correct options for a three player game", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
        { ...mockPlayer, name: "Player 3" },
      ];

      const screen = new GameOverMultiplayerScreen();
      const choices = screen.getChoices(mockState);

      expect(choices).toEqual([
        constructChoice(GameOverMultiplayerScreenInput.FINAL_SCORES, choiceLabels),
        { name: "Player 1", value: 0, message: "See Player 1's scoresheet" },
        { name: "Player 2", value: 1, message: "See Player 2's scoresheet" },
        { name: "Player 3", value: 2, message: "See Player 3's scoresheet" },
        constructChoice(GameOverMultiplayerScreenInput.PLAY_AGAIN, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT, choiceLabels),
      ]);
    });

    test("gives correct options for a four player game", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
        { ...mockPlayer, name: "Player 3" },
        { ...mockPlayer, name: "Player 4" },
      ];

      const screen = new GameOverMultiplayerScreen();
      const choices = screen.getChoices(mockState);

      expect(choices).toEqual([
        constructChoice(GameOverMultiplayerScreenInput.FINAL_SCORES, choiceLabels),
        { name: "Player 1", value: 0, message: "See Player 1's scoresheet" },
        { name: "Player 2", value: 1, message: "See Player 2's scoresheet" },
        { name: "Player 3", value: 2, message: "See Player 3's scoresheet" },
        { name: "Player 4", value: 3, message: "See Player 4's scoresheet" },
        constructChoice(GameOverMultiplayerScreenInput.PLAY_AGAIN, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU, choiceLabels),
        constructChoice(GameOverMultiplayerScreenInput.QUIT, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(GameOverMultiplayerScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(GameOverMultiplayerScreenInput.PLAY_AGAIN, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new GameOverMultiplayerScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.GAME_OVER_MULTIPLAYER,
        answer: GameOverMultiplayerScreenInput.PLAY_AGAIN,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(GameOverMultiplayerScreenInput.PLAY_AGAIN);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockGameActionScreen.mockClear();
      MockQuitConfirmScreen.mockClear();
    });

    test("handles selecting option: See final scores", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput(GameOverMultiplayerScreenInput.FINAL_SCORES, mockGameState);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(null);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting option: See player scoresheet", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput("Player 1", mockGameState);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(0);
      expect(nextScreen).toBe(screen);
    });

    test("handles selecting option: Play again", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput(GameOverMultiplayerScreenInput.PLAY_AGAIN, mockGameState);
      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles selecting option: Quit to main menu", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput(GameOverMultiplayerScreenInput.QUIT_TO_MAIN_MENU, mockGameState);
      expect(MockQuitConfirmScreen).toHaveBeenCalledWith({ previousScreen: screen, softQuit: true });
      expect(nextScreen).toBe(MockQuitConfirmScreen.mock.instances[0]);
    });

    test("handles selecting option: Quit", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput(GameOverMultiplayerScreenInput.QUIT, mockGameState);
      expect(MockQuitConfirmScreen).toHaveBeenCalledWith({ previousScreen: screen });
      expect(nextScreen).toBe(MockQuitConfirmScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new GameOverMultiplayerScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState);
      expect(nextScreen).toBe(screen);
    });
  });
});
