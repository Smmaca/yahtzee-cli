import { IConfig, YahtzeeScoreCategory } from "../types";

const mockConfig: IConfig = {
  rollsPerTurn: 3,
  turns: 14,
  maxPlayers: 4,
  scoreValues: {
    [YahtzeeScoreCategory.FullHouse]: 25,
    [YahtzeeScoreCategory.SmallStraight]: 30,
    [YahtzeeScoreCategory.LargeStraight]: 40,
    [YahtzeeScoreCategory.Yahtzee]: 50,
    [YahtzeeScoreCategory.YahtzeeBonus]: 100,
  },
  messages: {
    addPlayerPrompt: "add player prompt",
    mainMenuPrompt: "main menu prompt",
    gameActionPrompt: "game action prompt",
    statisticsPrompt: "statistics prompt",
    diceLockPrompt: "dice lock prompt",
    gameOverPrompt: "game over prompt",
    newGamePrompt: "new game prompt",
    newMultiplayerGamePrompt: "new multiplayer game prompt",
    scoreDicePrompt: "score dice prompt",
    scoreJokerPrompt: "score joker prompt",
    scoresheetPrompt: "scoresheet prompt",
    playAgainPrompt: "play again prompt",
    quitConfirmPrompt: "quit confirm prompt",
    quitToMainMenuConfirmPrompt: "quit to main menu confirm prompt",
  },
};

export default mockConfig as jest.Mocked<typeof mockConfig>;
