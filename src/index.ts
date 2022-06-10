import Game from "./Game";
import config from "./config";
import CLIPrompter from "./prompters/CLIPrompter";

export function main() {
  const prompter = new CLIPrompter();
  const game = new Game(config, prompter);

  game.init();
  game.loop();
}

main();
