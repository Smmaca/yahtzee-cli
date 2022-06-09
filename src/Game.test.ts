import clear from "clear";
import config from "./config";
import Game from "./Game";
import GameState from "./GameState";
import Player from "./Player";
import { GameMode } from "./types";
import * as drawUtils from "./utils/draw";
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import Input from "enquirer/lib/prompts/Input";

jest.mock("./GameState");
jest.mock("./Player");
jest.mock("clear");
jest.mock("./utils/draw");
jest.mock("enquirer/lib/prompts/MultiSelect");
jest.mock("enquirer/lib/prompts/Confirm");
jest.mock("enquirer/lib/prompts/Select");
jest.mock("enquirer/lib/prompts/Input");

const mockClear = clear as jest.MockedFunction<typeof clear>;
const MockGameState = GameState as jest.MockedClass<typeof GameState>;
const MockPlayer = Player as jest.MockedClass<typeof Player>;
const mockDrawUtils = drawUtils as jest.Mocked<typeof drawUtils>;
const MockMultiSelect = MultiSelect as jest.MockedClass<typeof MultiSelect>;
const MockConfirm = Confirm as jest.MockedClass<typeof Confirm>;
const MockSelect = Select as jest.MockedClass<typeof Select>;
const MockInput = Input as jest.MockedClass<typeof Input>;

