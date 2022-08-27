import { Achievement, IConfig, YahtzeeScoreCategory } from "./types";

const config: IConfig = {
  debug: true,
  rollsPerTurn: 3,
  turns: 13,
  maxPlayers: 4,
  messages: {
    mainMenuPrompt: "Main menu",
    statisticsPrompt: "Statistics",
    newGamePrompt: "What kind of game do you want to play?",
    newMultiplayerGamePrompt: "Add a player or start the game",
    addPlayerPrompt: "Enter player name",
    gameActionPrompt: "What do you want to do?",
    diceLockPrompt: "Which dice do you want to lock? (press space to toggle lock status)",
    scoreDicePrompt: "Which category do you want to score?",
    scoreJokerPrompt: "Which category do you want to score a joker in?",
    scoresheetPrompt: "What do you want to do?",
    playAgainPrompt: "Do you want to play again?",
    quitConfirmPrompt: "Are you sure you want to quit?",
    quitToMainMenuConfirmPrompt: "Are you sure you want to quit to main menu?",
    gameOverPrompt: "Game over!",
    diceDesignerPrompt: "Choose a dice design",
    settingsPrompt: "Settings",
  },
  achievements: {
    [Achievement.UNDER_ACHIEVER]: {
      label: "Under-Achiever",
      description: "Get the lowest possible score",
    },
    [Achievement.YAHTZEE]: {
      label: "Yahtzee!",
      description: "Get a yahtzee",
    },
    [Achievement.JOKER]: {
      label: "Joker",
      description: "Get two yahtzees in a single game",
    },
    [Achievement.TRIPLE_THREAT]: {
      label: "Triple Threat",
      description: "Get three yahtzees in a single game",
    },
    [Achievement.ON_TOP]: {
      label: "On Top",
      description: "Get the upper section bonus",
    },
    [Achievement.BRONZE]: {
      label: "Bronze",
      description: "Get a score over 250",
    },
    [Achievement.SILVER]: {
      label: "Silver",
      description: "Get a score over 300",
    },
    [Achievement.GOLD]: {
      label: "Gold",
      description: "Get a score over 400",
    },
    [Achievement.PLATINUM]: {
      label: "Platinum",
      description: "Get a score over 500",
    },
    [Achievement.DIAMOND]: {
      label: "Diamond",
      description: "Get a score over 600",
    },
    [Achievement.MASTER]: {
      label: "Master",
      description: "Get a score over 700",
    },
    [Achievement.CONFIDENT]: {
      label: "Confident",
      description: "Get a score over 250 without rerolling",
    },
    [Achievement.LUCKY]: {
      label: "Lucky",
      description: "Score 30 points in chance",
    },
    [Achievement.ROLLERCOASTER]: {
      label: "Rollercoaster",
      description: "Score a 0 for a joker",
    }
  },
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: 25,
    [YahtzeeScoreCategory.SmallStraight]: 30,
    [YahtzeeScoreCategory.LargeStraight]: 40,
    [YahtzeeScoreCategory.Yahtzee]: 50,
    [YahtzeeScoreCategory.YahtzeeBonus]: 100,
  },
  dataFolder: "data",
  statsFilename: "stats.json",
  settingsFilename: "settings.json",
};

export default config;
