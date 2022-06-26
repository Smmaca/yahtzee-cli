import Game from "./modules/Game";
import MainMenuScreen from "./gameScreens/MainMenuScreen";
import { IConfig } from "./types";
import GameState from "./modules/GameState";
import { IPrompter } from "./modules/prompters/types";
import { IDice } from "./modules/dice/types";

export default async function main(_config: IConfig, _prompter: IPrompter, _dice: IDice): Promise<GameState> {
  const game = new Game(_config, _prompter, _dice);

  game.init();
  
  const firstScreen = new MainMenuScreen();
  await game.loop(firstScreen);

  return game.state;
}
