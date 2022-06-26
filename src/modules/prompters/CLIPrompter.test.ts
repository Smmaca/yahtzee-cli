import MultiSelect from "enquirer/lib/prompts/MultiSelect";
import Confirm from "enquirer/lib/prompts/Confirm";
import Select from "enquirer/lib/prompts/Select";
import Input from "enquirer/lib/prompts/Input";
import CLIPrompter from "./CLIPrompter";

jest.mock("enquirer/lib/prompts/MultiSelect");
jest.mock("enquirer/lib/prompts/Confirm");
jest.mock("enquirer/lib/prompts/Select");
jest.mock("enquirer/lib/prompts/Input");

const MockMultiSelect = MultiSelect as jest.MockedClass<MultiSelect>;
const MockConfirm = Confirm as jest.MockedClass<Confirm>;
const MockSelect = Select as jest.MockedClass<Select>;
const MockInput = Input as jest.MockedClass<Input>;

describe("CLIPrompter", () => {
  beforeEach(() => {
    MockMultiSelect.mockClear();
    MockConfirm.mockClear();
    MockSelect.mockClear();
    MockInput.mockClear();
  });

  test("gets input", async () => {
    const prompter = new CLIPrompter();

    MockInput.prototype.run.mockImplementationOnce(() => "answer");

    const result = await prompter.getInput({
      name: "input",
      message: "message",
      initial: "initial",
    });

    expect(MockInput).toHaveBeenCalledWith({
      name: "input",
      message: "message",
      initial: "initial",
    });
    expect(MockInput.mock.instances[0].run).toHaveBeenCalledTimes(1);
    expect(result).toBe("answer");
  });

  test("gets confirm input", async () => {
    const prompter = new CLIPrompter();

    MockConfirm.prototype.run.mockImplementationOnce(() => true);

    const result = await prompter.getInputFromConfirm({ name: "input", message: "message" });
    
    expect(MockConfirm).toHaveBeenCalledWith({ name: "input", message: "message" });
    expect(MockConfirm.mock.instances[0].run).toHaveBeenCalledTimes(1);
    expect(result).toBeTrue();
  });

  test("gets select input", async () => {
    const prompter = new CLIPrompter();

    MockSelect.prototype.run.mockImplementationOnce(() => "answer");

    const result = await prompter.getInputFromSelect({
      name: "input",
      message: "message",
      choices: [],
    });

    expect(MockSelect).toHaveBeenCalledWith({
      name: "input",
      message: "message",
      choices: [],
    });
    expect(MockSelect.mock.instances[0].run).toHaveBeenCalledTimes(1);
    expect(result).toBe("answer");
  });

  test("gets multiselect input", async () => {
    const prompter = new CLIPrompter();

    MockMultiSelect.prototype.run.mockImplementationOnce(() => ({ answer: "answer" }));

    const result = await prompter.getInputFromMultiselect({
      name: "input",
      message: "message",
      choices: [],
      initial: [],
      limit: 1,
    });

    expect(MockMultiSelect).toHaveBeenCalledTimes(1);
    expect(MockMultiSelect.mock.calls[0][0]).toMatchObject({
      name: "input",
      message: "message",
      choices: [],
      initial: [],
      limit: 1,
    });
    expect(MockMultiSelect.mock.instances[0].run).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ answer: "answer" });
  });
});
