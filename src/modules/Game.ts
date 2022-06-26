import util from "util";
import { IConfig } from "../types";
import GameState from "./GameState";
import BasePrompter from "../prompters/BasePrompter";
import Statistics from "./Statistics";
import BaseGameScreen from "../gameScreens/BaseGameScreen";

export default class Game {
  config: IConfig;
  state: GameState;
  prompter: BasePrompter;

  constructor(config: IConfig, prompter: BasePrompter) {
    this.config = config;
    this.prompter = prompter;
    this.state = new GameState(config);
  }

  init() {
    const statsModules = new Statistics(this.config);
    statsModules.setup();
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
        console.error(err);
      } else {
        console.error("Something went wrong :(");
      }
      return process.exit(1);
    }
  }
}