import Game from "./modules/Game";
import config from "./config";
import CLIPrompter from "./prompters/CLIPrompter";
import MainMenuScreen from "./gameScreens/MainMenuScreen";

export function main() {
  const prompter = new CLIPrompter();
  const game = new Game(config, prompter);

  game.init();
  
  const firstScreen = new MainMenuScreen();
  game.loop(firstScreen);
}

main();
