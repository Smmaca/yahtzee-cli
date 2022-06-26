import { IConfig } from "../src/types";
import mockConfig from "../src/testUtils/MockConfig";

const config: IConfig = {
  ...mockConfig,
  debug: true,
  dataFolder: "e2eData",
  statsFilename: "stats.json",
};

export default config;
