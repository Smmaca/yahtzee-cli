import clear from "clear";
import MockPrompter from "../modules/prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import * as drawUtils from "../utils/draw";
import { constructChoice } from "../utils/screen";
import NewMultiplayerGameScreen, { choiceLabels, NewMultiplayerGameScreenInput } from "./NewMultiplayerGameScreen";
import GameActionScreen from "./GameActionScreen";
import NewGameScreen from "./NewGameScreen";
import AddPlayerScreen from "./AddPlayerScreen";
import mockPlayer from "../testUtils/MockPlayer";
import { Screen } from "../types";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("./AddPlayerScreen");
jest.mock("./GameActionScreen");
jest.mock("./NewGameScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockAddPlayerScreen = AddPlayerScreen as jest.MockedClass<typeof AddPlayerScreen>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;
const MockNewGameScreen = NewGameScreen as jest.MockedClass<typeof NewGameScreen>;

describe("NewMultiplayerGameScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new NewMultiplayerGameScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(NewMultiplayerGameScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(NewMultiplayerGameScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(NewMultiplayerGameScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(NewMultiplayerGameScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => NewMultiplayerGameScreenInput.CANCEL);
      handleInputSpy.mockClear().mockImplementation(() => new NewMultiplayerGameScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new NewMultiplayerGameScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(NewMultiplayerGameScreenInput.CANCEL, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeEach(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws a message if no added players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [];
      const screen = new NewMultiplayerGameScreen();
      screen.draw(mockState);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "No players added yet");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "\n");
    });

    test("draws added players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
      ];
      const screen = new NewMultiplayerGameScreen();
      screen.draw(mockState);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "Player 1: Player 1");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "Player 2: Player 2");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "\n");
    });
  });

  describe("getChoices", () => {
    test("gives the correct options for less than two players", () => {
      const screen = new NewMultiplayerGameScreen();
      const choices = screen.getChoices(mockGameState, mockConfig);

      expect(choices).toEqual([
        constructChoice(NewMultiplayerGameScreenInput.ADD_PLAYER, choiceLabels),
        constructChoice(NewMultiplayerGameScreenInput.CANCEL, choiceLabels),
      ]);
    });

    test("gives the correct options for two players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
      ];

      const screen = new NewMultiplayerGameScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        constructChoice(NewMultiplayerGameScreenInput.ADD_PLAYER, choiceLabels),
        constructChoice(NewMultiplayerGameScreenInput.START_GAME, choiceLabels),
        constructChoice(NewMultiplayerGameScreenInput.CANCEL, choiceLabels),
      ]);
    });

    test("gives the correct options for maxed players", () => {
      const mockState = { ...mockGameState };
      mockState.players = [
        { ...mockPlayer },
        { ...mockPlayer, name: "Player 2" },
        { ...mockPlayer, name: "Player 3" },
        { ...mockPlayer, name: "Player 4" },
      ];

      const screen = new NewMultiplayerGameScreen();
      const choices = screen.getChoices(mockState, mockConfig);

      expect(choices).toEqual([
        constructChoice(NewMultiplayerGameScreenInput.START_GAME, choiceLabels),
        constructChoice(NewMultiplayerGameScreenInput.CANCEL, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(NewMultiplayerGameScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(NewMultiplayerGameScreenInput.CANCEL, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new NewMultiplayerGameScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.NEW_MULTIPLAYER_GAME,
        answer: NewMultiplayerGameScreenInput.CANCEL,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(NewMultiplayerGameScreenInput.CANCEL);
      expect(getChoicesSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      mockGameState.newGame.mockClear();
      mockGameState.initSinglePlayer.mockClear();
      MockGameActionScreen.mockClear
      MockAddPlayerScreen.mockClear();
      MockNewGameScreen.mockClear();
    });

    test("handles selecting option: Add player", () => {
      const screen = new NewMultiplayerGameScreen();
      const nextScreen = screen.handleInput(NewMultiplayerGameScreenInput.ADD_PLAYER);
      expect(MockAddPlayerScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockAddPlayerScreen.mock.instances[0]);
    });

    test("handles selecting option: Start game", () => {
      const screen = new NewMultiplayerGameScreen();
      const nextScreen = screen.handleInput(NewMultiplayerGameScreenInput.START_GAME);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles selecting option: Cancel", () => {
      const screen = new NewMultiplayerGameScreen();
      const nextScreen = screen.handleInput(NewMultiplayerGameScreenInput.CANCEL);
      expect(MockNewGameScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockNewGameScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new NewMultiplayerGameScreen();
      const nextScreen = screen.handleInput(undefined);
      expect(nextScreen).toBe(screen);
    });
  });
});
