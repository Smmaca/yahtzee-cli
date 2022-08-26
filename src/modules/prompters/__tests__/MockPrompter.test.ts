import MockPrompter from "../MockPrompter";

describe("MockPrompter", () => {
  describe("gets input", () => {
    test("no mock answer", async () => {
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
  
    test("next mock answer is for a different prompt", async () => {
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
  
    test("next mock answer is for correct prompt but is wrong type", async () => {
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
  
    test("returns mock answer", async () => {
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
  });
  
  describe("gets confirmation", () => {
    test("no mock answer", async () => {
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
  
    test("next mock answer is for a different prompt", async () => {
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
  
    test("next mock answer is for correct prompt but is wrong type", async () => {
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
  
    test("returns mock answer", async () => {
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
  });

  describe("gets select input", () => {
    test("no mock answer", async () => {
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
  
    test("next mock answer is for a different prompt", async () => {
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
  
    test("mock answer is not a valid choice", async () => {
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
  
    test("returns mock answer", async () => {
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
  });

  describe("get preview select input", () => {
    test("no mock answer", async () => {
      const prompter = new MockPrompter([]);
  
      try {
        await prompter.getInputFromPreviewSelect({
          name: "input",
          message: "message",
          choices: [],
        });
        throw new Error("Should not get here");
      } catch (err) {
        expect(err.message).toBe("No more answers");
      }
    });
  
    test("next mock answer is for a different prompt", async () => {
      const prompter = new MockPrompter([{
        promptName: "input1",
        answer: "answer1",
      }]);
  
      try {
        await prompter.getInputFromPreviewSelect({
          name: "input",
          message: "message",
          choices: [],
        });
        throw new Error("Should not get here");
      } catch (err) {
        expect(err.message).toBe("Expected input, got input1");
      }
    });
  
    test("mock answer is not a valid choice", async () => {
      const prompter = new MockPrompter([{
        promptName: "input",
        answer: "answer1",
      }]);
  
      try {
        await prompter.getInputFromPreviewSelect({
          name: "input",
          message: "message",
          choices: [{ name: "answer" }],
        });
        throw new Error("Should not get here");
      } catch (err) {
        expect(err.message).toBe("Expected one of [answer], got answer1");
      }
    });
  
    test("returns mock answer", async () => {
      const prompter = new MockPrompter([{
        promptName: "input",
        answer: "answer",
      }]);
  
      const result = await prompter.getInputFromPreviewSelect({
        name: "input",
        message: "message",
        choices: [{ name: "answer" }],
      });
  
      expect(result).toBe("answer");
    });
  });

  describe("gets multiselect input", () => {
    test("no mock answer", async () => {
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
  
    test("next mock answer is for a different prompt", async () => {
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
  
    test("next mock answer is for correct prompt but is not an object", async () => {
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
  
    test("next mock answer is for correct prompt but is null", async () => {
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
  
    test("next mock answer is for correct prompt but is an array", async () => {
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
  
    test("mock answer is not a valid choice", async () => {
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
  
    test("mock answer is a valid choice but the value is incorrect", async () => {
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
  
    test("returns mock answer", async () => {
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
});