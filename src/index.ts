import Game from "./modules/Game";
import config from "./config";
import CLIPrompter from "./prompters/CLIPrompter";
import MainMenuScreen from "./gameScreens/MainMenuScreen";
import { IConfig } from "./types";
import BasePrompter from "./prompters/BasePrompter";

export function main(_config: IConfig, _prompter: BasePrompter) {
  const game = new Game(_config, _prompter);

  game.init();
  
  const firstScreen = new MainMenuScreen();
  game.loop(firstScreen);
}

const prompter = new CLIPrompter();
main(config, prompter);
