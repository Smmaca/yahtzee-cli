import Game from "./modules/Game";
import config from "./config";
import CLIPrompter from "./prompters/CLIPrompter";
import MainMenuScreen from "./gameScreens/MainMenuScreen";
import { IConfig } from "./types";
import BasePrompter from "./prompters/BasePrompter";
import GameState from "./modules/GameState";

export async function main(_config: IConfig, _prompter: BasePrompter): Promise<GameState> {
  const game = new Game(_config, _prompter);

  game.init();
  
  const firstScreen = new MainMenuScreen();
  await game.loop(firstScreen);

  return game.state;
}

const prompter = new CLIPrompter();
main(config, prompter);
