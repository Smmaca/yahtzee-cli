import figlet from "figlet";
import { drawTitle, drawTurnStats } from "../draw";

jest.mock("figlet");

const mockFiglet = figlet as jest.Mocked<typeof figlet>;

describe("drawTitle", () => {
  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    logSpy.mockClear();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  test("draws the title", () => {
    mockFiglet.textSync.mockReturnValue("Yahtzee!");

    drawTitle();

    expect(logSpy).toHaveBeenCalledWith("Yahtzee!");
  });
});

describe("drawTurnStats", () => {
  let logSpy: jest.SpiedFunction<typeof console.log>;

  beforeAll(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  beforeEach(() => {
    logSpy.mockClear();
  });

  afterAll(() => {
    logSpy.mockRestore();
  });

  test("draws turn stats", () => {
    drawTurnStats("player", 1, 3);

    expect(logSpy).toHaveBeenCalledWith("Player: player     Turn: 2     Rolls left: 3     ");
  });

  test("draws turn stats with yahtzee", () => {
    drawTurnStats("player", 1, 3, true);

    expect(logSpy).toHaveBeenCalledWith("Player: player     Turn: 2     Rolls left: 3     Yahtzee!");
  });
});
