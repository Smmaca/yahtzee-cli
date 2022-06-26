import config from "./config";
import main from "./main";
import Dice from "./modules/dice/Dice";
import CLIPrompter from "./modules/prompters/CLIPrompter";

const prompter = new CLIPrompter();
const dice = new Dice();
main(config, prompter, dice);
