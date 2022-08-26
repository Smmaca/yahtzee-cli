import GameState from "../modules/GameState";
import { DiceDesign } from "../utils/diceDesigns";
import mockConfig from "./MockConfig";
import mockDice from "./MockDice";
import mockPlayer from "./MockPlayer";

const mockGameState: GameState = {
  config: mockConfig,
  turn: 0,
  currentPlayerIndex: 0,
  rollNumber: 0,
  screenHistory: [],
  players: [mockPlayer],
  dice: mockDice,
  diceDesign: DiceDesign.CLASSIC,
  getDiceRollsLeft: jest.fn(),
  getCurrentPlayer: jest.fn(),
  initSinglePlayer: jest.fn(),
  addPlayer: jest.fn(),
  nextPlayer: jest.fn(),
  incrementTurn: jest.fn(),
  incrementRollNumber: jest.fn(),
  incrementPlayer: jest.fn(),
  setTurn: jest.fn(),
  setCurrentPlayer: jest.fn(),
  setRollNumber: jest.fn(),
  addScreenToHistory: jest.fn(),
  resetGame: jest.fn(),
  newGame: jest.fn(),
  renderPlayerScores: jest.fn(),
  getWinner: jest.fn(),
  toJSON: jest.fn(),
};

export default mockGameState as jest.Mocked<typeof mockGameState>;
