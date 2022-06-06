import clear from "clear";
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import { isYahtzee, sumDiceRoll } from "./handleScoreDiceMode";
import { GameMode, IConfig, RollModeChoice, YahtzeeScoreCategory } from "./types";
import { drawDiceValues, drawTitle, drawTurnStats } from "./utils/draw";
import Scoresheet, { scoreLabels } from "./utils/Scoresheet";
import { rollDice } from "./utils/diceRoller";
import GameState from "./GameState";

export default class Game {
  config: IConfig;
  state: GameState;

  constructor(config: IConfig) {
    this.config = config;
    this.state = new GameState(config);
  }

  init() {
    this.state.init();
  }

  async loop() {
    clear();

    drawTitle();

    let continueLoop = true;

    switch(this.state.mode) {
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
      case GameMode.QUIT_CONFIRM:
        continueLoop = await this.handleQuitConfirm();
        break;
      default:
        continueLoop = true;
    }

    return continueLoop && this.loop();
  }

  async handleDiceLockMode(): Promise<boolean> {
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.diceRoll));
    drawDiceValues(this.state.diceRoll, this.state.diceLock);
  
    const choices = this.state.diceRoll.map((value, index) => ({
      name: `Dice ${index + 1}`,
      hint: value,
      value: index,
      // Enabled property doesn't work but can use it to set initial choices from the prompt
      enabled: this.state.diceLock[index],
    }));
  
    const prompt = new MultiSelect({
      name: "diceLockMenu",
      message: this.config.messages.diceLockPrompt,
      limit: this.config.diceCount,
      choices,
      initial: choices.filter((choice) => choice.enabled).map((choice) => choice.name),
      result(names) {
        return this.map(names);
      }
    });
  
    return prompt.run().then((answer) => {
      this.state.resetDiceLock();
      const indicesToLock = Object.keys(answer).map(key => answer[key]);
      const diceLock = this.state.diceRoll.map((_, i) => indicesToLock.includes(i));
      this.state.setDiceLock(diceLock);
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
        name: i,
        value: player.name,
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
          return true;
        }
        return false;
      });
    } else {
      if (this.state.currentPlayerIndex >= 0) {
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
          return true;
        }
        
        if (answer === "Quit") {
          this.state.setMode(GameMode.QUIT_CONFIRM);
          return true;
        }

        if (answer === "See final scores") {
          this.state.setCurrentPlayer(null);
        }

        this.state.setCurrentPlayer(answer);
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
    choices.push(RollModeChoice.SEE_SCORESHEET, RollModeChoice.QUIT);
    return choices;
  }

 async handleRollMode(): Promise<boolean> {
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.diceRoll));
    drawDiceValues(this.state.diceRoll, this.state.diceLock);
  
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
          const unlockedDiceRoll = rollDice(this.state.unlockedDiceCount);
          const diceRoll = this.state.diceRoll.map((oldRoll, i) => {
            if (this.state.diceLock[i]) {
              return oldRoll;
            } else {
              return unlockedDiceRoll.shift();
            }
          });
          this.state.setDiceRoll(diceRoll);
          this.state.setRollNumber(this.state.rollNumber + 1);
          return true;
        case RollModeChoice.SEE_SCORESHEET:
          this.state.setMode(GameMode.VIEW_SCORE);
          return true;
        case RollModeChoice.SCORE_DICE:
          this.state.setMode(GameMode.EDIT_SCORE);
          return true;
        case RollModeChoice.QUIT:
          this.state.setMode(GameMode.QUIT_CONFIRM);
          return true;
        default:
          return true;
      }
    });
  }

  calculateScore(category: YahtzeeScoreCategory) {
    const diceRoll = this.state.diceRoll.slice();
    switch (category) {
      case YahtzeeScoreCategory.Ones:
        return 1 * diceRoll.filter(d => d === 1).length;
      case YahtzeeScoreCategory.Twos:
        return 2 * diceRoll.filter(d => d === 2).length;
      case YahtzeeScoreCategory.Threes:
        return 3 * diceRoll.filter(d => d === 3).length;
      case YahtzeeScoreCategory.Fours:
        return 4 * diceRoll.filter(d => d === 4).length;
      case YahtzeeScoreCategory.Fives:
        return 5 * diceRoll.filter(d => d === 5).length;
      case YahtzeeScoreCategory.Sixes:
        return 6 * diceRoll.filter(d => d === 6).length;
      case YahtzeeScoreCategory.ThreeOfAKind:
        return diceRoll.some(d => diceRoll.filter(dd => dd === d).length >= 3)
          ? sumDiceRoll(diceRoll) : 0;
      case YahtzeeScoreCategory.FourOfAKind:
        return diceRoll.some(d => diceRoll.filter(dd => dd === d).length >= 4)
          ? sumDiceRoll(diceRoll) : 0;
      case YahtzeeScoreCategory.FullHouse:
        return (diceRoll.find(d => diceRoll.filter(dd => dd === d).length === 2)
          && diceRoll.find(d => diceRoll.filter(dd => dd === d).length === 3))
          ? this.config.scoreValues[YahtzeeScoreCategory.FullHouse] : 0;
      case YahtzeeScoreCategory.SmallStraight:
        return ["12345", "23456", "1234", "2345", "3456", "13456", "12346"]
          .includes(Array.from(new Set(diceRoll)).sort().join(""))
          ? this.config.scoreValues[YahtzeeScoreCategory.SmallStraight] : 0;
      case YahtzeeScoreCategory.LargeStraight:
        return ["12345", "23456"]
          .includes(diceRoll.sort().join(""))
          ? this.config.scoreValues[YahtzeeScoreCategory.LargeStraight] : 0;
      case YahtzeeScoreCategory.Yahtzee:
        return isYahtzee(diceRoll)
          ? this.config.scoreValues[YahtzeeScoreCategory.Yahtzee] : 0;
      case YahtzeeScoreCategory.Chance:
        return sumDiceRoll(diceRoll);
      case YahtzeeScoreCategory.BonusYahtzees:
        return isYahtzee(diceRoll)
          ? this.config.scoreValues[YahtzeeScoreCategory.BonusYahtzees] : 0;
      default:
        return 0;
    }
  }

  getScoreDicePromptChoices() {
    const choices = [];

    const score = this.state.currentPlayer.score;

    Object.keys(score).forEach(key => {
      const category = key as YahtzeeScoreCategory;
  
      if (category === YahtzeeScoreCategory.BonusYahtzees) {
        const disabled = !score[YahtzeeScoreCategory.Yahtzee]
          || this.calculateScore(category) === 0;
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: `[${score[category]}]${(!disabled &&
            category === YahtzeeScoreCategory.BonusYahtzees) ? " + 100" : ""}`,
          disabled,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: score[category] !== null
            ? `[${score[category]}]`
            : this.calculateScore(category),
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
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.diceRoll));
    drawDiceValues(this.state.diceRoll, this.state.diceLock);
  
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
  
      if (category === YahtzeeScoreCategory.BonusYahtzees
        && player.score[YahtzeeScoreCategory.Yahtzee] !== null
      ) {
        player.setScore(
          YahtzeeScoreCategory.BonusYahtzees,
          player.score[YahtzeeScoreCategory.BonusYahtzees] += this.calculateScore(category),
        );
        this.state.setMode(GameMode.EDIT_SCORE_JOKER);
        return true;
      } else {
        player.setScore(category, this.calculateScore(category));
      }
  
      this.state.nextPlayer();
      return true;
    });
  }

  getScoreJokerPromptChoices() {
    const choices = [];

    const score = this.state.currentPlayer.score;

    [
      YahtzeeScoreCategory.Ones,
      YahtzeeScoreCategory.Twos,
      YahtzeeScoreCategory.Threes,
      YahtzeeScoreCategory.Fours,
      YahtzeeScoreCategory.Fives,
      YahtzeeScoreCategory.Sixes,
      YahtzeeScoreCategory.ThreeOfAKind,
      YahtzeeScoreCategory.FourOfAKind,
      YahtzeeScoreCategory.FullHouse,
      YahtzeeScoreCategory.SmallStraight,
      YahtzeeScoreCategory.LargeStraight,
      YahtzeeScoreCategory.Chance,
    ].forEach(key => {
      const category = key as YahtzeeScoreCategory;
      if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: this.config.scoreValues[category],
          disabled: score[category] !== null,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: this.calculateScore(category),
          disabled: score[category] !== null,
        });
      }
    });

    return choices;
  }

  async handleScoreJokerMode(): Promise<boolean> {
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.diceRoll));
    drawDiceValues(this.state.diceRoll, this.state.diceLock);

    const score = this.state.currentPlayer.score;
  
    const prompt = new Select({
      name: "scoreDiceMenu",
      message: this.config.messages.scoreJokerPrompt,
      choices: this.getScoreJokerPromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      const category = answer as YahtzeeScoreCategory;
      const player = this.state.currentPlayer;

      if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        player.setScore(category, this.config.scoreValues[category]);
      } else {
        player.setScore(category, this.calculateScore(category));
      }
  
      this.state.nextPlayer();
      return true;
    });
  }

  async handleScoresheetMode(): Promise<boolean> {
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.diceRoll));
    drawDiceValues(this.state.diceRoll, this.state.diceLock);

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