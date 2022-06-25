import clear from "clear";
import config from "../config";
import Game from "./Game";
import GameState from "./GameState";
import Player from "./Player";
import { GameMode, RollModeChoice, YahtzeeScoreCategory } from "../types";
import * as drawUtils from "../utils/draw";
import MockPrompter from "../prompters/MockPrompter";
import DiceScorer from "./DiceScorer";
import Dice from "./Dice";
import DataLoader from "./DataLoader";

jest.mock("./GameState");
jest.mock("./DataLoader");
jest.mock("./Player");
jest.mock("./Dice");
jest.mock("./DiceScorer");
jest.mock("clear");
jest.mock("../utils/draw");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const MockGameState = GameState as jest.MockedClass<typeof GameState>;
const MockPlayer = Player as jest.MockedClass<typeof Player>;
const MockDiceScorer = DiceScorer as jest.MockedClass<typeof DiceScorer>;
const MockDice = Dice as jest.MockedClass<typeof Dice>;
const MockDataLoader = DataLoader as jest.MockedClass<typeof DataLoader>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;

const fakeConfig = {
  ...config,
  rollsPerTurn: 3,
};

const mockPlayerData = {
  name: "",
  totalScore: 0,
  score: null,
  setScore: jest.fn(),
  resetScore: jest.fn(),
  renderScoresheet: jest.fn(),
  toJSON: jest.fn(),
};

