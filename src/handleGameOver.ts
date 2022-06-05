import Confirm from "enquirer/lib/prompts/Confirm";
import config from "./config";
import { resetDiceLock } from "./handleDiceLockMode";
import { resetDiceRoll } from "./handleScoreDiceMode";
import { GameMode, IGame } from "./types";
import Scoresheet from "./utils/Scoresheet";

export function resetScore(game: IGame) {
  game.score = {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
    bonusYahtzees: 0,
  };
  return game;
}

function resetGame(game: IGame) {
  game.mode = GameMode.ROLL;
  game.modeHistory = [];
  game.turn = 0;
  game.rollNumber = 0;
  resetScore(game);
  resetDiceRoll(game);
  resetDiceLock(game);
}

export default function handleGameOver(game: IGame) {
  const _game = { ...game };

  const scoresheet = new Scoresheet({ diceRoll: _game.diceRoll, score: _game.score }); 

  console.log("Game over!\n");

  scoresheet.render();

  const prompt = new Confirm({
    name: "playAgain",
    message: config.messages.playAgainPrompt,
  });

  return prompt.run().then(playAgain => {
    if (playAgain) {
      resetGame(_game);
      return _game;
    }
    return;
  });
}