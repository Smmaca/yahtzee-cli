import clear from "clear";
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import config from "./config";
import { resetDiceLock } from "./handleDiceLockMode";
import { resetGame } from "./handleGameOver";
import { isYahtzee, resetDiceRoll, sumDiceRoll } from "./handleScoreDiceMode";
import { GameMode, IGame, RollModeChoice, YahtzeeScoreCategory } from "./types";
import { drawDiceValues, drawTitle, drawTurnStats } from "./utils/draw";
import { changeMode, revertMode } from "./utils/modeHelper";
import Scoresheet, { scoreLabels } from "./utils/Scoresheet";
import { rollDice } from "./utils/diceRoller";

export default class Game {
  private _data: IGame;

  constructor(data: IGame) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  getDataClone(): IGame {
    return JSON.parse(JSON.stringify(this.data));
  }

  setData(data: IGame) {
    this._data = data;
  }

  init() {
    resetDiceRoll(this.data);
    resetDiceLock(this.data);
  }

  async loop() {
    clear();

    drawTitle();

    let continueLoop = true;

    switch(this.data.mode) {
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
    drawTurnStats(this.data);
    drawDiceValues(this.data);
  
    const choices = this.data.diceRoll.map((value, index) => ({
      name: `Dice ${index + 1}`,
      hint: value,
      value: index,
      // Enabled property doesn't work but can use it to set initial choices from the prompt
      enabled: this.data.diceLock[index],
    }));
  
    const prompt = new MultiSelect({
      name: "diceLockMenu",
      message: config.messages.diceLockPrompt,
      limit: config.diceCount,
      choices,
      initial: choices.filter((choice) => choice.enabled).map((choice) => choice.name),
      result(names) {
        return this.map(names);
      }
    });

    const data = this.getDataClone();
  
    return prompt.run().then((answer) => {
      resetDiceLock(data);
      const indicesToLock = Object.keys(answer).map(key => answer[key]);
      data.diceLock = data.diceLock.map((_, i) => indicesToLock.includes(i));
      changeMode(data, GameMode.ROLL);
      this.setData(data);
      return true;
    });
  }

  async handleGameOver(): Promise<boolean> {
    const scoresheet = new Scoresheet({ diceRoll: this.data.diceRoll, score: this.data.score }); 
  
    console.log("Game over!\n");
  
    scoresheet.render();
  
    const prompt = new Confirm({
      name: "playAgain",
      message: config.messages.playAgainPrompt,
    });
  
    return prompt.run().then(playAgain => {
      if (playAgain) {
        const data = this.getDataClone();
        resetGame(data);
        this.setData(data);
        return true;
      }
      return false;
    });
  }

  handleQuitConfirm(): Promise<boolean> {
    const prompt = new Confirm({
      name: "quitConfirm",
      message: config.messages.quitConfirmPrompt,
    });
  
    return prompt.run().then(quit => {
      const data = this.getDataClone();
      if (!quit) {
        revertMode(data);
        this.setData(data);
        return true;
      } 
      return false;
    });
  }

  getRollModePromptChoices() {
    const choices = [];
    if (this.data.rollNumber === 0) {
      choices.push(RollModeChoice.ROLL_DICE);
    } else {
      if (this.data.rollNumber > 0 && this.data.rollNumber < config.rollsPerTurn) {
        choices.push(RollModeChoice.ROLL_AGAIN, RollModeChoice.LOCK_DICE);
      }
      if (this.data.rollNumber > 0) {
        choices.push(RollModeChoice.SCORE_DICE);
      }
    }
    choices.push(RollModeChoice.SEE_SCORESHEET, RollModeChoice.QUIT);
    return choices;
  }

 async handleRollMode(): Promise<boolean> {
    drawTurnStats(this.data);
    drawDiceValues(this.data);
  
    const prompt = new Select({
      name: "gameAction",
      message: config.messages.rollPrompt,
      choices: this.getRollModePromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      const data = this.getDataClone();
      switch(answer) {
        case RollModeChoice.LOCK_DICE:
          changeMode(data, GameMode.DICE_LOCKER)
          this.setData(data);
          return true;
        case RollModeChoice.ROLL_DICE:
        case RollModeChoice.ROLL_AGAIN:
          const lockedDice = this.data.diceLock.filter((dice) => dice === true).length;
          const diceRoll = rollDice(config.diceCount - lockedDice);
          data.diceRoll = this.data.diceRoll.map((oldRoll, i) => {
            if (this.data.diceLock[i]) {
              return oldRoll;
            } else {
              return diceRoll.shift();
            }
          });
          data.rollNumber += 1;
          this.setData(data);
          return true;
        case RollModeChoice.SEE_SCORESHEET:
          changeMode(data, GameMode.VIEW_SCORE);
          this.setData(data);
          return true;
        case RollModeChoice.SCORE_DICE:
          changeMode(data, GameMode.EDIT_SCORE);
          this.setData(data);
          return true;
        case RollModeChoice.QUIT:
          changeMode(data, GameMode.QUIT_CONFIRM);
          this.setData(data);
          return true;
        default:
          return true;
      }
    });
  }

  calculateScore(category: YahtzeeScoreCategory) {
    const diceRoll = this.data.diceRoll.slice();
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
          ? config.scoreValues[YahtzeeScoreCategory.FullHouse] : 0;
      case YahtzeeScoreCategory.SmallStraight:
        return ["12345", "23456", "1234", "2345", "3456", "13456", "12346"]
          .includes(Array.from(new Set(diceRoll)).sort().join(""))
          ? config.scoreValues[YahtzeeScoreCategory.SmallStraight] : 0;
      case YahtzeeScoreCategory.LargeStraight:
        return ["12345", "23456"]
          .includes(diceRoll.sort().join(""))
          ? config.scoreValues[YahtzeeScoreCategory.LargeStraight] : 0;
      case YahtzeeScoreCategory.Yahtzee:
        return isYahtzee(diceRoll)
          ? config.scoreValues[YahtzeeScoreCategory.Yahtzee] : 0;
      case YahtzeeScoreCategory.Chance:
        return sumDiceRoll(diceRoll);
      case YahtzeeScoreCategory.BonusYahtzees:
        return isYahtzee(diceRoll)
          ? config.scoreValues[YahtzeeScoreCategory.BonusYahtzees] : 0;
      default:
        return 0;
    }
  }

