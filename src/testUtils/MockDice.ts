import Dice from "../modules/dice/Dice";

const mockDice: Dice = {
  diceCount: 5,
  values: [0, 0, 0, 0, 0],
  lock: [false, false, false, false, false],
  unlockedDiceCount: 5,
  roll: jest.fn(),
  setValues: jest.fn(),
  setLock: jest.fn(),
  reset: jest.fn(),
  resetValues: jest.fn(),
  resetLock: jest.fn(),
  toJSON: jest.fn(),
};

export default mockDice as jest.Mocked<typeof mockDice>;
