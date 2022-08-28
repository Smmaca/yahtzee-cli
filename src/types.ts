
export enum Screen {
  MAIN_MENU = "mainMenu",
  NEW_GAME = "newGameMenu",
  QUIT_CONFIRM = "quitConfirm",
  STATISTICS = "statistics",
  ACHIEVEMENTS = "achievements",
  SETTINGS = "settings",
  NEW_MULTIPLAYER_GAME = "newMultiplayerGame",
  ADD_PLAYER = "addPlayer",
  GAME_ACTION = "gameAction",
  SCORESHEET = "scoresheet",
  LOCK_DICE = "lockDice",
  SCORE_DICE = "scoreDice",
  GAME_OVER_SINGLE_PLAYER = "gameOverSinglePlayer",
  GAME_OVER_MULTIPLAYER = "gameOverMultiplayer",
  DICE_DESIGNER = "diceDesigner",
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
  YahtzeeBonus = "yahtzeeBonus",
}

export type YahtzeeScore = Record<YahtzeeScoreCategory, number>;

export interface IGame {
  screenHistory: Screen[];
  turn: number;
  diceRoll: number[];
  diceLock: boolean[];
  rollNumber: number;
  score: YahtzeeScore;
};

export interface IConfig {
  debug?: boolean;
  rollsPerTurn: number;
  turns: number;
  maxPlayers: number;
  messages: {
    mainMenuPrompt: string;
    statisticsPrompt: string;
    newGamePrompt: string;
    newMultiplayerGamePrompt: string;
    addPlayerPrompt: string;
    gameActionPrompt: string;
    diceLockPrompt: string;
    scoreDicePrompt: string;
    scoreJokerPrompt: string;
    scoresheetPrompt: string;
    playAgainPrompt: string;
    quitConfirmPrompt: string;
    quitToMainMenuConfirmPrompt: string;
    gameOverPrompt: string;
    diceDesignerPrompt: string;
    settingsPrompt: string;
    achievementsPrompt: string;
  };
  achievements: {
    [key in Achievement]: { label: string; description: string };
  },
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: number;
    [YahtzeeScoreCategory.SmallStraight]: number;
    [YahtzeeScoreCategory.LargeStraight]: number;
    [YahtzeeScoreCategory.Yahtzee]: number;
    [YahtzeeScoreCategory.YahtzeeBonus]: number;
    topSectionBonusThreshold: number;
    topSectionBonus: number;
  };
  dataFolder: string;
  statsFilename: string;
  settingsFilename: string;
  achievementsFilename: string;
}

export enum Achievement {
  UNDER_ACHIEVER = "underAchiever", // get score of 5
  YAHTZEE = "yahtzee", // get a yahtzee
  JOKER = "joker", // get two yahtzees in a single game
  TRIPLE_THREAT = "tripleThreat", // get three yahtzees in a single game
  ON_TOP = "onTop", // get the upper section bonus
  BRONZE = "bronze", // get a score over 250
  SILVER = "silver", // get a score over 300
  GOLD = "gold", // get a score over 400
  PLATINUM = "platinum", // get a score over 500
  DIAMOND = "diamond", // get a score over 600
  MASTER = "master", // get a score over 700
  CONFIDENT = "confident", // get a score over 250 without rerolling
  FORTUNE = "fortune", // score 30 points in chance
  ROLLERCOASTER = "rollercoaster", // score a 0 for a joker
}