import path from "path";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

export interface StatsData {
  gamesPlayed: number;
}

export default class DataLoader<T> {
  dataFolder: string;
  fileName: string;
  defaultData: T;

  constructor(dataFolder: string, fileName: string, defaultData: T) {
    this.dataFolder = dataFolder;
    this.fileName = fileName;
    this.defaultData = defaultData;
  }

  // Checks the folder and file exists. If not, creates them.
  init() {
    if (!existsSync(this.getFolderPath())) {
      mkdirSync(this.getFolderPath());
    }

    if (!existsSync(this.getFilePath())) {
      this.setData(this.defaultData);
    }
  }

  getFolderPath() {
    return path.join(__dirname, "..", this.dataFolder);
  }

  getFilePath() {
    return path.join(this.getFolderPath(), this.fileName)
  }

  // Reads data from file
  getData(): T {
    try {
      const data = readFileSync(this.getFilePath(), "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Couldn't get data from file: " + this.getFilePath());
      throw err;
    }
  }

  // Writes data to file
  setData(data: T) {
    try {
      writeFileSync(this.getFilePath(), JSON.stringify(data), "utf8");
    } catch (err) {
      console.error("Couldn't set data to file: " + this.getFilePath());
      throw err;
    }
  }
}