describe("Game", () => {
  test("saves the config and creates a new game state on instantiation", () => {
    const game = new Game(fakeConfig, new MockPrompter());

    expect(game.config).toMatchObject(fakeConfig);
    expect(MockGameState).toHaveBeenCalledWith(fakeConfig);
    expect(MockDataLoader).toHaveBeenCalledWith("data", "stats.json", {
      scores: [],
    });
  });

  describe("init", () => {
    beforeEach(() => {
      MockGameState.mockClear();
      MockDataLoader.mockClear();
    });

    test("inits the stats data loader", async () => {
      const game = new Game(fakeConfig, new MockPrompter());
      game.init();
      const mockDataLoader = MockDataLoader.mock.instances[0];
      expect(mockDataLoader.init).toHaveBeenCalledTimes(1);
    });
  });

  describe("loop", () => {
    let handleMainMenuSpy = jest.spyOn(Game.prototype, "handleMainMenu");
    let handleNewGameSpy = jest.spyOn(Game.prototype, "handleNewGame");
    let handleNewMultiplayerGameSpy = jest.spyOn(Game.prototype, "handleNewMultiplayerGame");
    let handleAddPlayerSpy = jest.spyOn(Game.prototype, "handleAddPlayer");
    let handleRollModeSpy = jest.spyOn(Game.prototype, "handleRollMode");
    let handleDiceLockModeSpy = jest.spyOn(Game.prototype, "handleDiceLockMode");
    let handleScoresheetModeSpy = jest.spyOn(Game.prototype, "handleScoresheetMode");
    let handleScoreDiceModeSpy = jest.spyOn(Game.prototype, "handleScoreDiceMode");
    let handleScoreJokerModeSpy = jest.spyOn(Game.prototype, "handleScoreJokerMode");
    let handleGameOverSpy = jest.spyOn(Game.prototype, "handleGameOver");
    let handleQuitToMainMenuConfirmSpy = jest.spyOn(Game.prototype, "handleQuitToMainMenuConfirm");
    let handleQuitConfirmSpy = jest.spyOn(Game.prototype, "handleQuitConfirm");

    beforeEach(() => {
      handleMainMenuSpy.mockClear().mockImplementation(async () => false);
      handleNewGameSpy.mockClear().mockImplementation(async () => false);
      handleNewMultiplayerGameSpy.mockClear().mockImplementation(async () => false);
      handleAddPlayerSpy.mockClear().mockImplementation(async () => false);
      handleRollModeSpy.mockClear().mockImplementation(async () => false);
      handleDiceLockModeSpy.mockClear().mockImplementation(async () => false);
      handleScoresheetModeSpy.mockClear().mockImplementation(async () => false);
      handleScoreDiceModeSpy.mockClear().mockImplementation(async () => false);
      handleScoreJokerModeSpy.mockClear().mockImplementation(async () => false);
      handleGameOverSpy.mockClear().mockImplementation(async () => false);
      handleQuitToMainMenuConfirmSpy.mockClear().mockImplementation(async () => false);
      handleQuitConfirmSpy.mockClear().mockImplementation(async () => false);
      MockGameState.mockClear();
      mockClear.mockClear();
      mockDrawUtils.drawTitle.mockClear();
    });

    afterAll(() => {
      handleMainMenuSpy.mockRestore();
      handleNewGameSpy.mockRestore();
      handleNewMultiplayerGameSpy.mockRestore();
      handleAddPlayerSpy.mockRestore();
      handleRollModeSpy.mockRestore();
      handleDiceLockModeSpy.mockRestore();
      handleScoresheetModeSpy.mockRestore();
      handleScoreDiceModeSpy.mockRestore();
      handleScoreJokerModeSpy.mockRestore();
      handleGameOverSpy.mockRestore();
      handleQuitToMainMenuConfirmSpy.mockRestore();
      handleQuitConfirmSpy.mockRestore();
    });
    
    test("clears the screen", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    test("draws the title", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });

    test("calls the main menu handler in main menu mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(handleMainMenuSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the new game handler in new game mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.NEW_GAME;

      game.loop();

      expect(handleNewGameSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the new multiplayer game handler in new multiplayer game mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.NEW_MULTIPLAYER_GAME;

      game.loop();

      expect(handleNewMultiplayerGameSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the add player handler in add player mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.ADD_PLAYER;

      game.loop();

      expect(handleAddPlayerSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the roll mode handler in roll mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.ROLL;

      game.loop();

      expect(handleRollModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the dice lock mode handler in dice locker mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.DICE_LOCKER;

      game.loop();

      expect(handleDiceLockModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the scoresheet mode handler in view score mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.VIEW_SCORE;

      game.loop();

      expect(handleScoresheetModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the score dice mode handler in edit score mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.EDIT_SCORE;

      game.loop();

      expect(handleScoreDiceModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the score joker mode handler in edit score joker mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.EDIT_SCORE_JOKER;

      game.loop();

      expect(handleScoreJokerModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the game over handler in game over mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.GAME_OVER;

      game.loop();

      expect(handleGameOverSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the quit to main menu confirm handler in quit to main menu mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());

      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.QUIT_TO_MAIN_MENU_CONFIRM;

      game.loop();

      expect(handleQuitToMainMenuConfirmSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the quit confirm handler in quit mode", () => {
      const game = new Game(fakeConfig, new MockPrompter());
    
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.QUIT_CONFIRM;

      game.loop();

      expect(handleQuitConfirmSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleMainMenu", () => {
    beforeEach(() => {
      MockGameState.mockClear();
    });

    test("handles selecting option: New game", async () => {
      const prompter = new MockPrompter([{
        promptName: "mainMenu",
        answer: "New game",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleMainMenu();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_GAME);
    });

    test("handles selecting option: Quit", async () => {
      const prompter = new MockPrompter([{
        promptName: "mainMenu",
        answer: "Quit",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleMainMenu();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });
  });

  describe("handleStatistics", () => {
    let logSpy;

    beforeEach(() => {
      MockGameState.mockClear();
      MockDataLoader.mockClear();
      logSpy = jest.spyOn(console, "log").mockClear().mockImplementation(() => {});
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("shows stats and handles selecting option: Back", async () => {
      MockDataLoader.prototype.getData.mockImplementation(() => ({
        scores: [
          { score: 300, timestamp: 123456789 },
          { score: 5, timestamp: 123456789 },
        ],
      }));

      const prompter = new MockPrompter([{
        promptName: "statistics",
        answer: "Back",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleStatistics();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenNthCalledWith(1, "Games played: 2");
      expect(logSpy).toHaveBeenNthCalledWith(2, "High score: 300");
      expect(logSpy).toHaveBeenNthCalledWith(3, "Low score: 5");
      expect(logSpy).toHaveBeenNthCalledWith(4, "Average score: 152.5");
      expect(logSpy).toHaveBeenNthCalledWith(5, " ");
      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });

    test("shows stats and handles selecting option: Clear stats", async () => {
      MockDataLoader.prototype.getData.mockImplementation(() => ({
        scores: [
          { score: 300, timestamp: 123456789 },
          { score: 5, timestamp: 123456789 },
        ],
      }));
      MockDataLoader.prototype.defaultData = { gamesPlayed: 0 };

      const prompter = new MockPrompter([{
        promptName: "statistics",
        answer: "Clear stats",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleStatistics();

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenNthCalledWith(1, "Games played: 2");
      expect(logSpy).toHaveBeenNthCalledWith(2, "High score: 300");
      expect(logSpy).toHaveBeenNthCalledWith(3, "Low score: 5");
      expect(logSpy).toHaveBeenNthCalledWith(4, "Average score: 152.5");
      expect(logSpy).toHaveBeenNthCalledWith(5, " ");
      expect(MockDataLoader.prototype.setData).toHaveBeenCalledWith({ gamesPlayed: 0 });
    });
  });

  describe("handleNewGame", () => {
    beforeEach(() => {
      MockGameState.mockClear();
    });

    test("handles selecting option: Single player", async () => {
      const prompter = new MockPrompter([{
        promptName: "newGame",
        answer: "Single player",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.initSinglePlayer).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles selecting option: Multiplayer", async () => {
      const prompter = new MockPrompter([{
        promptName: "newGame",
        answer: "Multiplayer",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_MULTIPLAYER_GAME);
    });

    test("handles selecting option: Cancel", async () => {
      const prompter = new MockPrompter([{
        promptName: "newGame",
        answer: "Cancel",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("getNewMultiplayerGamePromptChoices", () => {
    test("if not enough players to start (need at least 2), only allows adding players and canceling", () => {
      MockGameState.prototype.players = [];

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getNewMultiplayerGamePromptChoices();

      expect(choices).toEqual([{ name: "Add player" }, { name: "Cancel" }]);
    });

    test("if enough players to start (need at least 2) but not reached max players, allow adding players, starting the game and canceling", () => {
      MockGameState.prototype.players = [new MockPlayer("Player 1"), new MockPlayer("Player 2")];

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getNewMultiplayerGamePromptChoices();

      expect(choices).toEqual([{ name: "Add player" }, { name: "Start game" }, { name: "Cancel" }]);
    });

    test("if reached max players, allow starting the game and canceling", () => {
      MockGameState.prototype.players = [new MockPlayer("Player 1"), new MockPlayer("Player 2"), new MockPlayer("Player 3")];

      const game = new Game({ ...fakeConfig, maxPlayers: 3 }, new MockPrompter());

      const choices = game.getNewMultiplayerGamePromptChoices();

      expect(choices).toEqual([{ name: "Start game" }, { name: "Cancel" }]);
    });
  });

  describe("handleNewMultiplayerGame", () => {
    let logSpy;

    beforeEach(() => {
      MockGameState.mockClear();
      logSpy = jest.spyOn(console, "log").mockClear().mockImplementation(() => {});
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("handles selecting option: Add player (no existing players)", async () => {
      MockGameState.prototype.players = [];

      const prompter = new MockPrompter([{
        promptName: "newMultiplayerGame",
        answer: "Add player",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(logSpy).toHaveBeenCalledWith("No players added yet");
      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ADD_PLAYER);
    });

    test("handles selecting option: Add player (existing players)", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      MockGameState.prototype.players = [mockPlayer];

      const prompter = new MockPrompter([{
        promptName: "newMultiplayerGame",
        answer: "Add player",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockGameState = MockGameState.mock.instances[0];
      
      expect(logSpy).toHaveBeenCalledWith("Player 1: Player 1");
      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ADD_PLAYER);
    });

    test("handles selecting option: Start game", async () => {
      const mockPlayer1 = new MockPlayer("Player 1");
      const mockPlayer2 = new MockPlayer("Player 2");
      mockPlayer1.name = "Player 1";
      mockPlayer2.name = "Player 2";
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];

      const prompter = new MockPrompter([{
        promptName: "newMultiplayerGame",
        answer: "Start game",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles selecting option: Cancel", async () => {
      MockGameState.prototype.players = [];

      const prompter = new MockPrompter([{
        promptName: "newMultiplayerGame",
        answer: "Cancel",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_GAME);
    });
  });

  describe("handleAddPlayer", () => {
    beforeEach(() => {
      MockGameState.mockClear();
    });

    test("handles name input", async () => {
      MockGameState.prototype.players = [];

      const prompter = new MockPrompter([{
        promptName: "addPlayer",
        answer: "Player 1",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleAddPlayer();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.addPlayer).toHaveBeenCalledWith("Player 1");
      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });

    test("handles empty name input", async () => {
      MockGameState.prototype.players = [];

      const prompter = new MockPrompter([{
        promptName: "addPlayer",
        answer: "Player 1",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleAddPlayer();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleDiceLockMode", () => {
    test("draws turn stats and dice values", async () => {
      MockGameState.prototype.players = [new MockPlayer("Player 1")];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => ({ ...mockPlayerData, name: "Player 1" }));
      MockGameState.prototype.turn = 4;
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 3);
      MockDice.prototype.values = [1, 2, 3, 4, 5];
      MockDice.prototype.lock = [false, true, false, false, true];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreYahtzee.mockImplementation(() => 0);
      
      const prompter = new MockPrompter([{
        promptName: "diceLockMenu",
        answer: { 0: 0, 3: 3, 4: 4 },
      }]);
      const game = new Game(fakeConfig, prompter);

      await game.handleDiceLockMode();

      expect(MockDiceScorer).toHaveBeenCalledWith(MockDice.mock.instances[0].values, fakeConfig);
      expect(mockDrawUtils.drawTurnStats).toHaveBeenCalledWith("Player 1", 4, 3, false);
      expect(mockDrawUtils.drawDiceValues).toHaveBeenCalledWith([1, 2, 3, 4, 5], [false, true, false, false, true]);
    });

    test("sets new dice lock and goes back to roll mode", async () => {
      MockGameState.prototype.dice = new MockDice();

      const prompter = new MockPrompter([{
        promptName: "diceLockMenu",
        answer: { 0: 0, 3: 3, 4: 4 },
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleDiceLockMode();

      expect(continueLoop).toBeTrue();
      expect(MockDice.mock.instances[0].resetLock).toHaveBeenCalledTimes(1);
      expect(MockDice.mock.instances[0].setLock).toHaveBeenCalledWith([true, false, false, true, true]);
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });
  });

  describe("getGameOverPromptChoices", () => {
    test("Returns an option to see each player's scoresheet along with the others", () => {
      const mockPlayer1 = new MockPlayer("Player 1");
      const mockPlayer2 = new MockPlayer("Player 2");
      mockPlayer1.name = "Player 1";
      mockPlayer2.name = "Player 2";
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];

      const game = new Game(fakeConfig, new MockPrompter());
      const choices = game.getGameOverPromptChoices();
      expect(choices).toEqual([
        {
          name: "See final scores",
          value: "See final scores",
        },
        {
          name: "Player 1",
          value: 0,
          message: `See Player 1's scoresheet`,
        },
        {
          name: "Player 2",
          value: 1,
          message: `See Player 2's scoresheet`,
        },
        {
          name: "Play again",
          value: "Play again",
        },
        {
          name: "Quit",
          value: "Quit",
        }
      ]);
    });
  });

  describe("handleSinglePlayerGameOver", () => {
    let logSpy;

    beforeAll(() => {
      logSpy = jest.spyOn(console, "log")
    });

    beforeEach(() => {
      MockGameState.mockReset();
      logSpy.mockClear().mockImplementation(() => {});
      mockPlayerData.renderScoresheet.mockClear();
      mockPlayerData.resetScore.mockClear();
      mockPlayerData.setScore.mockClear();
      mockPlayerData.toJSON.mockClear();
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("handles play again: yes", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      MockGameState.prototype.players = [mockPlayer];
      
      const prompter = new MockPrompter([{
        promptName: "playAgain",
        answer: true,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleSinglePlayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Game over!\n");
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles play again: no", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      MockGameState.prototype.players = [mockPlayer];

      const prompter = new MockPrompter([{
        promptName: "playAgain",
        answer: false,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleSinglePlayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Game over!\n");
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.MAIN_MENU);
    });
  });

  describe("handleMultiplayerGameOver", () => {
    let logSpy;

    beforeAll(() => {
      logSpy = jest.spyOn(console, "log")
    });

    beforeEach(() => {
      MockGameState.mockReset();
      logSpy.mockClear().mockImplementation(() => {});
      mockPlayerData.renderScoresheet.mockClear();
      mockPlayerData.resetScore.mockClear();
      mockPlayerData.setScore.mockClear();
      mockPlayerData.toJSON.mockClear();
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("show all scores and handle selecting option: Play again", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Play again",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("show all scores and handle selecting option: See Player 1's scoresheet", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Player 1",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(0);
    });

    test("show all scores and handle selecting option: See final scores", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "See final scores",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(null);
    });

    test("show all scores and handle selecting option: Quit", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Quit",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });

    test("show player scoresheet and handle selecting option: Play again", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = 1;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer2);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Play again",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockPlayer2.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("show player scoresheet and handle selecting option: See Player 2's scoresheet", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Player 2",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockPlayer1.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(1);
    });

    test("show player scoresheet and handle selecting option: See final scores", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "See final scores",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockPlayer1.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(null);
    });

    test("show player scoresheet and handle selecting option: Quit", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);

      const prompter = new MockPrompter([{
        promptName: "gameOverMenu",
        answer: "Quit",
      }]);
      const game = new Game(fakeConfig, prompter);

      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleMultiplayerGameOver();

      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockPlayer1.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });
  });

  describe("handleGameOver", () => {
    const singlePlayerGameOverSpy = jest.spyOn(Game.prototype, "handleSinglePlayerGameOver");
    const multiplayerGameOverSpy = jest.spyOn(Game.prototype, "handleMultiplayerGameOver");
    const dateSpy = jest.spyOn(Date, "now");

    beforeEach(() => {
      singlePlayerGameOverSpy.mockClear().mockImplementation(async () => false);
      multiplayerGameOverSpy.mockClear().mockImplementation(async () => false);
      MockDataLoader.mockClear();
      dateSpy.mockClear().mockImplementation(() => 123456789);
    });

    afterAll(() => {
      singlePlayerGameOverSpy.mockRestore();
      multiplayerGameOverSpy.mockRestore();
    });

    test("sets stats and runs single player game over if there's only one player", async () => {
      const mockPlayer = { ...mockPlayerData, name: "Player 1", totalScore: 100 };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockDataLoader.prototype.getData.mockImplementation(() => ({
        scores: [],
      }));

      const game = new Game(fakeConfig, new MockPrompter());

      await game.handleGameOver();

      const mockDataLoader = MockDataLoader.mock.instances[0];

      expect(mockDataLoader.getData).toHaveBeenCalledTimes(1);
      expect(mockDataLoader.setData).toHaveBeenCalledWith({
        scores: [{ score: 100, timestamp: 123456789 }],
      });
      expect(singlePlayerGameOverSpy).toHaveBeenCalledTimes(1);
      expect(multiplayerGameOverSpy).not.toHaveBeenCalled();
    });

    test("runs multiplayer game over if there's more than one player", async () => {
      const mockPlayer1 = new MockPlayer("Player 1");
      const mockPlayer2 = new MockPlayer("Player 2");
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];

      const game = new Game(fakeConfig, new MockPrompter());

      await game.handleGameOver();

      expect(singlePlayerGameOverSpy).not.toHaveBeenCalled();
      expect(multiplayerGameOverSpy).toHaveBeenCalledTimes(1);
    });

    test("throws an error if there are no players", async () => {
      MockGameState.prototype.players = [];

      const game = new Game(fakeConfig, new MockPrompter());

      try {
        await game.handleGameOver();
        throw new Error("should not get here");
      } catch (err) {
        expect(err.message).toBe("Cannot handle game over with no players");
      }
    });
  });

  describe("handleQuitConfirm", () => {
    test("handle selecting option: yes", async () => {
      const game = new Game(fakeConfig, new MockPrompter([{
        promptName: "quitConfirm",
        answer: true,
      }]));

      const continueLoop = await game.handleQuitConfirm();

      expect(continueLoop).toBeFalse();
    });

    test("handle selecting option: no", async () => {
      const game = new Game(fakeConfig, new MockPrompter([{
        promptName: "quitConfirm",
        answer: false,
      }]));

      const continueLoop = await game.handleQuitConfirm();

      expect(continueLoop).toBeTrue();
      expect(game.state.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleQuitToMainMenuConfirm", () => {
    test("handle selecting option: yes", async () => {
      const game = new Game(fakeConfig, new MockPrompter([{
        promptName: "quitToMainMenuConfirm",
        answer: true,
      }]));

      const continueLoop = await game.handleQuitToMainMenuConfirm();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.MAIN_MENU);
    });

    test("handle selecting option: no", async () => {
      const game = new Game(fakeConfig, new MockPrompter([{
        promptName: "quitToMainMenuConfirm",
        answer: false,
      }]));

      const continueLoop = await game.handleQuitToMainMenuConfirm();

      expect(continueLoop).toBeTrue();
      expect(game.state.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRollModePromptChoices", () => {
    test("when no rolls have been done, allows option to roll dice along with default options", () => {
      MockGameState.prototype.rollNumber = 0;

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getRollModePromptChoices();

      expect(choices).toEqual([
        { name: RollModeChoice.ROLL_DICE },
        { name: RollModeChoice.SEE_SCORESHEET },
        { name: RollModeChoice.QUIT_TO_MAIN_MENU },
        { name: RollModeChoice.QUIT },
      ]);
    });

    test("after rolling and before max rolls is reached, allows option to roll again, lock dice and score dice along with default option", () => {
      MockGameState.prototype.rollNumber = 1;

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getRollModePromptChoices();

      expect(choices).toEqual([
        { name: RollModeChoice.ROLL_AGAIN },
        { name: RollModeChoice.LOCK_DICE },
        { name: RollModeChoice.SCORE_DICE },
        { name: RollModeChoice.SEE_SCORESHEET },
        { name: RollModeChoice.QUIT_TO_MAIN_MENU },
        { name: RollModeChoice.QUIT },
      ]);
    });

    test("after max rolls is reached, allows option to score dice along with default options", () => {
      MockGameState.prototype.rollNumber = 3;

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getRollModePromptChoices();

      expect(choices).toEqual([
        { name: RollModeChoice.SCORE_DICE },
        { name: RollModeChoice.SEE_SCORESHEET },
        { name: RollModeChoice.QUIT_TO_MAIN_MENU },
        { name: RollModeChoice.QUIT },
      ]);
    });
  });

  describe("handleRollMode", () => {
    test("draws turn stats and dice values", async () => {
      MockGameState.prototype.players = [new MockPlayer("Player 1")];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => ({ ...mockPlayerData, name: "Player 1" }));
      MockGameState.prototype.turn = 4;
      MockGameState.prototype.rollNumber = 0;
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 3);
      MockDice.prototype.values = [1, 2, 3, 4, 5];
      MockDice.prototype.lock = [false, true, false, false, true];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreYahtzee.mockImplementation(() => 0);
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.ROLL_DICE,
      }]);
      const game = new Game(fakeConfig, prompter);

      await game.handleRollMode();

      expect(MockDiceScorer).toHaveBeenCalledWith(MockDice.mock.instances[0].values, fakeConfig);
      expect(mockDrawUtils.drawTurnStats).toHaveBeenCalledWith("Player 1", 4, 3, false);
      expect(mockDrawUtils.drawDiceValues).toHaveBeenCalledWith([1, 2, 3, 4, 5], [false, true, false, false, true]);
    });

    test("handles selecting option: Roll dice", async () => {
      MockGameState.prototype.rollNumber = 0;
      MockGameState.prototype.dice = new MockDice();
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.ROLL_DICE,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.dice.roll).toHaveBeenCalledTimes(1);
      expect(game.state.incrementRollNumber).toHaveBeenCalledTimes(1);
    });

    test("handles selecting option: Roll again", async () => {
      MockGameState.prototype.rollNumber = 1;
      MockGameState.prototype.dice = new MockDice();
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.ROLL_AGAIN,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.dice.roll).toHaveBeenCalledTimes(1);
      expect(game.state.incrementRollNumber).toHaveBeenCalledTimes(1);
    });

    test("handles selecting option: Lock dice", async () => {
      MockGameState.prototype.rollNumber = 1;
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.LOCK_DICE,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.DICE_LOCKER);
    });

    test("handles selecting option: See scoresheet", async () => {
      MockGameState.prototype.rollNumber = 0;
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.SEE_SCORESHEET,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.VIEW_SCORE);
    });

    test("handles selecting option: Score dice", async () => {
      MockGameState.prototype.rollNumber = 1;
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.SCORE_DICE,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.EDIT_SCORE);
    });

    test("handles selecting option: Quit to main menu", async () => {
      MockGameState.prototype.rollNumber = 0;
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.QUIT_TO_MAIN_MENU,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.QUIT_TO_MAIN_MENU_CONFIRM);
    });

    test("handles selecting option: Quit", async () => {
      MockGameState.prototype.rollNumber = 0;
      
      const prompter = new MockPrompter([{
        promptName: "gameAction",
        answer: RollModeChoice.QUIT,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleRollMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });
  });

  describe("getScoreDicePromptChoices", () => {
    test("displays hints and disables options based on score - all empty", () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      mockPlayer.score = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 2);
      MockDice.prototype.values = [0, 0, 0, 0, 0];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreDicePromptChoices();

      expect(choices).toEqual([
        { message: "Aces", name: "ones", value: "ones", hint: 0, disabled: false },
        { message: "Twos", name: "twos", value: "twos", hint: 0, disabled: false },
        { message: "Threes", name: "threes", value: "threes", hint: 0, disabled: false },
        { message: "Fours", name: "fours", value: "fours", hint: 0, disabled: false },
        { message: "Fives", name: "fives", value: "fives", hint: 0, disabled: false },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 0, disabled: false },
        { message: "Three of a Kind", name: "threeOfAKind", value: "threeOfAKind", hint: 0, disabled: false },
        { message: "Four of a Kind", name: "fourOfAKind", value: "fourOfAKind", hint: 0, disabled: false },
        { message: "Full House", name: "fullHouse", value: "fullHouse", hint: 0, disabled: false },
        { message: "Small Straight", name: "smallStraight", value: "smallStraight", hint: 0, disabled: false },
        { message: "Large Straight", name: "largeStraight", value: "largeStraight", hint: 0, disabled: false },
        { message: "Yahtzee", name: "yahtzee", value: "yahtzee", hint: 0, disabled: false },
        { message: "Chance", name: "chance", value: "chance", hint: 0, disabled: false },
        { message: "Bonus Yahtzees", name: "yahtzeeBonus", value: "yahtzeeBonus", hint: "[0]", disabled: true },
        { message: "Cancel", name: "Cancel", value: "Cancel" },
      ]);
    });

    test("displays hints and disables options based on score - all empty and no rolls left", () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      mockPlayer.score = {
        ones: null,
        twos: null,
        threes: null,
        fours: null,
        fives: null,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: null,
        smallStraight: null,
        largeStraight: null,
        yahtzee: null,
        chance: null,
        yahtzeeBonus: 0,
      };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 0);
      MockDice.prototype.values = [0, 0, 0, 0, 0];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreDicePromptChoices();

      expect(choices).toEqual([
        { message: "Aces", name: "ones", value: "ones", hint: 0, disabled: false },
        { message: "Twos", name: "twos", value: "twos", hint: 0, disabled: false },
        { message: "Threes", name: "threes", value: "threes", hint: 0, disabled: false },
        { message: "Fours", name: "fours", value: "fours", hint: 0, disabled: false },
        { message: "Fives", name: "fives", value: "fives", hint: 0, disabled: false },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 0, disabled: false },
        { message: "Three of a Kind", name: "threeOfAKind", value: "threeOfAKind", hint: 0, disabled: false },
        { message: "Four of a Kind", name: "fourOfAKind", value: "fourOfAKind", hint: 0, disabled: false },
        { message: "Full House", name: "fullHouse", value: "fullHouse", hint: 0, disabled: false },
        { message: "Small Straight", name: "smallStraight", value: "smallStraight", hint: 0, disabled: false },
        { message: "Large Straight", name: "largeStraight", value: "largeStraight", hint: 0, disabled: false },
        { message: "Yahtzee", name: "yahtzee", value: "yahtzee", hint: 0, disabled: false },
        { message: "Chance", name: "chance", value: "chance", hint: 0, disabled: false },
        { message: "Bonus Yahtzees", name: "yahtzeeBonus", value: "yahtzeeBonus", hint: "[0]", disabled: true },
      ]);
    });

    test("displays hints and disables options based on score - some already scored", () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      mockPlayer.score = {
        ones: 3,
        twos: null,
        threes: null,
        fours: null,
        fives: 15,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: 25,
        smallStraight: null,
        largeStraight: null,
        yahtzee: 50,
        chance: 25,
        yahtzeeBonus: 0,
      };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 2);
      MockDice.prototype.values = [0, 0, 0, 0, 0];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreDicePromptChoices();

      expect(choices).toEqual([
        { message: "Aces", name: "ones", value: "ones", hint: "[3]", disabled: true },
        { message: "Twos", name: "twos", value: "twos", hint: 0, disabled: false },
        { message: "Threes", name: "threes", value: "threes", hint: 0, disabled: false },
        { message: "Fours", name: "fours", value: "fours", hint: 0, disabled: false },
        { message: "Fives", name: "fives", value: "fives", hint: "[15]", disabled: true },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 0, disabled: false },
        { message: "Three of a Kind", name: "threeOfAKind", value: "threeOfAKind", hint: 0, disabled: false },
        { message: "Four of a Kind", name: "fourOfAKind", value: "fourOfAKind", hint: 0, disabled: false },
        { message: "Full House", name: "fullHouse", value: "fullHouse", hint: "[25]", disabled: true },
        { message: "Small Straight", name: "smallStraight", value: "smallStraight", hint: 0, disabled: false },
        { message: "Large Straight", name: "largeStraight", value: "largeStraight", hint: 0, disabled: false },
        { message: "Yahtzee", name: "yahtzee", value: "yahtzee", hint: "[50]", disabled: true },
        { message: "Chance", name: "chance", value: "chance", hint: "[25]", disabled: true },
        { message: "Bonus Yahtzees", name: "yahtzeeBonus", value: "yahtzeeBonus", hint: "[0]", disabled: true },
        { message: "Cancel", name: "Cancel", value: "Cancel" },
      ]);
    });

    test("displays hints and disables options based on score - yahtzee already scored, can score another", () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      mockPlayer.score = {
        ones: 3,
        twos: null,
        threes: null,
        fours: null,
        fives: 15,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: 25,
        smallStraight: null,
        largeStraight: null,
        yahtzee: 50,
        chance: 25,
        yahtzeeBonus: 0,
      };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 2);
      MockDice.prototype.values = [1, 1, 1, 1, 1];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementation(() => 100);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreDicePromptChoices();

      expect(choices).toEqual([
        { message: "Aces", name: "ones", value: "ones", hint: "[3]", disabled: true },
        { message: "Twos", name: "twos", value: "twos", hint: 0, disabled: false },
        { message: "Threes", name: "threes", value: "threes", hint: 0, disabled: false },
        { message: "Fours", name: "fours", value: "fours", hint: 0, disabled: false },
        { message: "Fives", name: "fives", value: "fives", hint: "[15]", disabled: true },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 0, disabled: false },
        { message: "Three of a Kind", name: "threeOfAKind", value: "threeOfAKind", hint: 0, disabled: false },
        { message: "Four of a Kind", name: "fourOfAKind", value: "fourOfAKind", hint: 0, disabled: false },
        { message: "Full House", name: "fullHouse", value: "fullHouse", hint: "[25]", disabled: true },
        { message: "Small Straight", name: "smallStraight", value: "smallStraight", hint: 0, disabled: false },
        { message: "Large Straight", name: "largeStraight", value: "largeStraight", hint: 0, disabled: false },
        { message: "Yahtzee", name: "yahtzee", value: "yahtzee", hint: "[50]", disabled: true },
        { message: "Chance", name: "chance", value: "chance", hint: "[25]", disabled: true },
        { message: "Bonus Yahtzees", name: "yahtzeeBonus", value: "yahtzeeBonus", hint: "[0] + 100", disabled: false },
        { message: "Cancel", name: "Cancel", value: "Cancel" },
      ]);
    });

    test("displays hints and disables options based on score - bonus yahtzee already scored, can score another", () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      mockPlayer.score = {
        ones: 3,
        twos: null,
        threes: null,
        fours: null,
        fives: 15,
        sixes: null,
        threeOfAKind: null,
        fourOfAKind: null,
        fullHouse: 25,
        smallStraight: null,
        largeStraight: null,
        yahtzee: 50,
        chance: 25,
        yahtzeeBonus: 100,
      };
      MockGameState.prototype.players = [mockPlayer];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 2);
      MockDice.prototype.values = [1, 1, 1, 1, 1];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 0);
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementation(() => 100);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreDicePromptChoices();

      expect(choices).toEqual([
        { message: "Aces", name: "ones", value: "ones", hint: "[3]", disabled: true },
        { message: "Twos", name: "twos", value: "twos", hint: 0, disabled: false },
        { message: "Threes", name: "threes", value: "threes", hint: 0, disabled: false },
        { message: "Fours", name: "fours", value: "fours", hint: 0, disabled: false },
        { message: "Fives", name: "fives", value: "fives", hint: "[15]", disabled: true },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 0, disabled: false },
        { message: "Three of a Kind", name: "threeOfAKind", value: "threeOfAKind", hint: 0, disabled: false },
        { message: "Four of a Kind", name: "fourOfAKind", value: "fourOfAKind", hint: 0, disabled: false },
        { message: "Full House", name: "fullHouse", value: "fullHouse", hint: "[25]", disabled: true },
        { message: "Small Straight", name: "smallStraight", value: "smallStraight", hint: 0, disabled: false },
        { message: "Large Straight", name: "largeStraight", value: "largeStraight", hint: 0, disabled: false },
        { message: "Yahtzee", name: "yahtzee", value: "yahtzee", hint: "[50]", disabled: true },
        { message: "Chance", name: "chance", value: "chance", hint: "[25]", disabled: true },
        { message: "Bonus Yahtzees", name: "yahtzeeBonus", value: "yahtzeeBonus", hint: "[100] + 100", disabled: false },
        { message: "Cancel", name: "Cancel", value: "Cancel" },
      ]);
    });
  });

  describe("handleScoreDiceMode", () => {
    test("draws turn stats and dice values", async () => {
      MockGameState.prototype.players = [new MockPlayer("Player 1")];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => ({
        ...mockPlayerData,
        name: "Player 1",
        score: {
          ones: 3,
          twos: null,
          threes: null,
          fours: null,
          fives: 15,
          sixes: null,
          threeOfAKind: null,
          fourOfAKind: null,
          fullHouse: 25,
          smallStraight: null,
          largeStraight: null,
          yahtzee: 50,
          chance: 25,
          yahtzeeBonus: 100,
        },
      }));
      MockGameState.prototype.turn = 4;
      MockGameState.prototype.rollNumber = 0;
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 3);
      MockDice.prototype.values = [1, 2, 3, 4, 5];
      MockDice.prototype.lock = [false, true, false, false, true];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreYahtzee.mockImplementation(() => 0);
      
      const prompter = new MockPrompter([{
        promptName: "scoreDiceMenu",
        answer: "Cancel",
      }]);
      const game = new Game(fakeConfig, prompter);

      await game.handleScoreDiceMode();

      expect(MockDiceScorer).toHaveBeenCalledWith(MockDice.mock.instances[0].values, fakeConfig);
      expect(mockDrawUtils.drawTurnStats).toHaveBeenCalledWith("Player 1", 4, 3, false);
      expect(mockDrawUtils.drawDiceValues).toHaveBeenCalledWith([1, 2, 3, 4, 5], [false, true, false, false, true]);
    });

    test("handles selecting option: Cancel", async () => {
      MockGameState.prototype.getDiceRollsLeft.mockImplementation(() => 3);

      const prompter = new MockPrompter([{
        promptName: "scoreDiceMenu",
        answer: "Cancel",
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleScoreDiceMode();

      expect(continueLoop).toBeTrue();
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles selecting yahtzee bonus category", async () => {
      const mockPlayer = {
        ...mockPlayerData,
        name: "Player 1",
        score: {
          ones: 3,
          twos: null,
          threes: null,
          fours: null,
          fives: 15,
          sixes: null,
          threeOfAKind: null,
          fourOfAKind: null,
          fullHouse: 25,
          smallStraight: null,
          largeStraight: null,
          yahtzee: 50,
          chance: 25,
          yahtzeeBonus: 0,
        },
      };
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockDiceScorer.prototype.scoreYahtzeeBonus.mockImplementation(() => 100);

      const prompter = new MockPrompter([{
        promptName: "scoreDiceMenu",
        answer: YahtzeeScoreCategory.YahtzeeBonus,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleScoreDiceMode();

      expect(continueLoop).toBeTrue();
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.YahtzeeBonus, 100);
      expect(game.state.setMode).toHaveBeenCalledWith(GameMode.EDIT_SCORE_JOKER);
    });

    test("handles selecting any other category", async () => {
      const mockPlayer = {
        ...mockPlayerData,
        name: "Player 1",
        score: {
          ones: null,
          twos: null,
          threes: null,
          fours: null,
          fives: null,
          sixes: null,
          threeOfAKind: null,
          fourOfAKind: null,
          fullHouse: null,
          smallStraight: null,
          largeStraight: null,
          yahtzee: 50,
          chance: null,
          yahtzeeBonus: 100,
        },
      };
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer);
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 12);

      const prompter = new MockPrompter([{
        promptName: "scoreDiceMenu",
        answer: YahtzeeScoreCategory.Fours,
      }]);
      const game = new Game(fakeConfig, prompter);

      const continueLoop = await game.handleScoreDiceMode();

      expect(continueLoop).toBeTrue();
      expect(mockPlayer.setScore).toHaveBeenCalledWith(YahtzeeScoreCategory.Fours, 12);
      expect(game.state.nextPlayer).toHaveBeenCalledTimes(1);
    });
  });

  describe("getScoreJokerPromptChoices", () => {
    beforeEach(() => {
      MockGameState.mockClear();
      MockDiceScorer.mockClear();
      MockDice.mockClear();
    });

    test("only allows choosing the correct number category if it's open", () => {
      const mockPlayer1 = {
        ...mockPlayerData,
        score: {
          ones: null,
          twos: null,
          threes: null,
          fours: null,
          fives: null,
          sixes: null,
          threeOfAKind: null,
          fourOfAKind: null,
          fullHouse: null,
          smallStraight: null,
          largeStraight: null,
          yahtzee: 50,
          chance: null,
          yahtzeeBonus: 100,
        },
      };
      MockGameState.prototype.players = [mockPlayer1];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      MockDice.prototype.values = [6, 6, 6, 6, 6];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 30);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreJokerPromptChoices();

      expect(choices).toEqual([
        {
          message: "Attempt 1: Score sum of dice in the appropriate number category",
          name: "Attempt 1: Score sum of dice in the appropriate number category",
          value: "Attempt 1: Score sum of dice in the appropriate number category",
          hint: "",
          role: "separator",
        },
        { message: "Sixes", name: "sixes", value: "sixes", hint: 30, disabled: false },
        {
          message: "Attempt 2: Score in any lower section category",
          name: "Attempt 2: Score in any lower section category",
          value: "Attempt 2: Score in any lower section category",
          hint: "",
          role: "separator",
        },
        {
          message: "Three of a Kind",
          name: "threeOfAKind",
          value: "threeOfAKind",
          hint: 30,
          disabled: true,
        },
        {
          message: "Four of a Kind",
          name: "fourOfAKind",
          value: "fourOfAKind",
          hint: 30,
          disabled: true,
        },
        {
          message: "Full House",
          name: "fullHouse",
          value: "fullHouse",
          hint: undefined,
          disabled: true,
        },
        {
          message: "Small Straight",
          name: "smallStraight",
          value: "smallStraight",
          hint: undefined,
          disabled: true,
        },
        {
          message: "Large Straight",
          name: "largeStraight",
          value: "largeStraight",
          hint: undefined,
          disabled: true,
        },
        {
          message: "Chance",
          name: "chance",
          value: "chance",
          hint: 30,
          disabled: true,
        },
        {
          message: "Attempt 3: Score zero in any number category",
          name: "Attempt 3: Score zero in any number category",
          value: "Attempt 3: Score zero in any number category",
          hint: "",
          role: "separator",
        },
        {
          message: "Aces",
          name: "ones",
          value: "ones",
          hint: 0,
          disabled: true,
        },
        {
          message: "Twos",
          name: "twos",
          value: "twos",
          hint: 0,
          disabled: true,
        },
        {
          message: "Threes",
          name: "threes",
          value: "threes",
          hint: 0,
          disabled: true,
        },
        {
          message: "Fours",
          name: "fours",
          value: "fours",
          hint: 0,
          disabled: true,
        },
        {
          message: "Fives",
          name: "fives",
          value: "fives",
          hint: 0,
          disabled: true,
        },
      ]);
    });

    test("only allows choosing open bottom section categories if number category is taken", () => {
      const mockPlayer1 = {
        ...mockPlayerData,
        score: {
          ones: null,
          twos: null,
          threes: null,
          fours: null,
          fives: null,
          sixes: 30,
          threeOfAKind: null,
          fourOfAKind: null,
          fullHouse: 25,
          smallStraight: null,
          largeStraight: null,
          yahtzee: 50,
          chance: null,
          yahtzeeBonus: 100,
        },
      };
      MockGameState.prototype.players = [mockPlayer1];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      MockDice.prototype.values = [6, 6, 6, 6, 6];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 30);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreJokerPromptChoices();

      expect(choices).toEqual([
        {
          message: "Attempt 1: Score sum of dice in the appropriate number category",
          name: "Attempt 1: Score sum of dice in the appropriate number category",
          value: "Attempt 1: Score sum of dice in the appropriate number category",
          hint: "",
          role: "separator",
        },
        { message: "Sixes", name: "sixes", value: "sixes", hint: "[30]", disabled: true },
        {
          message: "Attempt 2: Score in any lower section category",
          name: "Attempt 2: Score in any lower section category",
          value: "Attempt 2: Score in any lower section category",
          hint: "",
          role: "separator",
        },
        {
          message: "Three of a Kind",
          name: "threeOfAKind",
          value: "threeOfAKind",
          hint: 30,
          disabled: false,
        },
        {
          message: "Four of a Kind",
          name: "fourOfAKind",
          value: "fourOfAKind",
          hint: 30,
          disabled: false,
        },
        {
          message: "Full House",
          name: "fullHouse",
          value: "fullHouse",
          hint: "[25]",
          disabled: true,
        },
        {
          message: "Small Straight",
          name: "smallStraight",
          value: "smallStraight",
          hint: undefined,
          disabled: false,
        },
        {
          message: "Large Straight",
          name: "largeStraight",
          value: "largeStraight",
          hint: undefined,
          disabled: false,
        },
        {
          message: "Chance",
          name: "chance",
          value: "chance",
          hint: 30,
          disabled: false,
        },
        {
          message: "Attempt 3: Score zero in any number category",
          name: "Attempt 3: Score zero in any number category",
          value: "Attempt 3: Score zero in any number category",
          hint: "",
          role: "separator",
        },
        {
          message: "Aces",
          name: "ones",
          value: "ones",
          hint: 0,
          disabled: true,
        },
        {
          message: "Twos",
          name: "twos",
          value: "twos",
          hint: 0,
          disabled: true,
        },
        {
          message: "Threes",
          name: "threes",
          value: "threes",
          hint: 0,
          disabled: true,
        },
        {
          message: "Fours",
          name: "fours",
          value: "fours",
          hint: 0,
          disabled: true,
        },
        {
          message: "Fives",
          name: "fives",
          value: "fives",
          hint: 0,
          disabled: true,
        },
      ]);
    });

    test("only allows choosing other top section categories everything else is taken", () => {
      const mockPlayer1 = {
        ...mockPlayerData,
        score: {
          ones: null,
          twos: null,
          threes: 18,
          fours: null,
          fives: null,
          sixes: 30,
          threeOfAKind: 30,
          fourOfAKind: 30,
          fullHouse: 25,
          smallStraight: 30,
          largeStraight: 40,
          yahtzee: 50,
          chance: 30,
          yahtzeeBonus: 100,
        },
      };
      MockGameState.prototype.players = [mockPlayer1];
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);
      MockDice.prototype.values = [6, 6, 6, 6, 6];
      MockGameState.prototype.dice = new MockDice();
      MockDiceScorer.prototype.scoreCategory.mockImplementation(() => 30);

      const game = new Game(fakeConfig, new MockPrompter());

      const choices = game.getScoreJokerPromptChoices();

      expect(choices).toEqual([
        {
          message: "Attempt 1: Score sum of dice in the appropriate number category",
          name: "Attempt 1: Score sum of dice in the appropriate number category",
          value: "Attempt 1: Score sum of dice in the appropriate number category",
          hint: "",
          role: "separator",
        },
        { message: "Sixes", name: "sixes", value: "sixes", hint: "[30]", disabled: true },
        {
          message: "Attempt 2: Score in any lower section category",
          name: "Attempt 2: Score in any lower section category",
          value: "Attempt 2: Score in any lower section category",
          hint: "",
          role: "separator",
        },
        {
          message: "Three of a Kind",
          name: "threeOfAKind",
          value: "threeOfAKind",
          hint: "[30]",
          disabled: true,
        },
        {
          message: "Four of a Kind",
          name: "fourOfAKind",
          value: "fourOfAKind",
          hint: "[30]",
          disabled: true,
        },
        {
          message: "Full House",
          name: "fullHouse",
          value: "fullHouse",
          hint: "[25]",
          disabled: true,
        },
        {
          message: "Small Straight",
          name: "smallStraight",
          value: "smallStraight",
          hint: "[30]",
          disabled: true,
        },
        {
          message: "Large Straight",
          name: "largeStraight",
          value: "largeStraight",
          hint: "[40]",
          disabled: true,
        },
        {
          message: "Chance",
          name: "chance",
          value: "chance",
          hint: "[30]",
          disabled: true,
        },
        {
          message: "Attempt 3: Score zero in any number category",
          name: "Attempt 3: Score zero in any number category",
          value: "Attempt 3: Score zero in any number category",
          hint: "",
          role: "separator",
        },
        {
          message: "Aces",
          name: "ones",
          value: "ones",
          hint: 0,
          disabled: false,
        },
        {
          message: "Twos",
          name: "twos",
          value: "twos",
          hint: 0,
          disabled: false,
        },
        {
          message: "Threes",
          name: "threes",
          value: "threes",
          hint: "[18]",
          disabled: true,
        },
        {
          message: "Fours",
          name: "fours",
          value: "fours",
          hint: 0,
          disabled: false,
        },
        {
          message: "Fives",
          name: "fives",
          value: "fives",
          hint: 0,
          disabled: false,
        },
      ]);
    });
  });
});