import figlet from "figlet";
import { drawDiceValues, drawTitle, drawTurnStats } from "./draw";

jest.mock("figlet");

const mockFiglet = figlet as jest.Mocked<typeof figlet>;

const log = jest.spyOn(console, "log").mockImplementation(() => {});

describe("drawTitle", () => {
  beforeEach(() => {
    log.mockClear();
  });

  test("draws the title", () => {
    mockFiglet.textSync.mockReturnValue("Yahtzee");

    drawTitle();

    expect(log).toHaveBeenCalledWith("Yahtzee");
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

describe("drawDiceValues", () => {
  beforeEach(() => {
    log.mockClear();
  });

  test("draws newline if there are no dice values", () => {
    drawDiceValues([], []);

    expect(log).toHaveBeenCalledWith("\n");
  });

  test("draws newline if dice values are all 0", () => {
    drawDiceValues([0, 0, 0, 0, 0], [false, false, false, false, false]);

    expect(log).toHaveBeenCalledWith("\n");
  });

  test("draws a dice roll of 1", () => {
    drawDiceValues([1], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n|      | \n|   0  | \n|______| \n\n         \n");
  });
  
  test("draws a dice roll of 2", () => {
    drawDiceValues([2], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n|    0 | \n|      | \n|_0____| \n\n         \n");
  });

  test("draws a dice roll of 3", () => {
    drawDiceValues([3], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n|    0 | \n|   0  | \n|_0____| \n\n         \n");
  });

  test("draws a dice roll of 4", () => {
    drawDiceValues([4], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n|      | \n|_0__0_| \n\n         \n");
  });

  test("draws a dice roll of 5", () => {
    drawDiceValues([5], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n|   0  | \n|_0__0_| \n\n         \n");
  });

  test("draws a dice roll of 6", () => {
    drawDiceValues([6], [false]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n| 0  0 | \n|_0__0_| \n\n         \n");
  });

  test("draws a dice roll of 1 with lock", () => {
    drawDiceValues([1], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n|      | \n|   0  | \n|______| \n\n    L    \n");
  });

  test("draws a dice roll of 2 with lock", () => {
    drawDiceValues([2], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n|    0 | \n|      | \n|_0____| \n\n    L    \n");
  });

  test("draws a dice roll of 3 with lock", () => {
    drawDiceValues([3], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n|    0 | \n|   0  | \n|_0____| \n\n    L    \n");
  });

  test("draws a dice roll of 4 with lock", () => {
    drawDiceValues([4], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n|      | \n|_0__0_| \n\n    L    \n");
  });

  test("draws a dice roll of 5 with lock", () => {
    drawDiceValues([5], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n|   0  | \n|_0__0_| \n\n    L    \n");
  });

  test("draws a dice roll of 6 with lock", () => {
    drawDiceValues([6], [true]);

    expect(log).toHaveBeenCalledWith(" ______  \n| 0  0 | \n| 0  0 | \n|_0__0_| \n\n    L    \n");
  });

  test("draws multiple dice", () => {
    drawDiceValues([1, 2, 3, 4, 5], [false, false, false, false, false]);

    expect(log).toHaveBeenCalledWith(" ______   ______   ______   ______   ______  \n|      | |    0 | |    0 | | 0  0 | | 0  0 | \n|   0  | |      | |   0  | |      | |   0  | \n|______| |_0____| |_0____| |_0__0_| |_0__0_| \n\n                                             \n");
  });

  test("draws multiple dice with locks", () => {
    drawDiceValues([1, 2, 3, 4, 5], [false, true, true, false, true]);

    expect(log).toHaveBeenCalledWith(" ______   ______   ______   ______   ______  \n|      | |    0 | |    0 | | 0  0 | | 0  0 | \n|   0  | |      | |   0  | |      | |   0  | \n|______| |_0____| |_0____| |_0__0_| |_0__0_| \n\n             L        L                 L    \n");
  });

  test("skips zeroes when drawing multiple dice", () => {
    drawDiceValues([1, 2, 0, 4, 5], [false, false, false, false, false]);

    expect(log).toHaveBeenCalledWith(" ______   ______   ______   ______  \n|      | |    0 | | 0  0 | | 0  0 | \n|   0  | |      | |      | |   0  | \n|______| |_0____| |_0__0_| |_0__0_| \n\n                                    \n");
  });

  test("skips zeroes when drawing multiple dice with locks", () => {
    drawDiceValues([1, 2, 0, 4, 5], [true, false, false, true, true]);

    expect(log).toHaveBeenCalledWith(" ______   ______   ______   ______  \n|      | |    0 | | 0  0 | | 0  0 | \n|   0  | |      | |      | |   0  | \n|______| |_0____| |_0__0_| |_0__0_| \n\n    L                 L        L    \n");
  });
});
