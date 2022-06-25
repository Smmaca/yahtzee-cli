import config from "../config";
import Dice from "./Dice";
import GameState from "./GameState";
import Player from "./Player";
import { GameMode } from "../types";

jest.mock("./Dice");
jest.mock("./Player");

const MockDice = Dice as jest.MockedClass<typeof Dice>;
const MockPlayer = Player as jest.MockedClass<typeof Player>;

const fakeConfig = {
  ...config,
  rollsPerTurn: 4,
  turns: 15,
};

describe("GameState", () => {
  beforeEach(() => {
    MockPlayer.mockClear();
    MockDice.mockClear();
  });

  test("sets intitial values and creates the dice on instantiation", () => {
    const gameState = new GameState(fakeConfig);

    expect(gameState.config).toEqual(fakeConfig);
    expect(gameState.turn).toBe(0);
    expect(gameState.currentPlayerIndex).toBe(0);
    expect(gameState.rollNumber).toBe(0);
    expect(gameState.mode).toBe(GameMode.MAIN_MENU);
    expect(gameState.modeHistory).toEqual([]);
    expect(gameState.players).toEqual([]);
    expect(gameState.dice).toBeInstanceOf(MockDice);
  });

  describe("addPlayer", () => {
    beforeEach(() => {
      MockPlayer.mockClear();
    });

    test("adds player with given name", () => {
      const gameState = new GameState(fakeConfig);
      gameState.addPlayer("Player 1");

      expect(MockPlayer).toHaveBeenCalledTimes(1);
      expect(MockPlayer).toHaveBeenCalledWith("Player 1");
      expect(gameState.players).toHaveLength(1);
      expect(gameState.players[0]).toBeInstanceOf(MockPlayer);
    });

    test("adds a player when there are existing players", () => {
      const gameState = new GameState(fakeConfig);
      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");

      expect(MockPlayer).toHaveBeenCalledTimes(2);
      expect(MockPlayer).toHaveBeenCalledWith("Player 1");
      expect(MockPlayer).toHaveBeenCalledWith("Player 2");
      expect(gameState.players).toHaveLength(2);
      expect(gameState.players[0]).toBeInstanceOf(MockPlayer);
      expect(gameState.players[1]).toBeInstanceOf(MockPlayer);
    });
  });

  describe("initSinglePlayer", () => {
    test("adds a player called player 1", () => {
      const gameState = new GameState(fakeConfig);

      const spy = jest.spyOn(gameState, "addPlayer");

      gameState.initSinglePlayer();

      expect(spy).toHaveBeenCalledWith("Player 1");
    });
  });

  describe("getDiceRollsLeft", () => {
    test("returns the number of rolls left", () => {
      const gameState = new GameState(fakeConfig);

      expect(gameState.getDiceRollsLeft()).toBe(4);
    });

    test("returns the number of rolls left after rolling", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setRollNumber(2);

      expect(gameState.getDiceRollsLeft()).toBe(2);
    });
  });

  describe("getCurrentPlayer", () => {
    beforeEach(() => {
      MockPlayer.mockClear();
    });

    test("returns the current player", () => {
      const gameState = new GameState(fakeConfig);

      gameState.addPlayer("Player 1");

      expect(gameState.getCurrentPlayer()).toBeInstanceOf(MockPlayer);
      expect(gameState.getCurrentPlayer()).toBe(gameState.players[0]);
    });

    test("returns the current player for multiplayer game", () => {
      const gameState = new GameState(fakeConfig);

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");

      gameState.setCurrentPlayer(1);

      expect(gameState.getCurrentPlayer()).toBeInstanceOf(MockPlayer);
      expect(gameState.getCurrentPlayer()).toBe(gameState.players[1]);
    });
  });

  describe("setTurn", () => {
    test("sets the turn", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setTurn(3);

      expect(gameState.turn).toBe(3);
    });
  });

  describe("setRollNumber", () => {
    test("sets the roll number", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setRollNumber(3);

      expect(gameState.rollNumber).toBe(3);
    });
  });

  describe("setCurrentPlayer", () => {
    test("sets the current player index", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setCurrentPlayer(1);
      
      expect(gameState.currentPlayerIndex).toBe(1);
    });
  });

  describe("incrementTurn", () => {
    test("increments the turn", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setTurn(2);
      gameState.incrementTurn();

      expect(gameState.turn).toBe(3);
    });
  });

  describe("incrementRollNumber", () => {
    test("increments the roll number", () => {
      const gameState = new GameState(fakeConfig);

      gameState.setRollNumber(4);
      gameState.incrementRollNumber();

      expect(gameState.rollNumber).toBe(5);
    });
  });

  describe("setMode", () => {
    test("sets the mode and adds previous mode to history when history is empty", () => {
      const gameState = new GameState(fakeConfig);

      gameState.mode = GameMode.MAIN_MENU;

      gameState.setMode(GameMode.NEW_GAME);

      expect(gameState.mode).toBe(GameMode.NEW_GAME);
      expect(gameState.modeHistory).toEqual([GameMode.MAIN_MENU]);
    });

    test("sets the mode and adds previous mode to history when history has entries", () => {
      const gameState = new GameState(fakeConfig);

      gameState.mode = GameMode.MAIN_MENU;
      gameState.modeHistory = [GameMode.ROLL, GameMode.VIEW_SCORE];

      gameState.setMode(GameMode.NEW_GAME);

      expect(gameState.modeHistory).toEqual([GameMode.MAIN_MENU, GameMode.ROLL, GameMode.VIEW_SCORE]);
    });
  });

  describe("revertMode", () => {
    test("sets the mode to the first history entry and adds previous mode to history", () => {
      const gameState = new GameState(fakeConfig);

      gameState.mode = GameMode.MAIN_MENU;
      gameState.modeHistory = [GameMode.ROLL, GameMode.VIEW_SCORE];

      gameState.revertMode();

      expect(gameState.mode).toBe(GameMode.ROLL);
      expect(gameState.modeHistory).toEqual([GameMode.MAIN_MENU, GameMode.ROLL, GameMode.VIEW_SCORE]);
    });
  });

  describe("resetGame", () => {
    test("resets the game state including each player state", () => {
      const gameState = new GameState(fakeConfig);

      // Change the initial game state
      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setMode(GameMode.NEW_GAME);
      gameState.setMode(GameMode.EDIT_SCORE_JOKER);
      gameState.setTurn(4);
      gameState.setRollNumber(2);
      gameState.setCurrentPlayer(1);

      gameState.resetGame();

      expect(gameState.players).toHaveLength(2);
      expect(gameState.modeHistory).toEqual([]);
      expect(gameState.turn).toBe(0);
      expect(gameState.rollNumber).toBe(0);
      expect(gameState.currentPlayerIndex).toBe(0);
      
      const mockDiceInstance = MockDice.mock.instances[0];
      expect(mockDiceInstance.reset).toHaveBeenCalledTimes(1);

      gameState.players.forEach(player => {
        expect(player.resetScore).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("newGame", () => {
    test("resets the game state and removes players", () => {
      const gameState = new GameState(fakeConfig);

      // Change the initial game state
      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setMode(GameMode.NEW_GAME);
      gameState.setMode(GameMode.EDIT_SCORE_JOKER);
      gameState.setTurn(4);
      gameState.setRollNumber(2);
      gameState.setCurrentPlayer(1);

      gameState.newGame();

      expect(gameState.players).toHaveLength(0);
      expect(gameState.modeHistory).toEqual([]);
      expect(gameState.turn).toBe(0);
      expect(gameState.rollNumber).toBe(0);
      expect(gameState.currentPlayerIndex).toBe(0);
      
      const mockDiceInstance = MockDice.mock.instances[0];
      expect(mockDiceInstance.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe("renderPlayerScores", () => {
    const log = jest.spyOn(console, "log").mockImplementation(() => {});

    beforeEach(() => {
      log.mockClear();
    });

    test("renders the player scores", () => {
      const gameState = new GameState(fakeConfig);
      
      const mockPlayer = {
        name: "",
        totalScore: 0,
        score: null,
        setScore: jest.fn(),
        resetScore: jest.fn(),
        renderScoresheet: jest.fn(),
        toJSON: jest.fn(),
      }

      MockPlayer
        .mockImplementationOnce((name) => ({ ...mockPlayer, name, totalScore: 10 }))
        .mockImplementationOnce((name) => ({ ...mockPlayer, name, totalScore: 20 }));

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");

      gameState.renderPlayerScores();
    
      expect(log).toHaveBeenCalledWith(`╔══════════╤══════════╗
║ Player 1 │ Player 2 ║
╟──────────┼──────────╢
║ 10       │ 20       ║
╚══════════╧══════════╝`)
    });
  });

  describe("winner", () => {
    test("gets the player with the highest score", () => {
      const gameState = new GameState(fakeConfig);
      
      const mockPlayer = {
        name: "",
        totalScore: 0,
        score: null,
        setScore: jest.fn(),
        resetScore: jest.fn(),
        renderScoresheet: jest.fn(),
        toJSON: jest.fn(),
      };

      MockPlayer
        .mockImplementationOnce((name) => ({ ...mockPlayer, name, totalScore: 10 }))
        .mockImplementationOnce((name) => ({ ...mockPlayer, name, totalScore: 20 }));

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");

      const winner = gameState.getWinner();

      expect(winner.name).toBe("Player 2");
      expect(winner.totalScore).toBe(20);
    });
  });

  describe("toJSON", () => {
    test("ouputs itself as json", () => {
      const gameState = new GameState(fakeConfig);

      // Change the initial game state
      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setMode(GameMode.NEW_GAME);
      gameState.setMode(GameMode.EDIT_SCORE_JOKER);
      gameState.setTurn(4);
      gameState.setRollNumber(2);
      gameState.setCurrentPlayer(1);

      const json = gameState.toJSON();

      expect(json).toMatchObject({
        turn: 4,
        rollNumber: 2,
        currentPlayerIndex: 1,
        mode: GameMode.EDIT_SCORE_JOKER,
        modeHistory: [GameMode.NEW_GAME, GameMode.MAIN_MENU],
        players: [undefined, undefined],
        dice: undefined,
      });

      const [mockPlayer1, mockPlayer2] = MockPlayer.mock.instances;
      const dice = MockDice.mock.instances[0];

      expect(mockPlayer1.toJSON).toHaveBeenCalledTimes(1);
      expect(mockPlayer2.toJSON).toHaveBeenCalledTimes(1);
      expect(dice.toJSON).toHaveBeenCalledTimes(1);
    });
  });

  describe("nextPlayer", () => {
    test("sets the current player to the next player", () => {
      const gameState = new GameState(fakeConfig);

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setRollNumber(1);
      gameState.setTurn(2);

      gameState.nextPlayer();

      const dice = MockDice.mock.instances[0];

      expect(gameState.currentPlayerIndex).toBe(1);
      expect(gameState.mode).toBe(GameMode.VIEW_SCORE);
      expect(gameState.turn).toBe(2);
      expect(gameState.rollNumber).toBe(0);
      expect(dice.reset).toHaveBeenCalledTimes(1);
    });

    test("sets the current player to the first player and increments the turn if the last player has rolled", () => {
      const gameState = new GameState(fakeConfig);

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setRollNumber(1);
      gameState.setTurn(2);
      gameState.setCurrentPlayer(1);

      gameState.nextPlayer();

      const dice = MockDice.mock.instances[0];

      expect(gameState.currentPlayerIndex).toBe(0);
      expect(gameState.mode).toBe(GameMode.VIEW_SCORE);
      expect(gameState.turn).toBe(3);
      expect(gameState.rollNumber).toBe(0);
      expect(dice.reset).toHaveBeenCalledTimes(1);
    });

    test("sets the current player to null and the mode to game over if the last player has rolled for the last turn", () => {
      const gameState = new GameState(fakeConfig);

      gameState.addPlayer("Player 1");
      gameState.addPlayer("Player 2");
      gameState.setRollNumber(1);
      gameState.setTurn(14);
      gameState.setCurrentPlayer(1);

      gameState.nextPlayer();

      const dice = MockDice.mock.instances[0];

      expect(gameState.currentPlayerIndex).toBe(null);
      expect(gameState.mode).toBe(GameMode.GAME_OVER);
      expect(gameState.turn).toBe(14);
      expect(gameState.rollNumber).toBe(0);
      expect(dice.reset).toHaveBeenCalledTimes(1);
    });
  });
});
