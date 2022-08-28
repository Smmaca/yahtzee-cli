import { Achievement, IConfig, YahtzeeScore } from "../types";
import DataLoader from "./DataLoader";
import GameState from "./GameState";
import Scoresheet from "./Scoresheet";

const BANNER_LENGTH = 54;

export type IAchievementsData = {
  [key in Achievement]: boolean;
}

export const defaultAchievementsData: IAchievementsData = {
  [Achievement.UNDER_ACHIEVER]: false,
  [Achievement.BRONZE]: false,
  [Achievement.SILVER]: false,
  [Achievement.GOLD]: false,
  [Achievement.PLATINUM]: false,
  [Achievement.DIAMOND]: false,
  [Achievement.MASTER]: false,
  [Achievement.CONFIDENT]: false,
  [Achievement.FORTUNE]: false,
  [Achievement.YAHTZEE]: false,
  [Achievement.JOKER]: false,
  [Achievement.TRIPLE_THREAT]: false,
  [Achievement.ON_TOP]: false,
  [Achievement.ROLLERCOASTER]: false,
};

export default class Achievements {
  private loader: DataLoader<IAchievementsData>;
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
    this.loader = new DataLoader(config.dataFolder, config.achievementsFilename, defaultAchievementsData);
  }

  setup() {
    this.loader.init();
  }

  saveAchievements(newAchievements: Partial<IAchievementsData>) {
    const achievements = this.loader.getData();
    this.loader.setData({ ...achievements, ...newAchievements });
  }

  getAchievements() {
    return this.loader.getData();
  }

  clearAchievements() {
    this.loader.setData(defaultAchievementsData);
  }

  loadAchievements() {
    const achievements = this.getAchievements();
    for (const achievement in achievements) {
      this[achievement] = achievements[achievement];
    }
  }

  validateAchievement(achievement: Achievement, gameState: GameState, score: YahtzeeScore): boolean {
    if (gameState.players.length > 1) { return false; } // Only support single player

    const achievements = this.getAchievements();
    const scoresheet = new Scoresheet(this.config, score);

    switch (achievement) {
      case Achievement.YAHTZEE:
        return !achievements[Achievement.YAHTZEE]
          && score.yahtzee === this.config.scoreValues.yahtzee;
      case Achievement.JOKER:
        return !achievements[Achievement.JOKER]
          && score.yahtzee === this.config.scoreValues.yahtzee
          && score.yahtzeeBonus === this.config.scoreValues.yahtzeeBonus;
      case Achievement.TRIPLE_THREAT:
        return !achievements[Achievement.TRIPLE_THREAT]
          && score.yahtzee === this.config.scoreValues.yahtzee
          && score.yahtzeeBonus === (this.config.scoreValues.yahtzeeBonus * 2);
      case Achievement.ON_TOP:
        return !achievements[Achievement.ON_TOP]
          && scoresheet.scoreTopSectionBonus(scoresheet.scoreTopSection()) === this.config.scoreValues.topSectionBonus;
      case Achievement.FORTUNE:
        return !achievements[Achievement.FORTUNE] && score.chance === 30;
      case Achievement.ROLLERCOASTER:
        return !achievements[Achievement.ROLLERCOASTER]
          && score.yahtzeeBonus >= this.config.scoreValues.yahtzeeBonus
          && [
            score.ones,
            score.twos,
            score.threes,
            score.fours,
            score.fives,
            score.sixes,
          ].some(score => score === 0);
      case Achievement.BRONZE:
        return !achievements[Achievement.BRONZE] && scoresheet.scoreTotal() >= 250;
      case Achievement.SILVER:
        return !achievements[Achievement.SILVER] && scoresheet.scoreTotal() >= 300;
      case Achievement.GOLD:
        return !achievements[Achievement.GOLD] && scoresheet.scoreTotal() >= 400;
      case Achievement.PLATINUM:
        return !achievements[Achievement.PLATINUM] && scoresheet.scoreTotal() >= 500;
      case Achievement.DIAMOND:
        return !achievements[Achievement.DIAMOND] && scoresheet.scoreTotal() >= 600;
      case Achievement.MASTER:
        return !achievements[Achievement.MASTER] && scoresheet.scoreTotal() >= 700;
      case Achievement.CONFIDENT:
        return !achievements[Achievement.CONFIDENT]
          && scoresheet.scoreTotal() >= 250
          && !gameState.hasRerolled;
      case Achievement.UNDER_ACHIEVER:
        return !achievements[Achievement.UNDER_ACHIEVER]
          && scoresheet.scoreTotal() === 5;
      default: return false;
    }
  }

  validateAchievements(achievements: Achievement[], gameState: GameState, score: YahtzeeScore): Achievement[] {
    const earnedAchievements = [];
    achievements.forEach(achievement => {
      if (this.validateAchievement(achievement, gameState, score)) {
        earnedAchievements.push(achievement);
      }
    });

    const achievementsToSave: Partial<IAchievementsData> = {};
    earnedAchievements.forEach(achievement => {
      achievementsToSave[achievement] = true;
    });
    this.saveAchievements(achievementsToSave);

    return earnedAchievements;
  }

  validateEndGameAchievements(gameState: GameState, score: YahtzeeScore): Achievement[] {
    return this.validateAchievements([
      Achievement.ON_TOP,
      Achievement.BRONZE,
      Achievement.SILVER,
      Achievement.GOLD,
      Achievement.PLATINUM,
      Achievement.DIAMOND,
      Achievement.MASTER,
      Achievement.CONFIDENT,
      Achievement.UNDER_ACHIEVER,
    ], gameState, score);
  }

  drawAchievement(achievement: Achievement) {
    const label = this.config.achievements[achievement].label;
    const desc = this.config.achievements[achievement].description;

    const heading = "NEW ACHIEVEMENT!"
    const caption = `${label} - ${desc}`;
    

    let drawing = "";
    for (let i = 0; i < BANNER_LENGTH; i++) { drawing += "*"; }
    drawing += "\n";
    drawing += ` ${heading}`;
    for (let i = 0; i < BANNER_LENGTH - (heading.length + 1); i++) { drawing += " "; }
    drawing += "\n";
    drawing += ` ${caption}`;
    for (let i = 0; i < BANNER_LENGTH - (caption.length + 1); i++) { drawing += " "; }
    drawing += "\n";
    for (let i = 0; i < BANNER_LENGTH; i++) { drawing += "*"; }
    drawing += "\n";
    return drawing;
  }

  renderAchievement(achievement: Achievement) {
    console.log(this.drawAchievement(achievement));
  }
}