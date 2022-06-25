import clear from "clear";
import MockPrompter from "../prompters/MockPrompter";
import mockConfig from "../testUtils/MockConfig";
import mockGameState from "../testUtils/MockGameState";
import { Screen } from "./BaseGameScreen";
import * as drawUtils from "../utils/draw";
import { constructChoice } from "../utils/screen";
import StatisticsScreen, { choiceLabels, StatisticsScreenInput } from "./StatisticsScreen";
import MainMenuScreen from "./MainMenuScreen";
import Statistics from "../modules/Statistics";

jest.mock("clear");
jest.mock("../utils/draw");
jest.mock("../modules/Statistics");
jest.mock("./MainMenuScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockStatistics = Statistics as jest.MockedClass<typeof Statistics>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("StatisticsScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new StatisticsScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(StatisticsScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(StatisticsScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(StatisticsScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(StatisticsScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => StatisticsScreenInput.BACK);
      handleInputSpy.mockClear().mockImplementation(() => new StatisticsScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const addPlayerScreen = new StatisticsScreen();
      await addPlayerScreen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(StatisticsScreenInput.BACK, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    const consoleLogSpy = jest.spyOn(console, "log");

    beforeEach(() => {
      MockStatistics.mockClear();
      consoleLogSpy.mockClear().mockImplementation(() => {});
    });

    afterEach(() => {
      consoleLogSpy.mockRestore();
    });

    test("draws stats", () => {
      MockStatistics.prototype.getGameStatistics.mockImplementation(() => ({
        gamesPlayed: 45,
        highScore: 400,
        lowScore: 5,
        averageScore: 200,
      }));
      const screen = new StatisticsScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockStatistics).toHaveBeenCalledTimes(1);
      expect(MockStatistics.mock.instances[0].getGameStatistics).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, "Single player game statistics:\n");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, "Games played: 45");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, "High score: 400");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(4, "Low score: 5");
      expect(consoleLogSpy).toHaveBeenNthCalledWith(5, "Average score: 200\n");
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new StatisticsScreen();
      const choices = screen.getChoices();

      expect(choices).toEqual([
        constructChoice(StatisticsScreenInput.BACK, choiceLabels),
        constructChoice(StatisticsScreenInput.CLEAR_STATS, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(StatisticsScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(StatisticsScreenInput.BACK, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new StatisticsScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.STATISTICS,
        answer: StatisticsScreenInput.BACK,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(StatisticsScreenInput.BACK);
      expect(getChoicesSpy).toHaveBeenCalledWith();
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockMainMenuScreen.mockClear();
      MockStatistics.mockClear();
    });

    test("handles selecting option: Back", () => {
      const screen = new StatisticsScreen();
      const nextScreen = screen.handleInput(StatisticsScreenInput.BACK, mockGameState, mockConfig);
      expect(MockMainMenuScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockMainMenuScreen.mock.instances[0]);
    });

    test("handles selecting option: Clear stats", () => {
      const screen = new StatisticsScreen();
      const nextScreen = screen.handleInput(StatisticsScreenInput.CLEAR_STATS, mockGameState, mockConfig);
      expect(MockStatistics).toHaveBeenCalledTimes(1);
      expect(MockStatistics.mock.instances[0].clearGameStatistics).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(screen);
    });

    test("handles no selected option", () => {
      const screen = new StatisticsScreen();
      const nextScreen = screen.handleInput(undefined, mockGameState, mockConfig);
      expect(nextScreen).toBe(screen);
    });
  });
});
