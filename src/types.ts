
export enum GameMode {
  MAIN_MENU = "MAIN_MENU",
  ROLL = "ROLL",
  DICE_LOCKER = "DICE_LOCKER",
  VIEW_SCORE = "VIEW_SCORE",
  EDIT_SCORE = "EDIT_SCORE",
  EDIT_SCORE_JOKER = "EDIT_SCORE_JOKER",
  GAME_OVER = "GAME_OVER",
  QUIT_CONFIRM = "QUIT_CONFIRM",
  QUIT_TO_MAIN_MENU_CONFIRM = "QUIT_TO_MAIN_MENU_CONFIRM",
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
  QUIT_TO_MAIN_MENU = "Quit to main menu",
  QUIT = "Quit",
}

export interface IConfig {
  rollsPerTurn: number;
  turns: number;
  messages: {
    mainMenuPrompt: string;
    rollPrompt: string;
    diceLockPrompt: string;
    scoreDicePrompt: string;
    scoreJokerPrompt: string;
    scoresheetPrompt: string;
    playAgainPrompt: string;
    quitConfirmPrompt: string;
    quitToMainMenuConfirmPrompt: string;
    gameOverPrompt: string;
  };
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: number;
    [YahtzeeScoreCategory.SmallStraight]: number;
    [YahtzeeScoreCategory.LargeStraight]: number;
    [YahtzeeScoreCategory.Yahtzee]: number;
    [YahtzeeScoreCategory.BonusYahtzees]: number;
  };
}