  getScoreDicePromptChoices() {
    const choices = [];

    Object.keys(this.data.score).forEach(key => {
      const category = key as YahtzeeScoreCategory;
  
      if (category === YahtzeeScoreCategory.BonusYahtzees) {
        const disabled = this.data.score[YahtzeeScoreCategory.Yahtzee] === null
          || this.calculateScore(category) === 0;
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: `[${this.data.score[category]}]${(!disabled &&
            category === YahtzeeScoreCategory.BonusYahtzees) ? " + 100" : ""}`,
          disabled,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: this.data.score[category] !== null
            ? `[${this.data.score[category]}]`
            : this.calculateScore(category),
          disabled: this.data.score[category] !== null,
        });
      }
    });
  
    if (config.rollsPerTurn - this.data.rollNumber > 0) {
      choices.push({
        message: "Cancel",
        name: "cancel",
        value: "cancel",
      });
    }
  
    return choices;
  }

  async handleScoreDiceMode(): Promise<boolean> {
    drawTurnStats(this.data);
    drawDiceValues(this.data);
  
    const prompt = new Select({
      name: "scoreDiceMenu",
      message: config.messages.scoreDicePrompt,
      choices: this.getScoreDicePromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      if (answer === "cancel") {
        const data = this.getDataClone();
        changeMode(data, GameMode.ROLL);
        this.setData(data);
        return true;
      }
  
      const category = answer as YahtzeeScoreCategory;
  
      const data = this.getDataClone();
      if (category === YahtzeeScoreCategory.BonusYahtzees
        && this.data.score[YahtzeeScoreCategory.Yahtzee] !== null
      ) {
        data.score[YahtzeeScoreCategory.BonusYahtzees] += this.calculateScore(category);
        changeMode(data, GameMode.EDIT_SCORE_JOKER);
        this.setData(data);
        return true;
      } else {
        data.score[category] = this.calculateScore(category);
      }
  
      if (this.data.turn === 12) {
        changeMode(data, GameMode.GAME_OVER);
        this.setData(data);
        return true;
      } 
  
      resetDiceLock(data);
      data.turn++;
      data.rollNumber = 0;
      resetDiceRoll(data);
      resetDiceLock(data);
      changeMode(data, GameMode.VIEW_SCORE);
      this.setData(data);
      return true;
    });
  }

  getScoreJokerPromptChoices() {
    const choices = [];

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
          hint: config.scoreValues[category],
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: this.calculateScore(category),
        });
      }
    });

    return choices;
  }

  async handleScoreJokerMode(): Promise<boolean> {
    drawTurnStats(this.data);
    drawDiceValues(this.data);
  
    const prompt = new Select({
      name: "scoreDiceMenu",
      message: config.messages.scoreJokerPrompt,
      choices: this.getScoreJokerPromptChoices(),
    });
  
    return prompt.run().then((answer) => {
      const category = answer as YahtzeeScoreCategory;
      
      const data = this.getDataClone();
      if ([
        YahtzeeScoreCategory.FullHouse,
        YahtzeeScoreCategory.SmallStraight,
        YahtzeeScoreCategory.LargeStraight,
      ].includes(category)) {
        data.score[category] = config.scoreValues[category];
      } else {
        data.score[category] = this.calculateScore(category);
      }
  
      if (this.data.turn === 12) {
        changeMode(data, GameMode.GAME_OVER);
        this.setData(data);
        return true;
      } 
  
      resetDiceLock(data);
      data.turn++;
      data.rollNumber = 0;
      resetDiceRoll(data);
      resetDiceLock(data);
      changeMode(data, GameMode.VIEW_SCORE);
      this.setData(data);
      return true;
    });
  }

  async handleScoresheetMode(): Promise<boolean> {
    drawTurnStats(this.data);
    drawDiceValues(this.data);
  
    const scoresheet = new Scoresheet({ diceRoll: this.data.diceRoll, score: this.data.score }); 
  
    scoresheet.render();
  
    const prompt = new Select({
      name: "scoresheetMenu",
      message: config.messages.scoresheetPrompt,
      choices: ["Continue"],
    });
  
    return prompt.run().then(answer => {
      const data = this.getDataClone();
      switch(answer) {
        case "Continue":
          changeMode(data, GameMode.ROLL);
          this.setData(data);
          return true;
        default:
          return true;
      }
    });
  }
}