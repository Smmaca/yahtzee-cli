import main from "../../src/main";
import { Screen } from "../../src/gameScreens/BaseGameScreen";
import MockPrompter from "../../src/modules/prompters/MockPrompter";
import { MainMenuScreenInput } from "../../src/gameScreens/MainMenuScreen";
import testConfig from "../testConfig";
import { StatisticsScreenInput } from "../../src/gameScreens/StatisticsScreen";
import { NewGameScreenInput } from "../../src/gameScreens/NewGameScreen";

describe("Main menu options", () => {
  test("quit, cancel, then actually quit from main menu", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: false },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("go to statistics", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.STATISTICS },
      { promptName: Screen.STATISTICS, answer: StatisticsScreenInput.BACK },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.STATISTICS,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("go to statistics and clear them", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.STATISTICS },
      { promptName: Screen.STATISTICS, answer: StatisticsScreenInput.CLEAR_STATS },
      { promptName: Screen.STATISTICS, answer: StatisticsScreenInput.BACK },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.STATISTICS,
      Screen.STATISTICS,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("start a new game and then cancel", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.CANCEL },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.NEW_GAME,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });
});
