import main from "../../src/main";
import { Screen } from "../../src/gameScreens/BaseGameScreen";
import MockPrompter from "../../src/prompters/MockPrompter";
import { MainMenuScreenInput } from "../../src/gameScreens/MainMenuScreen";
import testConfig from "../testConfig";

describe("Quit game", () => {
  test("", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: false },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    console.log(endGameState);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });
});
