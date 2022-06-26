import mockConfig from "../testUtils/MockConfig";
import Settings, { defaultSettingsData, DiceType } from "./Settings";
import DataLoader from "./DataLoader";

jest.mock("./DataLoader");

const MockDataLoader = DataLoader as jest.MockedClass<typeof DataLoader>;

describe("Settings", () => {
  beforeEach(() => {
    MockDataLoader.mockClear();
  });

  test("it creates a data loader when it instantiates", () => {
    new Settings(mockConfig);
    expect(MockDataLoader).toHaveBeenCalledWith(
      mockConfig.dataFolder,
      mockConfig.statsFilename,
      defaultSettingsData,
    );
  });

  test("it inits the data loader during setup", () => {
    const stats = new Settings(mockConfig);
    stats.setup();
    expect(MockDataLoader.mock.instances[0].init).toHaveBeenCalledTimes(1);
  });

  test("returns settings", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      diceType: DiceType.PIPS,
    }));
    const settingsModule = new Settings(mockConfig);
    const settings = settingsModule.getSettings();
    expect(settings).toEqual({
      diceType: DiceType.PIPS,
    });
  });

  test("saves settings", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      diceType: DiceType.PIPS,
    }));
    const settingsModule = new Settings(mockConfig);
    settingsModule.saveSettings({ diceType: null });
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith({
      diceType: null,
    });
  });

  test("clears settings", () => {
    const settingsModule = new Settings(mockConfig);
    settingsModule.clearSettings();
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith(defaultSettingsData);
  });
});
