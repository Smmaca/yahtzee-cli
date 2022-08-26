import figlet from "figlet";
import { drawTitle, drawTurnStats } from "../draw";

jest.mock("figlet");

const mockFiglet = figlet as jest.Mocked<typeof figlet>;

const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("drawTitle", () => {
  beforeEach(() => {
    log.mockClear();
  });

  test("draws the title", () => {
    mockFiglet.textSync.mockReturnValue("Yahtzee!");

    drawTitle();

    expect(log).toHaveBeenCalledWith("Yahtzee!");
  });
});

describe("drawTurnStats", () => {
  beforeEach(() => {
    log.mockClear();
  });

  test("draws turn stats", () => {
    drawTurnStats("player", 1, 3);

    expect(log).toHaveBeenCalledWith("Player: player     Turn: 2     Rolls left: 3     ");
  });

  test("draws turn stats with yahtzee", () => {
    drawTurnStats("player", 1, 3, true);

    expect(log).toHaveBeenCalledWith("Player: player     Turn: 2     Rolls left: 3     Yahtzee!");
  });
});
