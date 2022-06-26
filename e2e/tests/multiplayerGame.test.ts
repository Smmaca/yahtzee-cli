import { Screen } from "../../src/gameScreens/BaseGameScreen";
import { MainMenuScreenInput } from "../../src/gameScreens/MainMenuScreen";
import { NewGameScreenInput } from "../../src/gameScreens/NewGameScreen";
import { NewMultiplayerGameScreenInput } from "../../src/gameScreens/NewMultiplayerGameScreen";
import main from "../../src/main";
import MockPrompter from "../../src/modules/prompters/MockPrompter";
import testConfig from "../testConfig";

describe("Multiplayer game", () => {
  test("can start a new game, choose multiplayer, and then cancel", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.MULTIPLAYER },
      { promptName: Screen.NEW_MULTIPLAYER_GAME, answer: NewMultiplayerGameScreenInput.CANCEL },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.CANCEL },
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.NEW_GAME,
      Screen.NEW_MULTIPLAYER_GAME,
      Screen.NEW_GAME,
      Screen.MAIN_MENU,
      Screen.QUIT_CONFIRM,
    ]);
  });
});
