import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import Input from "enquirer/lib/prompts/Input";
import {
  IConfirmParams,
  IInputParams,
  IMultiselectParams,
  IPrompter,
  ISelectParams,
} from "./types";

/**
 * Prompter child class that uses enquirer to prompt the user for certain kinds of input.
 */
export default class CLIPrompter implements IPrompter {
  async getInput({ name, message, initial }: IInputParams): Promise<string> {
    const prompt = new Input({ name, message, initial });
    return prompt.run();
  }

  async getInputFromConfirm({ name, message }: IConfirmParams): Promise<boolean> {
    const prompt = new Confirm({ name, message });
    return prompt.run();
  }

  async getInputFromSelect<K extends string>(
    { name, message, choices }: ISelectParams<K>,
  ): Promise<K> {
    const prompt = new Select({ name, message, choices });
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