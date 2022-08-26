
export enum Screen {
  MAIN_MENU = "mainMenu",
  NEW_GAME = "newGameMenu",
  QUIT_CONFIRM = "quitConfirm",
  STATISTICS = "statistics",
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
  };
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: number;
    [YahtzeeScoreCategory.SmallStraight]: number;
    [YahtzeeScoreCategory.LargeStraight]: number;
    [YahtzeeScoreCategory.Yahtzee]: number;
    [YahtzeeScoreCategory.YahtzeeBonus]: number;
  };
  dataFolder: string;
  statsFilename: string;
  settingsFilename: string;
}