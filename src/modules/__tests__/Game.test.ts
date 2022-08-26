import util from "util";
import Game from "../Game";
import mockConfig from "../../testUtils/MockConfig"
import MockPrompter from "../prompters/MockPrompter";
import GameState from "../GameState";
import Statistics from "../Statistics";
import MainMenuScreen from "../../gameScreens/MainMenuScreen";
import mockDice from "../../testUtils/MockDice";
import Settings from "../Settings";

jest.mock("util");
jest.mock("../GameState");
jest.mock("../Statistics");
jest.mock("../Settings");
jest.mock("../../gameScreens/MainMenuScreen");

const mockUtil = util as jest.Mocked<typeof util>;
const MockGameState = GameState as jest.MockedClass<typeof GameState>;
const MockStatistics = Statistics as jest.MockedClass<typeof Statistics>;
const MockSettings = Settings as jest.MockedClass<typeof Settings>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("Game", () => {
  test("saves the config and creates a new game state on instantiation", () => {
    const game = new Game(mockConfig, new MockPrompter(), mockDice);

    expect(game.config).toMatchObject(mockConfig);
    expect(MockGameState).toHaveBeenCalledWith(mockConfig, mockDice);
  });

  describe("init", () => {
    beforeEach(() => {
      MockGameState.mockClear();
      MockStatistics.mockClear();
      MockSettings.mockClear();
    });

    test("sets up the stats and settings modules", async () => {
      const game = new Game(mockConfig, new MockPrompter(), mockDice);
      game.init();
      expect(MockStatistics).toHaveBeenCalledOnce();
      const mockstatistics = MockStatistics.mock.instances[0];
      expect(mockstatistics.setup).toHaveBeenCalledOnce();
      expect(MockSettings).toHaveBeenCalledOnce();
      const mockSettings = MockSettings.mock.instances[0];
      expect(mockSettings.setup).toHaveBeenCalledOnce();
      expect(mockSettings.loadSettings).toHaveBeenCalledWith(MockGameState.mock.instances[0]);
    });
  });

  describe("loop", () => {
    const loopSpy = jest.spyOn(Game.prototype, "loop");
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    beforeEach(() => {
      MockGameState.mockClear();
      mockUtil.inspect.mockClear();
      loopSpy.mockClear();
      consoleErrorSpy.mockClear();
      consoleLogSpy.mockClear();
    });

    test("runs screen successfully", async () => {
      const game = new Game(mockConfig, new MockPrompter(), mockDice);
      const mockScreen = new MockMainMenuScreen();
      await game.loop(mockScreen);
      expect(MockGameState.mock.instances[0].addScreenToHistory).toHaveBeenCalledWith(mockScreen.name);
      expect(mockScreen.run).toHaveBeenCalledOnce();
      expect(loopSpy).toHaveBeenCalledOnce();
    });

    test("runs screen successfully and loops if another screen is created", async () => {
      MockMainMenuScreen.prototype.run.mockImplementationOnce(async () => new MockMainMenuScreen());
      const game = new Game(mockConfig, new MockPrompter(), mockDice);
      const mockScreen = new MockMainMenuScreen();
      await game.loop(mockScreen);
      expect(MockGameState.mock.instances[0].addScreenToHistory).toHaveBeenCalledWith(mockScreen.name);
      expect(mockScreen.run).toHaveBeenCalledOnce();
      expect(loopSpy).toHaveBeenCalledTimes(2);
    });

    test("catches screen run error and prints message before exiting", async () => {
      const error = new Error("Something went wrong");
      MockMainMenuScreen.prototype.run.mockImplementationOnce(async () => {
        throw error;
      });
      const game = new Game(mockConfig, new MockPrompter(), mockDice);
      const mockScreen = new MockMainMenuScreen();
      await game.loop(mockScreen);
      expect(MockGameState.mock.instances[0].addScreenToHistory).toHaveBeenCalledWith(mockScreen.name);
      expect(mockScreen.run).toHaveBeenCalledOnce();
      expect(loopSpy).toHaveBeenCalledOnce();
      expect(consoleErrorSpy).toHaveBeenCalledWith("Something went wrong :(");
    });

    test("catches screen run error and prints game state before exiting in debug mode", async () => {
      const config = { ...mockConfig, debug: true };
      const error = new Error("Something went wrong");
      MockMainMenuScreen.prototype.run.mockImplementationOnce(async () => {
        throw error;
      });
      const game = new Game(config, new MockPrompter(), mockDice);
      const mockScreen = new MockMainMenuScreen();
      try {
        await game.loop(mockScreen);
        throw new Error("Should have thrown");
      } catch (err) {
        expect(MockGameState.mock.instances[0].addScreenToHistory).toHaveBeenCalledWith(mockScreen.name);
        expect(mockScreen.run).toHaveBeenCalledOnce();
        expect(loopSpy).toHaveBeenCalledOnce();
        expect(MockGameState.mock.instances[0].toJSON).toHaveBeenCalledOnce();
        expect(util.inspect).toHaveBeenCalledWith(undefined, { showHidden: false, depth: null });
        expect(consoleLogSpy).toHaveBeenCalledWith(undefined);
        expect(err.message).toBe("Something went wrong");
      }
    });
  });
});