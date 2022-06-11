import fs from "fs";
import DataLoader from "./DataLoader";

jest.mock("fs");

const MockFs = fs as jest.Mocked<typeof fs>;

describe("DataLoader", () => {
  beforeEach(() => {
    MockFs.existsSync.mockClear();
    MockFs.mkdirSync.mockClear();
    MockFs.readFileSync.mockClear();
    MockFs.writeFileSync.mockClear();
    MockFs.openSync.mockClear();
  });

  test("instantiates with folder, file path and default data", () => {
    const dataLoader = new DataLoader("data", "stats.json", {
      gamesPlayed: 0,
    });

    expect(dataLoader.dataFolder).toBe("data");
    expect(dataLoader.fileName).toBe("stats.json");
    expect(dataLoader.defaultData).toEqual({
      gamesPlayed: 0,
    });
  });

  test("gets the folder path", () => {
    const dataLoader = new DataLoader("data", "stats.json", {
      gamesPlayed: 0,
    });

    expect(dataLoader.getFolderPath()).toBe(
      "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
    );
  });

  test("gets the file path", () => {
    const dataLoader = new DataLoader("data", "stats.json", {
      gamesPlayed: 0,
    });

    expect(dataLoader.getFilePath()).toBe(
      "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
    );
  });

  describe("init", () => {
    const setDataSpy = jest.spyOn(DataLoader.prototype, "setData");
    const getDataSpy = jest.spyOn(DataLoader.prototype, "getData");

    beforeEach(() => {
      setDataSpy.mockClear().mockImplementation(() => {});
      getDataSpy.mockClear().mockImplementation(() => ({}));
    });

    afterAll(() => {
      setDataSpy.mockRestore();
      getDataSpy.mockRestore();
    });

    test("creates the folder and file with default data if the folder doesn't exist and merges with default data", () => {
      MockFs.mkdirSync.mockImplementation(() => "");
      MockFs.existsSync.mockImplementation(() => false);

      const dataLoader = new DataLoader("data", "stats.json", {
        gamesPlayed: 0,
      });

      dataLoader.init();

      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        1,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
      );
      expect(MockFs.mkdirSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
      );
      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        2,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
      );
      expect(MockFs.openSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        "r",
      );
      expect(getDataSpy).toHaveBeenCalledTimes(1);
      expect(setDataSpy).toHaveBeenCalledWith({ gamesPlayed: 0 });
    });

    test("creates the file with default data if the folder exists but the file doesn't and merges with default data", () => {
      MockFs.mkdirSync.mockImplementation(() => "");
      MockFs.existsSync
        .mockImplementationOnce(() => true)
        .mockImplementationOnce(() => false);

      const dataLoader = new DataLoader("data", "stats.json", {
        gamesPlayed: 0,
      });

      dataLoader.init();

      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        1,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
      );
      expect(MockFs.mkdirSync).not.toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
      );
      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        2,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
      );
      expect(MockFs.openSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        "r",
      );
      expect(getDataSpy).toHaveBeenCalledTimes(1);
      expect(setDataSpy).toHaveBeenCalledWith({ gamesPlayed: 0 });
    });

    test("does nothing if the file and folder already exist and merges with default data", () => {
      MockFs.mkdirSync.mockImplementation(() => "");
      MockFs.existsSync.mockImplementation(() => true);

      const dataLoader = new DataLoader("data", "stats.json", {
        gamesPlayed: 0,
      });

      dataLoader.init();

      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        1,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data",
      );
      expect(MockFs.mkdirSync).not.toHaveBeenCalled();
      expect(MockFs.existsSync).toHaveBeenNthCalledWith(
        2,
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
      );
      expect(MockFs.openSync).not.toHaveBeenCalled();
      expect(getDataSpy).toHaveBeenCalledTimes(1);
      expect(setDataSpy).toHaveBeenCalledWith({ gamesPlayed: 0 });
    });
  });

  describe("getData", () => {
    let getFilePathSpy;
    let consoleErrorSpy;
  
    beforeEach(() => {
      getFilePathSpy = jest.spyOn(DataLoader.prototype, "getFilePath");
      consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      getFilePathSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test("returns data from file", () => {
      MockFs.readFileSync.mockImplementation(() => "{}");

      const dataLoader = new DataLoader("data", "stats.json", { gamesPlayed: 0 });

      const data = dataLoader.getData();

      expect(getFilePathSpy).toHaveBeenCalledTimes(1);
      expect(MockFs.readFileSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        "utf8",
      );
      expect(data).toEqual({});
    });

    test("returns empty object if file is empty", () => {
      MockFs.readFileSync.mockImplementation(() => "");

      const dataLoader = new DataLoader("data", "stats.json", { gamesPlayed: 0 });

      const data = dataLoader.getData();

      expect(getFilePathSpy).toHaveBeenCalledTimes(1);
      expect(MockFs.readFileSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        "utf8",
      );
      expect(data).toEqual({});
    });

    test("throws error if readFile fails", () => {
      MockFs.readFileSync.mockImplementation(() => {
        throw new Error("readFile failed");
      });

      const dataLoader = new DataLoader("data", "stats.json", { gamesPlayed: 0 });

      try {
        dataLoader.getData();
        throw new Error("should not get here");
      } catch (err) {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Couldn't get data from file: /Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        );
        expect(err.message).toBe("readFile failed");
      }
    });
  });

  describe("setData", () => {
    let getFilePathSpy;
    let consoleErrorSpy;
  
    beforeEach(() => {
      getFilePathSpy = jest.spyOn(DataLoader.prototype, "getFilePath");
      consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      getFilePathSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    test("writes data to file", () => {
      MockFs.writeFileSync.mockImplementation(() => {});

      const dataLoader = new DataLoader("data", "stats.json", { gamesPlayed: 0 });

      dataLoader.setData({ gamesPlayed: 4 });

      expect(getFilePathSpy).toHaveBeenCalledTimes(1);
      expect(MockFs.writeFileSync).toHaveBeenCalledWith(
        "/Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        '{"gamesPlayed":4}',
        "utf8",
      );
    });

    test("throws error if writeFile fails", () => {
      MockFs.writeFileSync.mockImplementation(() => {
        throw new Error("writeFile failed");
      });

      const dataLoader = new DataLoader("data", "stats.json", { gamesPlayed: 0 });

      try {
        dataLoader.setData({ gamesPlayed: 4 });
        throw new Error("should not get here");
      } catch (err) {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Couldn't set data to file: /Users/shavaunmacarthur/Documents/repositories/yahtzee-cli/data/stats.json",
        );
        expect(err.message).toBe("writeFile failed");
      }
    });
  });
});