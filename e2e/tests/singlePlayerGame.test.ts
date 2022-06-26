import { Screen } from "../../src/gameScreens/BaseGameScreen";
import { GameActionScreenInput } from "../../src/gameScreens/GameActionScreen";
import { MainMenuScreenInput } from "../../src/gameScreens/MainMenuScreen";
import { NewGameScreenInput } from "../../src/gameScreens/NewGameScreen";
import { ScoreDiceScreenInput } from "../../src/gameScreens/ScoreDiceScreen";
import main from "../../src/main";
import MockPrompter from "../../src/modules/prompters/MockPrompter";
import testConfig from "../testConfig";

describe("Single player game", () => {
  test("start a single player game, and then quit, cancel, then actually quit", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.SINGLEPLAYER },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: false },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.NEW_GAME,
      Screen.GAME_ACTION,
      Screen.QUIT_CONFIRM,
      Screen.GAME_ACTION,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("roll dice once, go to score dice, then cancel", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.SINGLEPLAYER },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_DICE },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.SCORE_DICE },
      { promptName: Screen.SCORE_DICE, answer: ScoreDiceScreenInput.CANCEL },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.NEW_GAME,
      Screen.GAME_ACTION,
      Screen.GAME_ACTION,
      Screen.SCORE_DICE,
      Screen.GAME_ACTION,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("roll dice twice, go to score dice, then cancel", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.SINGLEPLAYER },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_DICE },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_AGAIN },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.SCORE_DICE },
      { promptName: Screen.SCORE_DICE, answer: ScoreDiceScreenInput.CANCEL },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.QUIT },
      { promptName: Screen.QUIT_CONFIRM, answer: true },
    ]);

    const endGameState = await main(testConfig, prompter);

    expect(endGameState.screenHistory).toEqual([
      Screen.MAIN_MENU,
      Screen.NEW_GAME,
      Screen.GAME_ACTION,
      Screen.GAME_ACTION,
      Screen.GAME_ACTION,
      Screen.SCORE_DICE,
      Screen.GAME_ACTION,
      Screen.QUIT_CONFIRM,
    ]);
  });

  test("roll dice three times, go to score dice and not be able to cancel", async () => {
    const prompter = new MockPrompter([
      { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
      { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.SINGLEPLAYER },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_DICE },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_AGAIN },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_AGAIN },
      { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.SCORE_DICE },
      { promptName: Screen.SCORE_DICE, answer: ScoreDiceScreenInput.CANCEL },
    ]);

    try {
      await main(testConfig, prompter);
      throw new Error("Expected to throw an error");
    } catch (err) {
      expect(err.message).toEqual(
        "Expected one of [ones, twos, threes, fours, fives, sixes, threeOfAKind, fourOfAKind, fullHouse, smallStraight, largeStraight, yahtzee, chance, yahtzeeBonus], got cancel"
      );
    };
  });

  // test("play a single player game", async () => {
  //   const prompter = new MockPrompter([
  //     { promptName: Screen.MAIN_MENU, answer: MainMenuScreenInput.NEW_GAME },
  //     { promptName: Screen.NEW_GAME, answer: NewGameScreenInput.SINGLEPLAYER },
  //     { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.ROLL_DICE },
  //     { promptName: Screen.GAME_ACTION, answer: GameActionScreenInput.SCORE_DICE },
  //     { promptName: Screen.SCORE_DICE, answer: ScoreDiceScreenInput. },
  //   ]);

  //   const endGameState = await main(testConfig, prompter);

  //   expect(endGameState.screenHistory).toEqual([
  //     Screen.MAIN_MENU,
  //     Screen.NEW_GAME,
  //     Screen.GAME_ACTION,
  //   ]);
  // });
});
