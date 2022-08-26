import { constructChoice } from "../screen";

describe("constructChoice", () => {
  test("it constructs a choice", () => {
    const choice = constructChoice("a", { a: "A" });
    expect(choice).toEqual({
      name: "a",
      value: "a",
      message: "A",
    });
  });
});
