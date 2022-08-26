import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import Input from "enquirer/lib/prompts/Input";
import PreviewSelect from "../../customPrompts/PreviewSelect";
import {
  IConfirmParams,
  IInputParams,
  IMultiselectParams,
  IPreviewSelectParams,
  IPrompter,
  ISelectParams,
} from "./types";

/**
 * Prompter child class that uses enquirer to prompt the user for certain kinds of input.
 */
export default class CLIPrompter implements IPrompter {
  async getInput(params: IInputParams): Promise<string> {
    const prompt = new Input(params);
    return prompt.run();
  }

  async getInputFromConfirm(params: IConfirmParams): Promise<boolean> {
    const prompt = new Confirm(params);
    return prompt.run();
  }

  async getInputFromSelect<K extends string>(params: ISelectParams<K>): Promise<K> {
    const prompt = new Select(params);
    return prompt.run();
  }

  async getInputFromPreviewSelect<K extends string, V = any>(params: IPreviewSelectParams<K, V>): Promise<K> {
    const prompt = new PreviewSelect(params);
    return prompt.run();
  }

  async getInputFromMultiselect<K extends string, V = any>(
    { name, message, choices, initial, limit }: IMultiselectParams<K, V>,
  ): Promise<Record<K, V>> {
    const prompt = new MultiSelect({
      name,
      message,
      choices,
      initial,
      limit,
      /**
       * This function tells Enquirer to return results as a Record with
       * { [name]: value } entries rather than as an array.
       * The "istanbul ignore next" comments tell jest not to include the
       * function or the code inside the function in the coverage report.
       */
      /* istanbul ignore next */ 
      result(names) {
        /* istanbul ignore next */
        return this.map(names);
      },
    });

    return prompt.run();
  }
}