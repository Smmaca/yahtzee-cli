import Game from "./Game";
import config from "./config";

export function main() {
  const game = new Game(config);

  game.init();
  game.loop();
}

main();
