import config from "../config";
import { IConfig } from "../types";

const mockConfig: IConfig = {
  ...config,
  debug: false,
  dataFolder: "",
  statsFilename: "",
  settingsFilename: "",
  achievementsFilename: "",
};

export default mockConfig as jest.Mocked<typeof mockConfig>;
