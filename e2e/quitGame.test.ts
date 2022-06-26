import { main } from "../src/index";
import MockPrompter from "../src/prompters/MockPrompter";
import mockConfig from "../src/testUtils/MockConfig";

describe("Quit game", () => {
  test("", async () => {
    const prompter = new MockPrompter();

    await main(mockConfig, prompter);
  });
});
