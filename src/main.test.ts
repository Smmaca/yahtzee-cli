import Game from "./modules/Game";
import main from "./main";
import MainMenuScreen from "./gameScreens/MainMenuScreen";
import mockConfig from "./testUtils/MockConfig";
import MockPrompter from "./modules/prompters/MockPrompter";

jest.mock("./modules/Game");
jest.mock("./gameScreens/MainMenuScreen");

const MockGame = Game as jest.MockedClass<typeof Game>;
const MockMainMenuScreen = MainMenuScreen as jest.MockedClass<typeof MainMenuScreen>;

describe("main", () => {
  beforeEach(() => {
    MockGame.mockClear();
    MockMainMenuScreen.mockClear();
  });
  
  test("inits and loops the game", async () => {
    const mockPrompter = new MockPrompter();
    await main(mockConfig, mockPrompter);
    
    expect(MockGame).toHaveBeenCalledWith(mockConfig, mockPrompter);
    expect(MockGame.mock.instances[0].init).toHaveBeenCalled();
    expect(MockMainMenuScreen).toHaveBeenCalledOnce();
    expect(MockGame.mock.instances[0].loop).toHaveBeenCalledWith(MockMainMenuScreen.mock.instances[0]);
  });
});
