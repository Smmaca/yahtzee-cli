
export enum GameMode {
  ROLL = "ROLL",
  DICE_LOCKER = "DICE_LOCKER",
  VIEW_SCORE = "VIEW_SCORE",
  EDIT_SCORE = "EDIT_SCORE",
  GAME_OVER = "GAME_OVER",
}

export enum YahtzeeScoreCategory {
  Ones = "ones",
  Twos = "twos",
  Threes = "threes",
  Fours = "fours",
  Fives = "fives",
  Sixes = "sixes",
  ThreeOfAKind = "threeOfAKind",
  FourOfAKind = "fourOfAKind",
  FullHouse = "fullHouse",
  SmallStraight = "smallStraight",
  LargeStraight = "largeStraight",
  Yahtzee = "yahtzee",
  Chance = "chance",
  BonusYahtzees = "bonusYahtzees",
}

export type YahtzeeScore = Record<YahtzeeScoreCategory, number>;

export interface IGame {
  mode: GameMode;
  turn: number;
  diceRoll: number[];
  diceLock: boolean[];
  rollNumber: number;
  score: YahtzeeScore;
};
