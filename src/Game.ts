import clear from "clear";
import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import { isYahtzee } from "./handleScoreDiceMode";
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
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.dice.values));
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
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.dice.values));
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
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.dice.values));
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

  getScoreJokerPromptChoices() {
    const choices = [];

    const score = this.state.currentPlayer.score;
    const diceScorer = new DiceScorer(this.state.dice.values, this.config);

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
          hint: diceScorer.getCategoryScoreValue(category),
          disabled: score[category] !== null,
        });
      } else {
        choices.push({
          message: scoreLabels[category],
          name: category,
          value: category,
          hint: diceScorer.scoreCategory(category),
          disabled: score[category] !== null,
        });
      }
    });

    return choices;
  }

  async handleScoreJokerMode(): Promise<boolean> {
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.dice.values));
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
    drawTurnStats(this.state.currentPlayer.name, this.state.turn, this.state.diceRollsLeft, isYahtzee(this.state.dice.values));
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