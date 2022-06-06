import { GameMode, IGame } from "./types";
import Game from "./Game";

const gameData: IGame = {
  turn: 0,
  diceRoll: [],
  diceLock: [],
  rollNumber: 0,
  mode: GameMode.ROLL,
  modeHistory: [],
  score: {
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
  },
};

const game = new Game(gameData);

game.init();

game.loop();
