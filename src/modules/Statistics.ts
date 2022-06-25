import { IConfig } from "../types";
import { roundToDP } from "../utils/number";
import DataLoader from "./DataLoader";

export interface IScore {
  score: number;
  timestamp: number;
}

export interface IStatsData {
  scores: IScore[];
}

export interface IEndGameStats {
  score: number;
}

export interface IStatistics {
  gamesPlayed: number;
  highScore: number;
  lowScore: number;
  averageScore: number;
}

export const defaultStatsData: IStatsData = {
  scores: [],
};

export default class Statistics {
  private loader: DataLoader<IStatsData>;

  constructor(config: IConfig) {
    this.loader = new DataLoader(config.dataFolder, config.statsFilename, defaultStatsData);
  }

  setup() {
    this.loader.init();
  }

  saveGameStatistics({ score }: IEndGameStats) {
    const stats = this.loader.getData();
    stats.scores.push(({ score, timestamp: Date.now() }));
    this.loader.setData(stats);
  }

  getGameStatistics(): IStatistics {
    const data = this.loader.getData();
    const gamesPlayed = data.scores.length;
    return {
      gamesPlayed,
      highScore: gamesPlayed
        ? Math.max(...data.scores.map(score => score.score))
        : 0,
      lowScore: gamesPlayed
        ? Math.min(...data.scores.map(score => score.score))
        : 0,
      averageScore: gamesPlayed
        ? roundToDP(
          data.scores.reduce((acc, score) => acc + score.score, 0) / gamesPlayed, 
          1,
        ) : 0,
    };
  }

  clearGameStatistics(): void {
    this.loader.setData(defaultStatsData);
  }
}