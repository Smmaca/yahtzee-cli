import { roundToDP } from "../number";

describe("roundToDP", () => {
  test("it rounds to the specified decimal places", () => {
    expect(roundToDP(1.3456, 0)).toBe(1);
    expect(roundToDP(1.3456, 1)).toBe(1.3);
    expect(roundToDP(1.3456, 2)).toBe(1.35);
    expect(roundToDP(1.3456, 3)).toBe(1.346);
    expect(roundToDP(1.3456, 4)).toBe(1.3456);
  });
});