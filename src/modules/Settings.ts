import { IConfig } from "../types";
import DataLoader from "./DataLoader";
import GameState from "./GameState";

export enum DiceDesign {
  CLASSIC = "classic",
  DIGITS = "digits",
}

export interface ISettingsData {
  diceDesign: DiceDesign;
}

export const defaultSettingsData: ISettingsData = {
  diceDesign: DiceDesign.CLASSIC,
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

  loadSettings(gameState: GameState) {
    const settings = this.getSettings();
    gameState.diceDesign = settings.diceDesign;
  }
}