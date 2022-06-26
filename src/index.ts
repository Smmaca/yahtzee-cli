import config from "./config";
import main from "./main";
import CLIPrompter from "./modules/prompters/CLIPrompter";

const prompter = new CLIPrompter();
main(config, prompter);
