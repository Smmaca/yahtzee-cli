import config from "./config";
import Game from "./Game";
import { main } from "./index";

jest.mock("./Game");

const MockGame = Game as jest.MockedClass<typeof Game>;

describe("main", () => {
  test("inits and loops the game", () => {
    main();

    expect(MockGame).toHaveBeenCalledWith(config);
    expect(MockGame.mock.instances[0].init).toHaveBeenCalled();
    expect(MockGame.mock.instances[0].loop).toHaveBeenCalled();
  });
});
