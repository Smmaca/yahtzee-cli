import util from "util";
import { IConfig } from "../types";
import GameState from "./GameState";
import Statistics from "./Statistics";
import BaseGameScreen from "../gameScreens/BaseGameScreen";
import { IPrompter } from "./prompters/types";
import { IDice } from "./dice/types";
import Settings from "./Settings";
import Achievements from "./Achievements";

export default class Game {
  config: IConfig;
  state: GameState;
  prompter: IPrompter;

  constructor(config: IConfig, prompter: IPrompter, dice: IDice) {
    this.config = config;
    this.prompter = prompter;
    this.state = new GameState(config, dice);
  }

  init() {
    const statsModule = new Statistics(this.config);
    statsModule.setup();

    const settingsModule = new Settings(this.config);
    settingsModule.setup();
    settingsModule.loadSettings(this.state);

    const achievementsModule = new Achievements(this.config);
    achievementsModule.setup();
  }

  async loop(screen: BaseGameScreen<any>) {
    try {
      this.state.addScreenToHistory(screen.name);
      const nextScreen = await screen.run({
        config: this.config,
        state: this.state,
        prompter: this.prompter,
      });
      return nextScreen && this.loop(nextScreen);
    } catch (err) {
      if (this.config.debug) {
        console.log(
          util.inspect(
            this.state.toJSON(),
            { showHidden: false, depth: null },
          )
        );
        throw err;
      } else {
        console.error("Something went wrong :(");
      }
    }
  }
}