import config from "./config";
import Game from "./modules/GameOld";
import { main } from "./index";
import CLIPrompter from "./prompters/CLIPrompter";

jest.mock("./modules/GameOld");
jest.mock("./prompters/CLIPrompter");

const MockGame = Game as jest.MockedClass<typeof Game>;
const MockedPrompter = CLIPrompter as jest.MockedClass<typeof CLIPrompter>;

describe("main", () => {
  beforeEach(() => {
    MockedPrompter.mockClear();
    MockGame.mockClear();
  });
  
  test("inits and loops the game", () => {
    main();
    
    expect(MockedPrompter).toHaveBeenCalledTimes(1);
    expect(MockGame).toHaveBeenCalledWith(config, MockedPrompter.mock.instances[0]);
    expect(MockGame.mock.instances[0].init).toHaveBeenCalled();
    expect(MockGame.mock.instances[0].loop).toHaveBeenCalled();
  });
});
