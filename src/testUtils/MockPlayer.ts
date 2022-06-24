import Player, { defaultScore } from "../Player";

const mockPlayer: Player = {
  name: "Player 1",
  totalScore: 0,
  score: defaultScore,
  setScore: jest.fn(),
  resetScore: jest.fn(),
  renderScoresheet: jest.fn(),
  toJSON: jest.fn(),
};

export default mockPlayer as jest.Mocked<typeof mockPlayer>;