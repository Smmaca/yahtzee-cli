import clear from "clear";
import util from "util";
import { GameMode, IConfig, RollModeChoice, YahtzeeScoreCategory } from "../types";
import { drawDiceValues, drawTitle, drawTurnStats } from "../utils/draw";
import { scoreLabels } from "./Scoresheet";
import GameState from "./GameState";
import DiceScorer from "./DiceScorer";
import BasePrompter, { IChoice } from "../prompters/BasePrompter";
import DataLoader, { StatsData } from "./DataLoader";


export default class Game {
  config: IConfig;
  state: GameState;
  prompter: BasePrompter;

  statsLoader: DataLoader<StatsData>;

  constructor(config: IConfig, prompter: BasePrompter) {
    this.config = config;
    this.prompter = prompter;
    this.state = new GameState(config);
    this.statsLoader = new DataLoader("data", "stats.json", {
      scores: [],
    });
  }

  init() {
    this.statsLoader.init();
  }

  async loop() {
    clear();

    drawTitle();

    let continueLoop = true;

    try {
      switch(this.state.mode) {
        case GameMode.MAIN_MENU:
          continueLoop = await this.handleMainMenu();
          break;
        case GameMode.STATISTICS:
          continueLoop = await this.handleStatistics();
          break;
        case GameMode.NEW_GAME:
          continueLoop = await this.handleNewGame();
          break;
        case GameMode.NEW_MULTIPLAYER_GAME:
          continueLoop = await this.handleNewMultiplayerGame();
          break;
        case GameMode.ADD_PLAYER:
          continueLoop = await this.handleAddPlayer();
          break;
        case GameMode.ROLL:
          continueLoop = await this.handleRollMode();
          break;
        case GameMode.DICE_LOCKER:
          continueLoop = await this.handleDiceLockMode();
          break;
        case GameMode.VIEW_SCORE:
          continueLoop = await this.handleScoresheetMode();
          break;
        case GameMode.EDIT_SCORE:
          continueLoop = await this.handleScoreDiceMode();
          break;
        case GameMode.EDIT_SCORE_JOKER:
          continueLoop = await this.handleScoreJokerMode();
          break;
        case GameMode.GAME_OVER:
          continueLoop = await this.handleGameOver();
          break;
        case GameMode.QUIT_TO_MAIN_MENU_CONFIRM:
          continueLoop = await this.handleQuitToMainMenuConfirm();
          break;
        case GameMode.QUIT_CONFIRM:
          continueLoop = await this.handleQuitConfirm();
          break;
        default:
          continueLoop = true;
      }
    } catch (err) {
      if (this.config.debug) {
        console.log(util.inspect(this.state.toJSON(), { showHidden: false, depth: null }));
        console.error(err);
      } else {
        console.error("Something went wrong :(");
      }
      return process.exit(1);
    }

    return continueLoop && this.loop();
  }

