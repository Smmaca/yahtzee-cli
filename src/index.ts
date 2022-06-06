import Game from "./Game";
import config from "./config";

const game = new Game(config);

game.init();
game.loop();
