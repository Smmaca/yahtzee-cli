import path from "path";
import {
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from "fs";

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
  // If they do, merges data data into default data to make sure all properties exist
  init() {
    if (!existsSync(this.getFolderPath())) {
      mkdirSync(this.getFolderPath());
    }

    if (!existsSync(this.getFilePath())) {
      openSync(this.getFilePath(), "a");
    }

    const contents = this.getData();
    const mergedData = { ...this.defaultData, ...contents };
    this.setData(mergedData);
  }

  getFolderPath() {
    return path.join(__dirname, "..", "..", this.dataFolder);
  }

  getFilePath() {
    return path.join(this.getFolderPath(), this.fileName)
  }

  // Reads data from file
  getData(): T {
    try {
      const data = readFileSync(this.getFilePath(), "utf8");
      return data ? JSON.parse(data) : {};
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