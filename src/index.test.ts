import config from "./config";
import Game from "./modules/Game";
import { main } from "./index";
import CLIPrompter from "./prompters/CLIPrompter";
import MainMenuScreen from "./gameScreens/MainMenuScreen";

jest.mock("./modules/Game");
jest.mock("./prompters/CLIPrompter");
jest.mock("./gameScreens/MainMenuScreen");

const MockGame = Game as jest.MockedClass<typeof Game>;
const MockedPrompter = CLIPrompter as jest.MockedClass<typeof CLIPrompter>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("main", () => {
  beforeEach(() => {
    MockedPrompter.mockClear();
    MockGame.mockClear();
    MockMainMenuScreen.mockClear();
  });
  
  test("inits and loops the game", () => {
    main();
    
    expect(MockedPrompter).toHaveBeenCalledOnce();
    expect(MockGame).toHaveBeenCalledWith(config, MockedPrompter.mock.instances[0]);
    expect(MockGame.mock.instances[0].init).toHaveBeenCalled();
    expect(MockMainMenuScreen).toHaveBeenCalledOnce();
    expect(MockGame.mock.instances[0].loop).toHaveBeenCalledWith(MockMainMenuScreen.mock.instances[0]);
  });
});
