import Game from "./modules/Game";
import MainMenuScreen from "./gameScreens/MainMenuScreen";
import { IConfig } from "./types";
import GameState from "./modules/GameState";
import { IPrompter } from "./modules/prompters/types";

export default async function main(_config: IConfig, _prompter: IPrompter): Promise<GameState> {
  const game = new Game(_config, _prompter);

  game.init();
  
  const firstScreen = new MainMenuScreen();
  await game.loop(firstScreen);

  return game.state;
}
