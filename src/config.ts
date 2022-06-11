import { IConfig, YahtzeeScoreCategory } from "./types";

const config: IConfig = {
  rollsPerTurn: 3,
  turns: 13,
  maxPlayers: 4,
  messages: {
    mainMenuPrompt: "Main menu",
    statisticsPrompt: "Statistics",
    newGamePrompt: "What kind of game do you want to play?",
    newMultiplayerGamePrompt: "Add a player or start the game",
    addPlayerPrompt: "Enter player name",
    rollPrompt: "What do you want to do?",
    diceLockPrompt: "Which dice do you want to lock? (press space to toggle lock status)",
    scoreDicePrompt: "Which category do you want to score?",
    scoreJokerPrompt: "Which category do you want to score a joker in?",
    scoresheetPrompt: "What do you want to do?",
    playAgainPrompt: "Do you want to play again?",
    quitConfirmPrompt: "Are you sure you want to quit?",
    quitToMainMenuConfirmPrompt: "Are you sure you want to quit to main menu?",
    gameOverPrompt: "Game over!",
  },
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: 25,
    [YahtzeeScoreCategory.SmallStraight]: 30,
    [YahtzeeScoreCategory.LargeStraight]: 40,
    [YahtzeeScoreCategory.Yahtzee]: 50,
    [YahtzeeScoreCategory.YahtzeeBonus]: 100,
  },
};

export default config;