const fakeConfig = {
  ...config,
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
  beforeEach(() => {
    MockSelect.mockClear();
    MockConfirm.mockClear();
    MockInput.mockClear();
    MockMultiSelect.mockClear();
  });

  test("saves the config and creates a new game state on instantiation", () => {
    const game = new Game(fakeConfig);

    expect(game.config).toMatchObject(fakeConfig);
    expect(MockGameState).toHaveBeenCalledWith(fakeConfig);
  });

  describe("init", () => {
    test.todo("inits");
  });

  describe("loop", () => {
    const game = new Game(fakeConfig);

    const handleMainMenuSpy = jest.spyOn(game, "handleMainMenu");
    const handleNewGameSpy = jest.spyOn(game, "handleNewGame");
    const handleNewMultiplayerGameSpy = jest.spyOn(game, "handleNewMultiplayerGame");
    const handleAddPlayerSpy = jest.spyOn(game, "handleAddPlayer");
    const handleRollModeSpy = jest.spyOn(game, "handleRollMode");
    const handleDiceLockModeSpy = jest.spyOn(game, "handleDiceLockMode");
    const handleScoresheetModeSpy = jest.spyOn(game, "handleScoresheetMode");
    const handleScoreDiceModeSpy = jest.spyOn(game, "handleScoreDiceMode");
    const handleScoreJokerModeSpy = jest.spyOn(game, "handleScoreJokerMode");
    const handleGameOverSpy = jest.spyOn(game, "handleGameOver");
    const handleQuitToMainMenuConfirmSpy = jest.spyOn(game, "handleQuitToMainMenuConfirm");
    const handleQuitConfirmSpy = jest.spyOn(game, "handleQuitConfirm");

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
      mockDrawUtils.drawTitle.mockClear();
    });
    
    test("clears the screen", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    test("draws the title", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(mockDrawUtils.drawTitle).toHaveBeenCalledTimes(1);
    });

    test("calls the main menu handler in main menu mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.MAIN_MENU;

      game.loop();

      expect(handleMainMenuSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the new game handler in new game mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.NEW_GAME;

      game.loop();

      expect(handleNewGameSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the new multiplayer game handler in new multiplayer game mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.NEW_MULTIPLAYER_GAME;

      game.loop();

      expect(handleNewMultiplayerGameSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the add player handler in add player mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.ADD_PLAYER;

      game.loop();

      expect(handleAddPlayerSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the roll mode handler in roll mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.ROLL;

      game.loop();

      expect(handleRollModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the dice lock mode handler in dice locker mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.DICE_LOCKER;

      game.loop();

      expect(handleDiceLockModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the scoresheet mode handler in view score mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.VIEW_SCORE;

      game.loop();

      expect(handleScoresheetModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the score dice mode handler in edit score mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.EDIT_SCORE;

      game.loop();

      expect(handleScoreDiceModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the score joker mode handler in edit score joker mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.EDIT_SCORE_JOKER;

      game.loop();

      expect(handleScoreJokerModeSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the game over handler in game over mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.GAME_OVER;

      game.loop();

      expect(handleGameOverSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the quit to main menu confirm handler in quit to main menu mode", () => {
      const mockGameState = MockGameState.mock.instances[0];
      mockGameState.mode = GameMode.QUIT_TO_MAIN_MENU_CONFIRM;

      game.loop();

      expect(handleQuitToMainMenuConfirmSpy).toHaveBeenCalledTimes(1);
    });

    test("calls the quit confirm handler in quit mode", () => {
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
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "New game");

      const continueLoop = await game.handleMainMenu();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_GAME);
    });

    test("handles selecting option: Quit", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Quit");

      const continueLoop = await game.handleMainMenu();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });
  });

  describe("handleNewGame", () => {
    beforeEach(() => {
      MockGameState.mockClear();
    });

    test("handles selecting option: Single player", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Single player");

      const continueLoop = await game.handleNewGame();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.initSinglePlayer).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles selecting option: Multiplayer", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Multiplayer");

      const continueLoop = await game.handleNewGame();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.newGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_MULTIPLAYER_GAME);
    });

    test("handles selecting option: Cancel", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Cancel");

      const continueLoop = await game.handleNewGame();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleNewMultiplayerGame", () => {
    const logSpy = jest.spyOn(console, "log");

    beforeEach(() => {
      MockGameState.mockClear();
      logSpy.mockClear().mockImplementation(() => {});
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("handles selecting option: Add player (no existing players)", async () => {
      MockGameState.prototype.players = [];

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Add player");

      const continueLoop = await game.handleNewMultiplayerGame();

      expect(logSpy).toHaveBeenCalledWith("No players added yet");

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ADD_PLAYER);
    });

    test("handles selecting option: Add player (existing players)", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      mockPlayer.name = "Player 1";
      MockGameState.prototype.players = [mockPlayer];

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Add player");

      const continueLoop = await game.handleNewMultiplayerGame();

      expect(logSpy).toHaveBeenCalledWith("Player 1: Player 1");

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ADD_PLAYER);
    });

    test("handles selecting option: Start game", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Start game");

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("handles selecting option: Cancel", async () => {
      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Cancel");
      MockGameState.prototype.players = [];

      const continueLoop = await game.handleNewMultiplayerGame();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.NEW_GAME);
    });
  });

  describe("handleAddPlayer", () => {
    beforeEach(() => {
      MockGameState.mockClear();
    });

    test("handles name input", async () => {
      const game = new Game(fakeConfig);

      MockInput.prototype.run.mockImplementation(async () => "Player 1");
      MockGameState.prototype.players = [];

      const continueLoop = await game.handleAddPlayer();

      const mockPrompt = MockInput.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockInput).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.addPlayer).toHaveBeenCalledWith("Player 1");
      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });

    test("handles empty name input", async () => {
      const game = new Game(fakeConfig);

      MockInput.prototype.run.mockImplementation(async () => "");
      MockGameState.prototype.players = [];

      const continueLoop = await game.handleAddPlayer();

      const mockPrompt = MockInput.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(MockInput).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.revertMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("handleGameOver", () => {
    let logSpy;

    beforeAll(() => {
      logSpy = jest.spyOn(console, "log")
    });

    beforeEach(() => {
      MockGameState.mockReset();
      logSpy.mockClear();
    });

    afterAll(() => {
      logSpy.mockRestore();
    });

    test("single player game, handles play again: yes", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      MockGameState.prototype.players = [mockPlayer];
      
      const game = new Game(fakeConfig);

      MockConfirm.prototype.run.mockImplementation(async () =>  true);
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockConfirm.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Game over!\n");
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).not.toHaveBeenCalledTimes(1);
      expect(MockConfirm).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("single player game, handles play again: no", async () => {
      const mockPlayer = new MockPlayer("Player 1");
      MockGameState.prototype.players = [mockPlayer];

      const game = new Game(fakeConfig);

      MockConfirm.prototype.run.mockImplementation(async () =>  false);
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockConfirm.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Game over!\n");
      expect(mockPlayer.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).not.toHaveBeenCalledTimes(1);
      expect(MockConfirm).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.MAIN_MENU);
    });

    test("multiplayer, show all scores and handle selecting option: Play again", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Play again");
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    test("multiplayer, show all scores and handle selecting option: See Player 1's scoresheet", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Player 1");
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(0);
    });

    test("multiplayer, show all scores and handle selecting option: See final scores", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "See final scores");
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(null);
    });

    test("multiplayer, show all scores and handle selecting option: Quit", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = null;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Quit");
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(logSpy).toHaveBeenCalledWith("Player 2 wins!");
      expect(mockGameState.renderPlayerScores).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.QUIT_CONFIRM);
    });

    test("multiplayer, show player scoresheet and handle selecting option: Play again", async () => {
      const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
      const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
      MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
      MockGameState.prototype.currentPlayerIndex = 0;
      MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
      MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);

      const game = new Game(fakeConfig);

      MockSelect.prototype.run.mockImplementation(async () => "Play again");
      const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

      const continueLoop = await game.handleGameOver();

      const mockPrompt = MockSelect.mock.instances[0];
      const mockGameState = MockGameState.mock.instances[0];

      expect(continueLoop).toBeTrue();
      expect(mockPlayer1.renderScoresheet).toHaveBeenCalledTimes(1);
      expect(getChoicesSpy).toHaveBeenCalledTimes(1);
      expect(MockSelect).toHaveBeenCalledTimes(1);
      expect(mockPrompt.run).toHaveBeenCalledTimes(1);

      expect(mockGameState.resetGame).toHaveBeenCalledTimes(1);
      expect(mockGameState.setMode).toHaveBeenCalledWith(GameMode.ROLL);
    });

    // test("multiplayer, show player scoresheet and handle selecting option: See Player 2's scoresheet", async () => {
    //   const mockPlayer1 = { ...mockPlayerData, name: "Player 1" };
    //   const mockPlayer2 = { ...mockPlayerData, name: "Player 2" };
    //   MockGameState.prototype.players = [mockPlayer1, mockPlayer2];
    //   MockGameState.prototype.currentPlayerIndex = 0;
    //   MockGameState.prototype.getWinner.mockImplementation(() => mockPlayer2);
    //   MockGameState.prototype.getCurrentPlayer.mockImplementation(() => mockPlayer1);

    //   const game = new Game(fakeConfig);

    //   MockSelect.prototype.run.mockImplementation(async () => "Player 2");
    //   const getChoicesSpy = jest.spyOn(game, "getGameOverPromptChoices");

    //   const continueLoop = await game.handleGameOver();

    //   const mockPrompt = MockSelect.mock.instances[0];
    //   const mockGameState = MockGameState.mock.instances[0];

    //   expect(continueLoop).toBeTrue();
    //   expect(mockPlayer1.renderScoresheet).toHaveBeenCalledTimes(1);
    //   expect(getChoicesSpy).toHaveBeenCalledTimes(1);
    //   expect(MockSelect).toHaveBeenCalledTimes(1);
    //   expect(mockPrompt.run).toHaveBeenCalledTimes(1);

    //   expect(mockGameState.setCurrentPlayer).toHaveBeenCalledWith(1);
    // });
  });
});