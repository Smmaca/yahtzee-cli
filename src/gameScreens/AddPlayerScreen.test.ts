import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import AddPlayerScreen from "./AddPlayerScreen";
import { Screen } from "./BaseGameScreen";
import NewMultiplayerGameScreen from "./NewMultiplayerGameScreen";

jest.mock("./NewMultiplayerGameScreen");

const MockNewMultiplayerGameScreen = NewMultiplayerGameScreen as jest.MockedClass<
  typeof NewMultiplayerGameScreen
>;

describe("AddPlayerScreen", () => {
  beforeEach(() => {
    MockNewMultiplayerGameScreen.mockClear();
    mockGameState.addPlayer.mockClear();
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(AddPlayerScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(AddPlayerScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(AddPlayerScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(AddPlayerScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockImplementation(() => {});
      drawSpy.mockImplementation(() => {});
      getInputSpy.mockImplementation(async () => "");
      handleInputSpy.mockImplementation(() => new AddPlayerScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new AddPlayerScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith("", mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeAll(() => {
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    test("draws nothing", () => {
      const screen = new AddPlayerScreen();
      screen.draw();
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });

  describe("getInput", () => {
    test("gets text input from player", async () => {
      const screen = new AddPlayerScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.ADD_PLAYER,
        answer: "Player 1",
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe("Player 1");
    });
  });

  describe("handleInput", () => {
    test("handles input", () => {
      const screen = new AddPlayerScreen();
      const nextScreen = screen.handleInput("Player 1", mockGameState, mockConfig);
      expect(mockGameState.addPlayer).toHaveBeenCalledWith("Player 1");
      expect(MockNewMultiplayerGameScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockNewMultiplayerGameScreen.mock.instances[0]);
    });

    test("handles no input", () => {
      const screen = new AddPlayerScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(mockGameState.addPlayer).not.toHaveBeenCalled();
      expect(MockNewMultiplayerGameScreen).not.toHaveBeenCalled();
      expect(nextScreen).toBe(screen);
    });
  });
});
