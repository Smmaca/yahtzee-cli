import Table from "cli-table";
import Player from "./Player";
import { IConfig, Screen } from "../types";
import { IDice } from "./dice/types";

export default class GameState {
  config: IConfig;

  turn: number;
  currentPlayerIndex: number;
  rollNumber: number;
  screenHistory: Screen[];

  players: Player[];
  dice: IDice;

  constructor(config: IConfig, dice: IDice) {
    this.config = config;

    this.turn = 0;
    this.currentPlayerIndex = 0;
    this.rollNumber = 0;
    this.screenHistory = [];
    this.players = [];

    this.dice = dice;
  }

  initSinglePlayer() {
    this.addPlayer("Player 1");
  }

  getDiceRollsLeft() {
    return this.config.rollsPerTurn - this.rollNumber;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  addPlayer(name: string) {
    this.players.push(new Player(name));
  }

  nextPlayer(): boolean {
    let gameOver = false;
    if (this.currentPlayerIndex === this.players.length - 1) {
      if (this.turn === this.config.turns - 1) {
        // Last turn for last player
        this.setCurrentPlayer(null);
        gameOver = true;
      } else {
        // Last player for this turn
        this.setCurrentPlayer(0);
        this.incrementTurn();
      }
    } else {
      this.incrementPlayer();
    }
    this.dice.reset();
    this.setRollNumber(0);
    return gameOver;
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
  
  addScreenToHistory(screen: Screen) {
    this.screenHistory.push(screen);
  }

  resetGame() {
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

  getWinner() {
    return this.players.slice().sort((a, b) => b.totalScore - a.totalScore)[0];
  }

  toJSON() {
    return {
      turn: this.turn,
      currentPlayerIndex: this.currentPlayerIndex,
      rollNumber: this.rollNumber,
      screenHistory: this.screenHistory,
      players: this.players.map(player => player.toJSON()),
      dice: this.dice.toJSON(),
    };
  }
}