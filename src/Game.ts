import clear from "clear";
import util from 'util';
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import Input from "enquirer/lib/prompts/Input";
import { GameMode, IConfig, RollModeChoice, YahtzeeScoreCategory } from "./types";
import { drawDiceValues, drawTitle, drawTurnStats } from "./utils/draw";
import { scoreLabels } from "./Scoresheet";
import GameState from "./GameState";
import DiceScorer from "./DiceScorer";

export default class Game {
  config: IConfig;
  state: GameState;

  constructor(config: IConfig) {
    this.config = config;
    this.state = new GameState(config);
  }

  init() {}

  async loop() {
    clear();

    drawTitle();

    let continueLoop = true;

    try {
      switch(this.state.mode) {
        case GameMode.MAIN_MENU:
          continueLoop = await this.handleMainMenu();
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
      process.exit(1);
    }

    return continueLoop && this.loop();
  }

  async handleMainMenu(): Promise<boolean> {
    const prompt = new Select({
      name: "mainMenu",
      message: this.config.messages.mainMenuPrompt,
      choices: [
        "New game",
        "Quit",
      ],
    });

    return prompt.run().then(answer => {
      if (answer === "New game") {
        this.state.setMode(GameMode.NEW_GAME);
        return true;
      }
      if (answer === "Quit") {
        this.state.setMode(GameMode.QUIT_CONFIRM);
        return true;
      }
    });
  }

  async handleNewGame(): Promise<boolean> {
    const prompt = new Select({
      name: "newGame",
      message: this.config.messages.newGamePrompt,
      choices: [
        "Single player",
        "Multiplayer",
        "Cancel",
      ],
    });

    return prompt.run().then(answer => {
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
    });
  }

  async handleNewMultiplayerGame(): Promise<boolean> {
    if (this.state.players.length) {
      this.state.players.forEach((player, i) => console.log(`Player ${i + 1}: ${player.name}`));
    } else {
      console.log("No players added yet");
    }
    console.log("\n");

    const choices = [];

    if (this.state.players.length < this.config.maxPlayers) {
      choices.push("Add player");
    }
    if (this.state.players.length >= 2) {
      choices.push("Start game");
    }
    choices.push("Cancel");

    const prompt = new Select({
      name: "newMultiplayerGame",
      message: this.config.messages.newMultiplayerGamePrompt,
      choices,
    });

    return prompt.run().then(answer => {
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
    });
  }

  async handleAddPlayer(): Promise<boolean> {
    const prompt = new Input({
      name: "addPlayer",
      message: this.config.messages.addPlayerPrompt,
      initial: `Player ${this.state.players.length + 1}`,
    });

    return prompt.run().then(answer => {
      if (answer) {
        this.state.addPlayer(answer);
        this.state.revertMode();
        return true;
      }
      this.state.revertMode();
      return true;
    });
  }

  async handleDiceLockMode(): Promise<boolean> {
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    const choices = this.state.dice.values.map((value, index) => ({
      name: `Dice ${index + 1}`,
      hint: value,
      value: index,
      // Enabled property doesn't work but can use it to set initial choices from the prompt
      enabled: this.state.dice.lock[index],
    }));
  
    const prompt = new MultiSelect({
      name: "diceLockMenu",
      message: this.config.messages.diceLockPrompt,
      limit: 5,
      choices,
      initial: choices.filter((choice) => choice.enabled).map((choice) => choice.name),
      result(names) {
        return this.map(names);
      }
    });
  
    return prompt.run().then((answer) => {
      this.state.dice.resetLock();
      const indicesToLock = Object.keys(answer).map(key => answer[key]);
      const diceLock = this.state.dice.values.map((_, i) => indicesToLock.includes(i));
      this.state.dice.setLock(diceLock);
      this.state.setMode(GameMode.ROLL);
      return true;
    });
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

  async handleGameOver(): Promise<boolean> {
    if (this.state.players.length === 1) {
      const player = this.state.players[0];

      console.log("Game over!\n");
      player.renderScoresheet();

      const prompt = new Confirm({
        name: "playAgain",
        message: this.config.messages.playAgainPrompt,
      });
    
      return prompt.run().then(playAgain => {
        if (playAgain) {
          this.state.resetGame();
          this.state.setMode(GameMode.ROLL);
          return true;
        }
        this.state.setMode(GameMode.MAIN_MENU);
        return true;
      });
    } else {
      if (this.state.currentPlayerIndex !== null) {
        this.state.currentPlayer.renderScoresheet();
      } else {
        console.log(`${this.state.winner.name} wins!`);
        this.state.renderPlayerScores();
      }

      const prompt = new Select({
        name: "gameOverMenu",
        message: this.config.messages.gameOverPrompt,
        choices: this.getGameOverPromptChoices(),
      });

      return prompt.run().then(answer => {
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
      });
    }
  }

  handleQuitConfirm(): Promise<boolean> {
    const prompt = new Confirm({
      name: "quitConfirm",
      message: this.config.messages.quitConfirmPrompt,
    });
  
    return prompt.run().then(quit => {
      if (!quit) {
        this.state.revertMode();
        return true;
      } 
      return false;
    });
  }

  handleQuitToMainMenuConfirm(): Promise<boolean> {
    const prompt = new Confirm({
      name: "quitToMainMenuConfirm",
      message: this.config.messages.quitToMainMenuConfirmPrompt,
    });
  
    return prompt.run().then(quit => {
      if (!quit) {
        this.state.revertMode();
        return true;
      } 
      this.state.setMode(GameMode.MAIN_MENU);
      return true;
    });
  }

  getRollModePromptChoices() {
    const choices = [];
    if (this.state.rollNumber === 0) {
      choices.push(RollModeChoice.ROLL_DICE);
    } else {
      if (this.state.rollNumber > 0 && this.state.rollNumber < this.config.rollsPerTurn) {
        choices.push(RollModeChoice.ROLL_AGAIN, RollModeChoice.LOCK_DICE);
      }
      if (this.state.rollNumber > 0) {
        choices.push(RollModeChoice.SCORE_DICE);
      }
    }
    choices.push(RollModeChoice.SEE_SCORESHEET, RollModeChoice.QUIT_TO_MAIN_MENU, RollModeChoice.QUIT);
    return choices;
  }

 async handleRollMode(): Promise<boolean> {
  const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    const prompt = new Select({
      name: "gameAction",
      message: this.config.messages.rollPrompt,
      choices: this.getRollModePromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      switch(answer) {
        case RollModeChoice.LOCK_DICE:
          this.state.setMode(GameMode.DICE_LOCKER)
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
    });
  }

  getScoreDicePromptChoices() {
    const choices = [];

    const score = this.state.currentPlayer.score;

    Object.keys(score).forEach(key => {
      const category = key as YahtzeeScoreCategory;

      const diceScorer = new DiceScorer(this.state.dice.values, this.config);
  
      if (category === YahtzeeScoreCategory.BonusYahtzees) {
        const disabled = !score[YahtzeeScoreCategory.Yahtzee]
          || diceScorer.scoreYahtzeeBonus() === 0;
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: `[${score[category]}]${(!disabled &&
            category === YahtzeeScoreCategory.BonusYahtzees)
              ? ` + ${diceScorer.bonusYahtzeeScore}` : ""}`,
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
  
    if (this.config.rollsPerTurn - this.state.rollNumber > 0) {
      choices.push({
        message: "Cancel",
        name: "cancel",
        value: "cancel",
      });
    }
  
    return choices;
  }

  async handleScoreDiceMode(): Promise<boolean> {
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    const prompt = new Select({
      name: "scoreDiceMenu",
      message: this.config.messages.scoreDicePrompt,
      choices: this.getScoreDicePromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      if (answer === "cancel") {
        this.state.setMode(GameMode.ROLL);
        return true;
      }
  
      const category = answer as YahtzeeScoreCategory;
      const player = this.state.currentPlayer;
      const diceScorer = new DiceScorer(this.state.dice.values, this.config);
  
      if (category === YahtzeeScoreCategory.BonusYahtzees
        && player.score[YahtzeeScoreCategory.Yahtzee] !== null
      ) {
        player.setScore(
          YahtzeeScoreCategory.BonusYahtzees,
          player.score[YahtzeeScoreCategory.BonusYahtzees] += diceScorer.scoreYahtzeeBonus(),
        );
        this.state.setMode(GameMode.EDIT_SCORE_JOKER);
        return true;
      } else {
        player.setScore(category, diceScorer.scoreCategory(category));
      }
  
      this.state.nextPlayer();
      return true;
    });
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

    const score = this.state.currentPlayer.score;
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

    [
      yahtzeeNumberCategory,
      YahtzeeScoreCategory.ThreeOfAKind,
      YahtzeeScoreCategory.FourOfAKind,
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
      YahtzeeScoreCategory.Chance,
    ].forEach(key => {
      const category = key as YahtzeeScoreCategory;
      if (category === yahtzeeNumberCategory) {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null
            ? diceScorer.scoreCategory(category)
            : `[${score[category]}]`,
          disabled: score[category] !== null,
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
          disabled: score[yahtzeeNumberCategory] === null || score[category] !== null,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] === null
            ? diceScorer.scoreCategory(category)
            : `[${score[category]}]`,
          disabled: score[yahtzeeNumberCategory] === null || score[category] !== null,
        });
      }
    });

    return choices;
  }

  async handleScoreJokerMode(): Promise<boolean> {
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);
  
    const prompt = new Select({
      name: "scoreDiceMenu",
      message: this.config.messages.scoreJokerPrompt,
      choices: this.getScoreJokerPromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      const category = answer as YahtzeeScoreCategory;
      const player = this.state.currentPlayer;
      const diceScorer = new DiceScorer(this.state.dice.values, this.config);

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
    });
  }

  async handleScoresheetMode(): Promise<boolean> {
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, diceScorer.scoreYahtzee() > 0);
    drawDiceValues(this.state.dice.values, this.state.dice.lock);

    const player = this.state.currentPlayer;
  
    player.renderScoresheet();
  
    const prompt = new Select({
      name: "scoresheetMenu",
      message: this.config.messages.scoresheetPrompt,
      choices: ["Continue"],
    });
  
    return prompt.run().then(answer => {
      switch(answer) {
        case "Continue":
          this.state.setMode(GameMode.ROLL);
          return true;
        default:
          return true;
      }
    });
  }
}