import { IConfig } from "../types";
import DataLoader from "./DataLoader";

export enum DiceType {
  PIPS = "pips",
}

export interface ISettingsData {
  diceType: DiceType;
}

export const defaultSettingsData: ISettingsData = {
  diceType: DiceType.PIPS,
}

export default class Settings {
  private loader: DataLoader<ISettingsData>;

  constructor(config: IConfig) {
    this.loader = new DataLoader(config.dataFolder, config.settingsFilename, defaultSettingsData);
  }

  setup() {
    this.loader.init();
  }

  saveSettings(newSettings: Partial<ISettingsData>) {
    const settings = this.loader.getData();
    this.loader.setData({ ...settings, ...newSettings });
  }

  getSettings() {
    return this.loader.getData();
  }

  clearSettings() {
    this.loader.setData(defaultSettingsData);
  }
}