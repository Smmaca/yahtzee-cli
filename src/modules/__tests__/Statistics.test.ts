import mockConfig from "../../testUtils/MockConfig";
import Statistics, { defaultStatsData } from "../Statistics";
import DataLoader from "../DataLoader";

jest.mock("../DataLoader");

const MockDataLoader = DataLoader as jest.MockedClass<typeof DataLoader>;

describe("Statistics", () => {
  const DateSpy = jest.spyOn(Date, "now");

  beforeAll(() => {
    DateSpy.mockClear().mockImplementation(() => 123456789);
  });

  beforeEach(() => {
    MockDataLoader.mockClear();
  });

  afterAll(() => {
    DateSpy.mockRestore();
  });

  test("it creates a data loader when it instantiates", () => {
    new Statistics(mockConfig);
    expect(MockDataLoader).toHaveBeenCalledWith(
      mockConfig.dataFolder,
      mockConfig.statsFilename,
      defaultStatsData,
    );
  });

  test("it inits the data loader during setup", () => {
    const stats = new Statistics(mockConfig);
    stats.setup();
    expect(MockDataLoader.mock.instances[0].init).toHaveBeenCalledTimes(1);
  });

  test("returns calculated game stats", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      scores: [
        { score: 30, timestamp: "" },
        { score: 40, timestamp: "" },
        { score: 50, timestamp: "" },
      ],
    }));
    const stats = new Statistics(mockConfig);
    const gameStats = stats.getGameStatistics();
    expect(gameStats).toEqual({
      gamesPlayed: 3,
      highScore: 50,
      lowScore: 30,
      averageScore: 40,
    });
  });

  test("returns calculated game stats when there are no saved scores", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      scores: [],
    }));
    const stats = new Statistics(mockConfig);
    const gameStats = stats.getGameStatistics();
    expect(gameStats).toEqual({
      gamesPlayed: 0,
      highScore: 0,
      lowScore: 0,
      averageScore: 0,
    });
  });

  test("saves game stats", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      scores: [
        { score: 30, timestamp: "" },
        { score: 40, timestamp: "" },
        { score: 50, timestamp: "" },
      ],
    }));
    const stats = new Statistics(mockConfig);
    stats.saveGameStatistics({ score: 30 });
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith({
      scores: [
        { score: 30, timestamp: "" },
        { score: 40, timestamp: "" },
        { score: 50, timestamp: "" },
        { score: 30, timestamp: 123456789 },
      ],
    });
  });

  test("clears game stats", () => {
    const stats = new Statistics(mockConfig);
    stats.clearGameStatistics();
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith(defaultStatsData);
  });
});
