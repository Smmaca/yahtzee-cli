import BasePrompter, { IChoice, IConfirmParams, IInputParams, IMultiselectParams, ISelectParams } from "./BasePrompter"


export interface IMockAnswer {
 promptName: string;
 answer: any;
}

/**
 * Prompter child class that returns mocked answers passed in at instantiation rather than prompting the user.
 */
export default class MockPrompter extends BasePrompter {
  constructor(private answers: IMockAnswer[]) {
    super();
  }

  async getInput({ name }: IInputParams): Promise<string> {
    const mockAnswer = this.answers.shift();
    if (!mockAnswer) {
      throw new Error(`No more answers`);
    }
    if (mockAnswer.promptName !== name) {
      throw new Error(`Expected ${name}, got ${mockAnswer.promptName}`);
    }
    if (typeof mockAnswer.answer !== "string") {
      throw new Error(`Expected string, got ${typeof mockAnswer.answer}`);
    }
    return mockAnswer.answer;
  }

  async getInputFromConfirm({ name }: IConfirmParams): Promise<boolean> {
    const mockAnswer = this.answers.shift();
    if (!mockAnswer) {
      throw new Error(`No more answers`);
    }
    if (mockAnswer.promptName !== name) {
      throw new Error(`Expected ${name}, got ${mockAnswer.promptName}`);
    }
    if (typeof mockAnswer.answer !== "boolean") {
      throw new Error(`Expected boolean, got ${typeof mockAnswer.answer}`);
    }
    return mockAnswer.answer;
  }

  async getInputFromSelect<K extends string>(
    { name, choices }: ISelectParams<K>,
  ): Promise<K> {
    const mockAnswer = this.answers.shift();
    if (!mockAnswer) {
      throw new Error(`No more answers`);
    }
    if (mockAnswer.promptName !== name) {
      throw new Error(`Expected ${name}, got ${mockAnswer.promptName}`);
    }
    if (!choices.map(choice => choice.name).includes(mockAnswer.answer)) {
      throw new Error(`Expected one of [${choices.map(choice => choice.name).join(", ")}], got ${mockAnswer.answer}`);
    }
    return mockAnswer.answer;
  }

  async getInputFromMultiSelect<K extends string, V = any>(
    { name, choices }: IMultiselectParams<K, V>,
  ): Promise<Record<K, V>> {
    const mockAnswer = this.answers.shift();
    if (!mockAnswer) {
      throw new Error(`No more answers`);
    }
    if (mockAnswer.promptName !== name) {
      throw new Error(`Expected ${name}, got ${mockAnswer.promptName}`);
    }
    this.validateMultiselectAnswer(choices, mockAnswer.answer);
    return mockAnswer.answer;
  }

  private validateMultiselectAnswer<K extends string, V = any>(choices: IChoice<K, V>[], answer: Record<K, V>) {
    if (typeof answer !== "object") {
      throw new Error(`Expected object, got ${typeof answer}`);
    }
    if (answer === null) {
      throw new Error(`Expected object, got null`);
    }
    if (Array.isArray(answer)) {
      throw new Error(`Expected object, got array`);
    }

    const expected = choices.reduce((acc, curr) => {
      // @ts-ignore
      acc[curr.name] = curr.value;
      return acc;
    }, {});
    
    Object.keys(answer).forEach((answerKey: K) => {
      if (!choices.map(c => c.name).includes(answerKey)
        || choices.find(c => c.name === answerKey).value !== answer[answerKey]) {
        throw new Error(`Expected something like ${JSON.stringify(expected)}, got ${JSON.stringify(answer)}`);
      }
    });
  }
}