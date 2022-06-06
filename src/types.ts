
export enum GameMode {
  ROLL = "ROLL",
  DICE_LOCKER = "DICE_LOCKER",
  VIEW_SCORE = "VIEW_SCORE",
  EDIT_SCORE = "EDIT_SCORE",
  EDIT_SCORE_JOKER = "EDIT_SCORE_JOKER",
  GAME_OVER = "GAME_OVER",
  QUIT_CONFIRM = "QUIT_CONFIRM",
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
  modeHistory: GameMode[];
  turn: number;
  diceRoll: number[];
  diceLock: boolean[];
  rollNumber: number;
  score: YahtzeeScore;
};

export enum RollModeChoice {
  ROLL_DICE = "Roll dice",
  ROLL_AGAIN = "Roll again",
  LOCK_DICE = "Lock dice",
  SCORE_DICE = "Score dice",
  SEE_SCORESHEET = "See scoresheet",
  QUIT = "Quit",
}
