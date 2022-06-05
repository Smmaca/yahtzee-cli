import { YahtzeeScoreCategory } from "./types";

export default {
  diceCount: 5,
  rollsPerTurn: 3,
  messages: {
    rollPrompt: "What do you want to do?",
    diceLockPrompt: "Which dice do you want to lock? (press space to toggle lock status)",
    scoreDicePrompt: "Which category do you want to score?",
    scoreJokerPrompt: "Which category do you want to score a joker in?",
    scoresheetPrompt: "What do you want to do?",
    playAgainPrompt: "Do you want to play again?",
    quitConfirmPrompt: "Are you sure you want to quit?",
  },
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: 25,
    [YahtzeeScoreCategory.SmallStraight]: 30,
    [YahtzeeScoreCategory.LargeStraight]: 40,
    [YahtzeeScoreCategory.Yahtzee]: 50,
    [YahtzeeScoreCategory.BonusYahtzees]: 100,
  },
};
