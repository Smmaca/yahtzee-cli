import Table from "cli-table";
import Dice from "./Dice";
import Player from "./Player";
import { GameMode, IConfig } from "./types";

export default class GameState {
  config: IConfig;

  turn: number;
  currentPlayerIndex: number;
  rollNumber: number;
  mode: GameMode;
  modeHistory: GameMode[];

  players: Player[];
  dice: Dice;

  constructor(config: IConfig) {
    this.config = config;

    this.turn = 0;
    this.currentPlayerIndex = 0;
    this.rollNumber = 0;
    this.mode = GameMode.MAIN_MENU;
    this.modeHistory = [];
    this.players = [];

    this.dice = new Dice();
  }

  initSinglePlayer() {
    this.addPlayer("Player 1");
  }

  get diceRollsLeft() {
    return this.config.rollsPerTurn - this.rollNumber;
  }

  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  addPlayer(name: string) {
    this.players.push(new Player(name));
  }

  nextPlayer() {
    if (this.currentPlayerIndex === this.players.length - 1) {
      if (this.turn === this.config.turns - 1) {
        // Last turn for last player
        this.setCurrentPlayer(null);
        this.setMode(GameMode.GAME_OVER);
      } else {
        // Last player for this turn
        this.setCurrentPlayer(0);
        this.incrementTurn();
        this.setMode(GameMode.VIEW_SCORE);
      }
    } else {
      this.incrementPlayer();
      this.setMode(GameMode.VIEW_SCORE);
    }
    this.dice.reset();
    this.setRollNumber(0);
  }

  incrementTurn() {
    this.setTurn(this.turn + 1);
  }

  incrementPlayer() {
    this.setCurrentPlayer(this.currentPlayerIndex + 1);
  }

  incrementRollNumber() {
    this.setRollNumber(this.rollNumber + 1);
  }

  setTurn(turn: number) {
    this.turn = turn;
  }

  setCurrentPlayer(index: number) {
    this.currentPlayerIndex = index;
  }

  setRollNumber(rollNumber: number) {
    this.rollNumber = rollNumber;
  }

  setMode(mode: GameMode) {
    this.modeHistory.unshift(this.mode);
    this.mode = mode;
  }

  revertMode() {
    const currentMode = this.mode;
    this.mode = this.modeHistory[0];
    this.modeHistory.unshift(currentMode);
  }

  resetGame() {
    this.modeHistory = [];
    this.turn = 0;
    this.currentPlayerIndex = 0;
    this.rollNumber = 0;
    this.dice.reset();

    this.players.forEach(player => player.resetScore());
  }

  newGame() {
    this.resetGame();
    this.players = [];
  }

  renderPlayerScores() {
    const table = new Table({
      chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
    });

    table.push(
      this.players.map(player => player.name),
      this.players.map(player => player.totalScore),
    );

    console.log(table.toString());
  }

  get winner() {
    return this.players.slice().sort((a, b) => b.totalScore - a.totalScore)[0];
  }

  toJSON() {
    return {
      turn: this.turn,
      currentPlayerIndex: this.currentPlayerIndex,
      rollNumber: this.rollNumber,
      mode: this.mode,
      modeHistory: this.modeHistory,
      players: this.players.map(player => player.toJSON()),
      dice: this.dice.toJSON(),
    };
  }
}