import { IConfig } from "../src/types";
import mockConfig from "../src/testUtils/MockConfig";

const testConfig: IConfig = {
  ...mockConfig,
  debug: true,
  dataFolder: "e2eData",
  statsFilename: "stats.json",
  settingsFilename: "settings.json",
};

export default testConfig;