  async handleMainMenu(): Promise<boolean> {
    // Draw stuff

    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "mainMenu",
      message: this.config.messages.mainMenuPrompt,
      choices: [
        { name: "New game" },
        { name: "See stats"},
        { name: "Quit" },
      ],
    });

    // Handle input
    if (answer === "New game") {
      this.state.setMode(GameMode.NEW_GAME);
      return true;
    }
    if (answer === "See stats") {
      this.state.setMode(GameMode.STATISTICS);
      return true;
    }
    if (answer === "Quit") {
      this.state.setMode(GameMode.QUIT_CONFIRM);
      return true;
    }
    return true;
  }

  async handleStatistics(): Promise<boolean> {
    // Draw stuff
    const stats = this.statsLoader.getData();
    console.log(`Games played: ${stats.scores.length}`);
    console.log(`High score: ${stats.scores.sort((a, b) => b.score - a.score)[0].score}`);
    console.log(`Low score: ${stats.scores.sort((a, b) => a.score - b.score)[0].score}`);
    console.log(`Average score: ${Math.round(stats.scores.reduce((acc, cur) => acc + cur.score, 0) / stats.scores.length * 10) / 10}`);
    console.log(" ");

    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "statistics",
      message: this.config.messages.statisticsPrompt,
      choices: [
        { name: "Back" },
        { name: "Clear stats" },
      ],
    });

    // Handle input
    if (answer === "Back") {
      this.state.revertMode();
      return true;
    }
    if (answer === "Clear stats") {
      this.statsLoader.setData(this.statsLoader.defaultData);
      return true;
    }
    return true;
  }

  async handleNewGame(): Promise<boolean> {
    // Draw stuff

    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "newGame",
      message: this.config.messages.newGamePrompt,
      choices: [
        { name: "Single player" },
        { name: "Multiplayer" },
        { name: "Cancel" },
      ],
    });

    // Handle input
    if (answer === "Single player") {
      this.state.newGame();
      this.state.initSinglePlayer();
      this.state.setMode(GameMode.ROLL);
      return true;
    }
    if (answer === "Multiplayer") {
      this.state.newGame();
      this.state.setMode(GameMode.NEW_MULTIPLAYER_GAME);
      return true;
    }
    if (answer === "Cancel") {
      this.state.revertMode();
      return true;
    }
    return true;
  }

  getNewMultiplayerGamePromptChoices(): IChoice<string>[] {
    const choices = [];

    if (this.state.players.length < this.config.maxPlayers) {
      choices.push({ name: "Add player" });
    }
    if (this.state.players.length >= 2) {
      choices.push({ name: "Start game" });
    }
    choices.push({ name: "Cancel" });

    return choices;
  }

  async handleNewMultiplayerGame(): Promise<boolean> {
    // Draw stuff
    if (this.state.players.length) {
      this.state.players.forEach((player, i) => console.log(`Player ${i + 1}: ${player.name}`));
    } else {
      console.log("No players added yet");
    }
    console.log("\n");

    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "newMultiplayerGame",
      message: this.config.messages.newMultiplayerGamePrompt,
      choices: this.getNewMultiplayerGamePromptChoices(),
    });

    // Handle input
    if (answer === "Add player") {
      this.state.setMode(GameMode.ADD_PLAYER);
      return true;
    }
    if (answer === "Start game") {
      this.state.setMode(GameMode.ROLL);
      return true;
    }
    if (answer === "Cancel") {
      this.state.setMode(GameMode.NEW_GAME);
      return true;
    }
    return true;
  }

  async handleAddPlayer(): Promise<boolean> {
    // Draw stuff

    // Get input
    const answer = await this.prompter.getInput({
      name: "addPlayer",
      message: this.config.messages.addPlayerPrompt,
      initial: `Player ${this.state.players.length + 1}`,
    });

    // Handle input
    if (answer) {
      this.state.addPlayer(answer);
      this.state.revertMode();
      return true;
    }
    this.state.revertMode();
    return true;
  }

  async handleDiceLockMode(): Promise<boolean> {
    // Draw stuff
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.getCurrentPlayer()?.name, this.state.turn, this.state.getDiceRollsLeft(), diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    const choices = this.state.dice.values.map((value, index) => ({
      name: `${index}`,
      message: `Dice ${index + 1}`,
      hint: `${value}`,
      value: index,
    }));

    // Get input
    const answer = await this.prompter.getInputFromMultiselect({
      name: "diceLockMenu",
      message: this.config.messages.diceLockPrompt,
      limit: 5,
      choices,
      initial: choices.filter((_, i) => this.state.dice.lock[i]).map((choice) => choice.name),
    });
  
    // Handle input
    this.state.dice.resetLock();
    const indicesToLock = Object.keys(answer).map(key => answer[key]);
    const diceLock = this.state.dice.values.map((_, i) => indicesToLock.includes(i));
    this.state.dice.setLock(diceLock);
    this.state.setMode(GameMode.ROLL);
    return true;
  }

  getGameOverPromptChoices() {
    const choices: any[] = [
      {
        name: "See final scores",
        value: "See final scores",
      }
    ];
    
    this.state.players.forEach((player, i) => {
      choices.push({
        name: player.name,
        value: i,
        message: `See ${player.name}'s scoresheet`,
      });
    });

    choices.push(
      { name: "Play again", value: "Play again" },
      { name: "Quit", value: "Quit" },
    );

    return choices;
  }

  async handleSinglePlayerGameOver(): Promise<boolean> {
    // Draw stuff
    const player = this.state.players[0];

    console.log("Game over!\n");
    player.renderScoresheet();

    // Get input
    const playAgain = await this.prompter.getInputFromConfirm({
      name: "playAgain",
      message: this.config.messages.playAgainPrompt,
    });

    // Handle input
    if (playAgain) {
      this.state.resetGame();
      this.state.setMode(GameMode.ROLL);
      return true;
    }
    this.state.setMode(GameMode.MAIN_MENU);
    return true;
  }

  async handleMultiplayerGameOver(): Promise<boolean> {
    // Draw stuff
    if (this.state.currentPlayerIndex !== null) {
      this.state.getCurrentPlayer().renderScoresheet();
    } else {
      console.log(`${this.state.getWinner().name} wins!`);
      this.state.renderPlayerScores();
    }

    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "gameOverMenu",
      message: this.config.messages.gameOverPrompt,
      choices: this.getGameOverPromptChoices(),
    });

    // Handle input
    if (answer === "Play again") {
      this.state.resetGame();
      this.state.setMode(GameMode.ROLL);
      return true;
    }
    
    if (answer === "Quit") {
      this.state.setMode(GameMode.QUIT_CONFIRM);
      return true;
    }

    if (answer === "See final scores") {
      this.state.setCurrentPlayer(null);
      return true;
    }

    const index = this.state.players.findIndex(player => player.name === answer);
    this.state.setCurrentPlayer(index);
    return true;
  }

  async handleGameOver(): Promise<boolean> {
    if (this.state.players.length === 1) {
      this.state.setCurrentPlayer(0);
      const stats = this.statsLoader.getData();
      const score = this.state.getCurrentPlayer().totalScore;
      stats.scores.push(({ score, timestamp: Date.now() }));
      this.statsLoader.setData(stats);
      return this.handleSinglePlayerGameOver();
    } else if (this.state.players.length > 1) {
      return this.handleMultiplayerGameOver();
    } else {
      throw new Error("Cannot handle game over with no players");
    }
  }

  async handleQuitConfirm(): Promise<boolean> {
    // Draw stuff

    // Get input
    const quit = await this.prompter.getInputFromConfirm({
      name: "quitConfirm",
      message: this.config.messages.quitConfirmPrompt,
    });
  
    // Handle input
    if (!quit) {
      this.state.revertMode();
      return true;
    } 
    return false;
  }

  async handleQuitToMainMenuConfirm(): Promise<boolean> {
    // Draw stuff

    // Get input
    const quit = await this.prompter.getInputFromConfirm({
      name: "quitToMainMenuConfirm",
      message: this.config.messages.quitToMainMenuConfirmPrompt,
    });
  
    // Handle input
    if (!quit) {
      this.state.revertMode();
      return true;
    } 
    this.state.setMode(GameMode.MAIN_MENU);
    return true;
  }

  getRollModePromptChoices(): IChoice<RollModeChoice>[] {
    const choices: IChoice<RollModeChoice>[] = [];
    if (this.state.rollNumber === 0) {
      choices.push({name: RollModeChoice.ROLL_DICE });
    } else {
      if (this.state.rollNumber < this.config.rollsPerTurn) {
        choices.push({name: RollModeChoice.ROLL_AGAIN }, { name: RollModeChoice.LOCK_DICE });
      }
      choices.push({ name: RollModeChoice.SCORE_DICE });
    }
    choices.push(
      { name: RollModeChoice.SEE_SCORESHEET },
      { name: RollModeChoice.QUIT_TO_MAIN_MENU },
      { name: RollModeChoice.QUIT },
    );
    return choices;
  }

  async handleRollMode(): Promise<boolean> {
    // Draw stuff
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.getCurrentPlayer().name, this.state.turn, this.state.getDiceRollsLeft(), diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "gameAction",
      message: this.config.messages.gameActionPrompt,
      choices: this.getRollModePromptChoices(),
    });
  
    // Handle input
    switch(answer) {
      case RollModeChoice.LOCK_DICE:
        this.state.setMode(GameMode.DICE_LOCKER);
        return true;
      case RollModeChoice.ROLL_DICE:
      case RollModeChoice.ROLL_AGAIN:
        this.state.dice.roll();
        this.state.incrementRollNumber();
        return true;
      case RollModeChoice.SEE_SCORESHEET:
        this.state.setMode(GameMode.VIEW_SCORE);
        return true;
      case RollModeChoice.SCORE_DICE:
        this.state.setMode(GameMode.EDIT_SCORE);
        return true;
      case RollModeChoice.QUIT_TO_MAIN_MENU:
        this.state.setMode(GameMode.QUIT_TO_MAIN_MENU_CONFIRM);
        return true;
      case RollModeChoice.QUIT:
        this.state.setMode(GameMode.QUIT_CONFIRM);
        return true;
      default:
        return true;
    }
  }

  getScoreDicePromptChoices() {
    const choices = [];

    const score = this.state.getCurrentPlayer().score;

    Object.keys(score).forEach(key => {
      const category = key as YahtzeeScoreCategory;

      const diceScorer = new DiceScorer(this.state.dice.values, this.config);
  
      if (category === YahtzeeScoreCategory.YahtzeeBonus) {
        const disabled = !score[YahtzeeScoreCategory.Yahtzee]
          || !diceScorer.scoreYahtzeeBonus();
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: `[${score[category]}]${!disabled
            ? ` + ${diceScorer.scoreYahtzeeBonus()}` : ""}`,
          disabled,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] !== null
            ? `[${score[category]}]`
            : diceScorer.scoreCategory(category),
          disabled: score[category] !== null,
        });
      }
    });
  
    if (this.state.getDiceRollsLeft() > 0) {
      choices.push({
        message: "Cancel",
        name: "Cancel",
        value: "Cancel",
      });
    }
  
    return choices;
  }

  async handleScoreDiceMode(): Promise<boolean> {
    // Draw stuff
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.getCurrentPlayer().name, this.state.turn, this.state.getDiceRollsLeft(), diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "scoreDiceMenu",
      message: this.config.messages.scoreDicePrompt,
      choices: this.getScoreDicePromptChoices(),
    });
  
    // Handle input
    if (answer === "Cancel") {
      this.state.setMode(GameMode.ROLL);
      return true;
    }

    const category = answer as YahtzeeScoreCategory;
    const player = this.state.getCurrentPlayer();

    if (category === YahtzeeScoreCategory.YahtzeeBonus) {
      player.setScore(
        YahtzeeScoreCategory.YahtzeeBonus,
        player.score[YahtzeeScoreCategory.YahtzeeBonus] += diceScorer.scoreYahtzeeBonus(),
      );
      this.state.setMode(GameMode.EDIT_SCORE_JOKER);
      return true;
    }
    
    player.setScore(category, diceScorer.scoreCategory(category));
    this.state.nextPlayer();
    return true;
  }

  /**
   * Joker rules
   * Score the total of all 5 dice in the appropriate upper section box.
   * If this box has already been filled in, score as follows in any open
   * lower section box:
   * - 3 of a kind: total of all five dice
   * - 4 of a kind: total of all five dice
   * - full house: 25
   * - small straight: 30
   * - large straight: 40
   * - chance: total of all five dice
   */
  getScoreJokerPromptChoices() {
    const choices = [];

    const score = this.state.getCurrentPlayer().score;
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);

    const numberCategories = [
      YahtzeeScoreCategory.Ones,
      YahtzeeScoreCategory.Twos,
      YahtzeeScoreCategory.Threes,
      YahtzeeScoreCategory.Fours,
      YahtzeeScoreCategory.Fives,
      YahtzeeScoreCategory.Sixes,
    ];
    const yahtzeeDiceValue = this.state.dice.values[0];
    const yahtzeeNumberCategory = numberCategories[yahtzeeDiceValue - 1];
    const yahtzeeOtherNumberCategories = numberCategories.filter(
      category => category !== yahtzeeNumberCategory,
    );

    [
      "Attempt 1: Score sum of dice in the appropriate number category",
      yahtzeeNumberCategory,
      "Attempt 2: Score in any lower section category",
      YahtzeeScoreCategory.ThreeOfAKind,
      YahtzeeScoreCategory.FourOfAKind,
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
      YahtzeeScoreCategory.Chance,
      "Attempt 3: Score zero in any number category",
      ...yahtzeeOtherNumberCategories,
    ].forEach(key => {
      const category = key as YahtzeeScoreCategory;
      if (key.startsWith("Attempt")) {
        choices.push({
          message: key,
          name: key,
          value: key,
          hint: "",
          role: "separator",
        });
      } else if (category === yahtzeeNumberCategory) {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null
            ? diceScorer.scoreCategory(category)
            : `[${score[category]}]`,
          disabled: score[category] !== null,
        });
      } else if (yahtzeeOtherNumberCategories.includes(category)) {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null ? 0 : `[${score[category]}]`,
          disabled: score[category] !== null || score[yahtzeeNumberCategory] === null || [
            YahtzeeScoreCategory.ThreeOfAKind,
            YahtzeeScoreCategory.FourOfAKind,
            YahtzeeScoreCategory.FullHouse,
            YahtzeeScoreCategory.SmallStraight,
            YahtzeeScoreCategory.LargeStraight,
            YahtzeeScoreCategory.Chance
          ].some(c => score[c] === null),
        });
      } else if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null
            ? diceScorer.getCategoryScoreValue(category)
            : `[${score[category]}]`,
          disabled: score[category] !== null || score[yahtzeeNumberCategory] === null,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null
            ? diceScorer.scoreCategory(category)
            : `[${score[category]}]`,
          disabled: score[category] !== null || score[yahtzeeNumberCategory] === null,
        });
      }
    });

    return choices;
  }

  async handleScoreJokerMode(): Promise<boolean> {
    // Draw stuff
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.getCurrentPlayer().name, this.state.turn, this.state.getDiceRollsLeft(), diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "scoreDiceMenu",
      message: this.config.messages.scoreJokerPrompt,
      choices: this.getScoreJokerPromptChoices(),
    });
  
    // Handle input
    const category = answer as YahtzeeScoreCategory;
    const player = this.state.getCurrentPlayer();

    if ([
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
    ].includes(category)) {
      player.setScore(category, this.config.scoreValues[category]);
    } else {
      player.setScore(category, diceScorer.scoreCategory(category));
    }

    this.state.nextPlayer();
    return true;
  }

  async handleScoresheetMode(): Promise<boolean> {
    // Draw stuff
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.getCurrentPlayer().name, this.state.turn, this.state.getDiceRollsLeft(), diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);

    const player = this.state.getCurrentPlayer();
  
    player.renderScoresheet();
  
    // Get input
    const answer = await this.prompter.getInputFromSelect({
      name: "scoresheetMenu",
      message: this.config.messages.scoresheetPrompt,
      choices: [{ name: "Continue" }],
    });
  
    // Handle input
    switch(answer) {
      case "Continue":
        this.state.setMode(GameMode.ROLL);
        return true;
      default:
        return true;
    }
  }
}