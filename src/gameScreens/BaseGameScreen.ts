import clear from "clear";
import GameState from "../modules/GameState";
import { IPrompter } from "../modules/prompters/types";
import { IConfig, Screen } from "../types";
import { drawTitle } from "../utils/draw";

export interface IRunParams {
  config: IConfig;
  prompter: IPrompter;
  state: GameState;
}

export default abstract class BaseGameScreen<T> {
  abstract name: Screen;

  drawScreenStart() {
    clear();
    drawTitle();
  };

  abstract draw(state: GameState, config: IConfig): void;

  abstract getInput(prompter: IPrompter, state: GameState, config: IConfig): Promise<T>;

  abstract handleInput(input: T, state: GameState, config: IConfig): BaseGameScreen<any>;
  
  async run({ config, prompter, state }: IRunParams): Promise<BaseGameScreen<any>> {
    this.drawScreenStart();
    this.draw(state, config);
    const input = await this.getInput(prompter, state, config);
    return this.handleInput(input, state, config);
  }
}