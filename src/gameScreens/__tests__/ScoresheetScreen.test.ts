import clear from "clear";
import MockPrompter from "../../modules/prompters/MockPrompter";
import mockConfig from "../../testUtils/MockConfig";
import mockGameState from "../../testUtils/MockGameState";
import * as drawUtils from "../../utils/draw";
import { constructChoice } from "../../utils/screen";
import ScoresheetScreen, { choiceLabels, ScoresheetScreenInput } from "../ScoresheetScreen";
import GameActionScreen from "../GameActionScreen";
import DiceScorer from "../../modules/DiceScorer";
import mockPlayer from "../../testUtils/MockPlayer";
import { Screen } from "../../types";
import DiceDrawer from "../../modules/DiceDrawer";

jest.mock("clear");
jest.mock("../../utils/draw");
jest.mock("../../modules/DiceScorer");
jest.mock("../../modules/DiceDrawer");
jest.mock("../GameActionScreen");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockDiceDrawer = DiceDrawer as jest.MockedClass<typeof DiceDrawer>;
const MockGameActionScreen = GameActionScreen as jest.MockedClass<typeof GameActionScreen>;

describe("ScoresheetScreen", () => {
  describe("drawScreenStart", () => {
    beforeEach(() => {
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    test("clears the screen and draws the title", () => {
      const screen = new ScoresheetScreen();
      screen.drawScreenStart();
      expect(mockClear).toHaveBeenCalledTimes(1);
      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });
  });

  describe("run", () => {
    const drawScreenStartSpy = jest.spyOn(ScoresheetScreen.prototype, "drawScreenStart");
    const drawSpy = jest.spyOn(ScoresheetScreen.prototype, "draw");
    const getInputSpy = jest.spyOn(ScoresheetScreen.prototype, "getInput");
    const handleInputSpy = jest.spyOn(ScoresheetScreen.prototype, "handleInput");

    beforeAll(() => {
      drawScreenStartSpy.mockClear().mockImplementation(() => {});
      drawSpy.mockClear().mockImplementation(() => {});
      getInputSpy.mockClear().mockImplementation(async () => ScoresheetScreenInput.CONTINUE);
      handleInputSpy.mockClear().mockImplementation(() => new ScoresheetScreen());
    });

    afterAll(() => {
      drawScreenStartSpy.mockRestore();
      drawSpy.mockRestore();
      getInputSpy.mockRestore();
      handleInputSpy.mockRestore();
    });

    test("runs correctly", async () => {
      const mockPrompter = new MockPrompter();

      const screen = new ScoresheetScreen();
      await screen.run({
        config: mockConfig,
        prompter: mockPrompter,
        state: mockGameState,
      });

      expect(drawScreenStartSpy).toHaveBeenCalledWith();
      expect(drawSpy).toHaveBeenCalledWith(mockGameState, mockConfig);
      expect(getInputSpy).toHaveBeenCalledWith(mockPrompter, mockGameState, mockConfig);
      expect(handleInputSpy).toHaveBeenCalledWith(ScoresheetScreenInput.CONTINUE, mockGameState, mockConfig);
    });
  });

  describe("draw", () => {
    beforeEach(() => {
      MockDiceScorer.mockClear();
      MockDiceDrawer.mockClear();
      mockDrawUtils.drawTurnStats.mockClear();
      mockGameState.getCurrentPlayer.mockClear();
    });

    test("draws turn stats, dice and player scoresheet", () => {
      mockGameState.getCurrentPlayer.mockImplementation(() => mockPlayer);
      const screen = new ScoresheetScreen();
      screen.draw(mockGameState, mockConfig);
      expect(MockDiceScorer).toHaveBeenCalledWith(mockGameState.dice.values, mockConfig);
      expect(MockDiceDrawer).toHaveBeenCalledWith(mockGameState.diceDesign, mockGameState.dice.values, mockGameState.dice.lock);
      expect(drawUtils.drawTurnStats).toHaveBeenCalledTimes(1);
      expect(MockDiceDrawer.mock.instances[0].renderDice).toHaveBeenCalledTimes(1);
      expect(mockGameState.getCurrentPlayer).toHaveBeenCalledTimes(1);
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
    });
  });

  describe("getChoices", () => {
    test("gives the correct options", () => {
      const screen = new ScoresheetScreen();
      const choices = screen.getChoices();

      expect(choices).toEqual([
        constructChoice(ScoresheetScreenInput.CONTINUE, choiceLabels),
      ]);
    });
  });

  describe("getInput", () => {
    const getChoicesSpy = jest.spyOn(ScoresheetScreen.prototype, "getChoices");

    beforeAll(() => {
      getChoicesSpy.mockClear().mockImplementation(() => [
        constructChoice(ScoresheetScreenInput.CONTINUE, choiceLabels),
      ]);
    });

    afterAll(() => {
      getChoicesSpy.mockRestore();
    });

    test("gets select input from player", async () => {
      const screen = new ScoresheetScreen();
      const mockPrompter = new MockPrompter([{
        promptName: Screen.SCORESHEET,
        answer: ScoresheetScreenInput.CONTINUE,
      }]);
      const input = await screen.getInput(mockPrompter, mockGameState, mockConfig);
      expect(input).toBe(ScoresheetScreenInput.CONTINUE);
      expect(getChoicesSpy).toHaveBeenCalledWith();
    });
  });

  describe("handleInput", () => {
    beforeEach(() => {
      MockGameActionScreen.mockClear();
    });

    test("handles selecting option: Continue", () => {
      const screen = new ScoresheetScreen();
      const nextScreen = screen.handleInput(ScoresheetScreenInput.CONTINUE);
      expect(MockGameActionScreen).toHaveBeenCalledTimes(1);
      expect(nextScreen).toBe(MockGameActionScreen.mock.instances[0]);
    });

    test("handles no selected option", () => {
      const screen = new ScoresheetScreen();
      const nextScreen = screen.handleInput(undefined);
      expect(nextScreen).toBe(screen);
    });
  });
});
