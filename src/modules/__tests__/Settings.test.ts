import mockConfig from "../../testUtils/MockConfig";
import Settings, { defaultSettingsData } from "../Settings";
import DataLoader from "../DataLoader";
import { DiceDesign } from "../../utils/diceDesigns";

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
      diceDesign: DiceDesign.CLASSIC,
    }));
    const settingsModule = new Settings(mockConfig);
    const settings = settingsModule.getSettings();
    expect(settings).toEqual({
      diceDesign: DiceDesign.CLASSIC,
    });
  });

  test("saves settings", () => {
    MockDataLoader.prototype.getData.mockImplementation(() => ({
      diceDesign: DiceDesign.CLASSIC,
    }));
    const settingsModule = new Settings(mockConfig);
    settingsModule.saveSettings({ diceDesign: null });
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith({
      diceDesign: null,
    });
  });

  test("clears settings", () => {
    const settingsModule = new Settings(mockConfig);
    settingsModule.clearSettings();
    expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith(defaultSettingsData);
  });
});
