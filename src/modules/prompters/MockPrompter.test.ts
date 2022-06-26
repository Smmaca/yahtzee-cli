import MockPrompter from "./MockPrompter";

describe("MockPrompter", () => {
  test("gets input - no mock answer", async () => {
    const prompter = new MockPrompter([]);

    try {
      await prompter.getInput({
        name: "input",
        message: "message",
        initial: "initial",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("No more answers");
    }
  });

  test("gets input - next mock answer is for a different prompt", async () => {
    const prompter = new MockPrompter([{
      promptName: "input1",
      answer: "answer1",
    }]);

    try {
      await prompter.getInput({
        name: "input",
        message: "message",
        initial: "initial",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected input, got input1");
    }
  });

  test("gets input - next mock answer is for correct prompt but is wrong type", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: undefined,
    }]);

    try {
      await prompter.getInput({
        name: "input",
        message: "message",
        initial: "initial",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected string, got undefined");
    }
  });

  test("gets input - returns mock answer", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: "answer",
    }]);

    const result = await prompter.getInput({
      name: "input",
      message: "message",
      initial: "initial",
    });

    expect(result).toBe("answer");
  });

  test("gets confirmation - no mock answer", async () => {
    const prompter = new MockPrompter([]);

    try {
      await prompter.getInputFromConfirm({
        name: "input",
        message: "message",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("No more answers");
    }
  });

  test("gets confirmation - next mock answer is for a different prompt", async () => {
    const prompter = new MockPrompter([{
      promptName: "input1",
      answer: false,
    }]);

    try {
      await prompter.getInputFromConfirm({
        name: "input",
        message: "message",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected input, got input1");
    }
  });

  test("gets confirmation - next mock answer is for correct prompt but is wrong type", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: "answer",
    }]);

    try {
      await prompter.getInputFromConfirm({
        name: "input",
        message: "message",
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected boolean, got string");
    }
  });

  test("gets confirmation - returns mock answer", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: true,
    }]);

    const result = await prompter.getInputFromConfirm({
      name: "input",
      message: "message",
    });

    expect(result).toBeTrue();
  });

  test("gets select input - mo mock answer", async () => {
    const prompter = new MockPrompter([]);

    try {
      await prompter.getInputFromSelect({
        name: "input",
        message: "message",
        choices: [],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("No more answers");
    }
  });

  test("gets select input - next mock answer is for a different prompt", async () => {
    const prompter = new MockPrompter([{
      promptName: "input1",
      answer: "answer1",
    }]);

    try {
      await prompter.getInputFromSelect({
        name: "input",
        message: "message",
        choices: [],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected input, got input1");
    }
  });

  test("gets select input - mock answer is not a valid choice", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: "answer1",
    }]);

    try {
      await prompter.getInputFromSelect({
        name: "input",
        message: "message",
        choices: [{ name: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected one of [answer], got answer1");
    }
  });

  test("gets select input - returns mock answer", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: "answer",
    }]);

    const result = await prompter.getInputFromSelect({
      name: "input",
      message: "message",
      choices: [{ name: "answer" }],
    });

    expect(result).toBe("answer");
  });

  test("gets multiselect input - no mock answer", async () => {
    const prompter = new MockPrompter([]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("No more answers");
    }
  });

  test("gets multiselect input - next mock answer is for a different prompt", async () => {
    const prompter = new MockPrompter([{
      promptName: "input1",
      answer: "answer1",
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe("Expected input, got input1");
    }
  });

  test("gets multiselect input - next mock answer is for correct prompt but is not an object", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: "answer",
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [{ name: "answer", value: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe('Expected object, got string');
    }
  });

  test("gets multiselect input - next mock answer is for correct prompt but is null", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: null,
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [{ name: "answer", value: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe('Expected object, got null');
    }
  });

  test("gets multiselect input - next mock answer is for correct prompt but is an array", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: [],
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [{ name: "answer", value: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe('Expected object, got array');
    }
  });

  test("gets multiselect input - mock answer is not a valid choice", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: { answer1: "answer1" },
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [{ name: "answer", value: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe('Expected something like {"answer":"answer"}, got {"answer1":"answer1"}');
    }
  });

  test("gets multiselect input - mock answer is a valid choice but the value is incorrect", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: { answer: "answer1" },
    }]);

    try {
      await prompter.getInputFromMultiselect({
        name: "input",
        message: "message",
        choices: [{ name: "answer", value: "answer" }],
      });
      throw new Error("Should not get here");
    } catch (err) {
      expect(err.message).toBe('Expected something like {"answer":"answer"}, got {"answer":"answer1"}');
    }
  });

  test("gets multiselect input - returns mock answer", async () => {
    const prompter = new MockPrompter([{
      promptName: "input",
      answer: { answer: "answer" },
    }]);

    const result = await prompter.getInputFromMultiselect({
      name: "input",
      message: "message",
      choices: [{ name: "answer", value: "answer" }],
    });

    expect(result).toMatchObject({ answer: "answer" });
  });
});