import { DiceDesign } from "../../utils/diceDesigns";
import DiceDrawer from "../DiceDrawer";
import * as DiceDesignUtils from "../../utils/diceDesigns";

describe("DiceDrawer", () => {
  test("sets dice values and lock on instantiation", () => {
    const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5], [false, false, true, false, false]);
    expect(diceDrawer.diceValues).toEqual([1, 2, 3, 4, 5]);
    expect(diceDrawer.diceLock).toEqual([false, false, true, false, false]);
  });

  describe("drawDiceLock", () => {
    test("draws lock symbol if dice at index is locked", () => {
      const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5], [false, false, false, true, false]);
      const drawing = diceDrawer.drawDiceLock(3);
      expect(drawing).toBe("    L    ");
    });

    test("draws empty spaces if dice at index is not locked", () => {
      const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5], [false, false, false, true, false]);
      const drawing = diceDrawer.drawDiceLock(1);
      expect(drawing).toBe("         ");
    });
  });

  describe("drawDice", () => {
    let getDiceDesignSpy: jest.SpiedFunction<typeof DiceDesignUtils.getDiceDesign>;

    beforeAll(() => {
      getDiceDesignSpy = jest.spyOn(DiceDesignUtils, "getDiceDesign");
    });

    afterAll(() => {
      getDiceDesignSpy.mockRestore();
    });

    test("draws a newline if no values are given", () => {
      const diceDrawer = new DiceDrawer([], []);
      const drawing = diceDrawer.drawDice(DiceDesign.CLASSIC);
      expect(drawing).toBe("\n");
      expect(getDiceDesignSpy).not.toHaveBeenCalled();
    });

    test("draws a newline if only zeroes are given", () => {
      const diceDrawer = new DiceDrawer([0, 0, 0, 0, 0], [false, true, false, false, true]);
      const drawing = diceDrawer.drawDice(DiceDesign.CLASSIC);
      expect(drawing).toBe("\n");
      expect(getDiceDesignSpy).not.toHaveBeenCalled();
    });

    describe("classic design", () => {
      beforeEach(() => {
        getDiceDesignSpy.mockClear();
      });

      test("draws five dice without dice lock", () => {
        const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5], [false, false, false, false, false]);
        const drawing = diceDrawer.drawDice(DiceDesign.CLASSIC);
        expect(drawing).toBe(` ______   ______   ______   ______   ______  
|      | |    0 | |    0 | | 0  0 | | 0  0 | 
|   0  | |      | |   0  | |      | |   0  | 
|______| |_0____| |_0____| |_0__0_| |_0__0_| 

                                             
`);
        expect(getDiceDesignSpy).toHaveBeenCalledWith(DiceDesign.CLASSIC);
      });

      test("draws five dice with dice lock", () => {
        const diceDrawer = new DiceDrawer([2, 3, 4, 5, 6], [false, true, false, true, true]);
        const drawing = diceDrawer.drawDice(DiceDesign.CLASSIC);
        expect(drawing).toBe(` ______   ______   ______   ______   ______  
|    0 | |    0 | | 0  0 | | 0  0 | | 0  0 | 
|      | |   0  | |      | |   0  | | 0  0 | 
|_0____| |_0____| |_0__0_| |_0__0_| |_0__0_| 

             L                 L        L    
`);
        expect(getDiceDesignSpy).toHaveBeenCalledWith(DiceDesign.CLASSIC);
      });
    });

    describe("digits design", () => {
      beforeEach(() => {
        getDiceDesignSpy.mockClear();
      });
      
      test("draws five dice without dice lock", () => {
        const diceDrawer = new DiceDrawer([1, 2, 3, 4, 5], [false, false, false, false, false]);
        const drawing = diceDrawer.drawDice(DiceDesign.DIGITS);
        expect(drawing).toBe(` ______   ______   ______   ______   ______  
|      | |      | |      | |      | |      | 
|   1  | |   2  | |   3  | |   4  | |   5  | 
|______| |______| |______| |______| |______| 

                                             
`);
        expect(getDiceDesignSpy).toHaveBeenCalledWith(DiceDesign.DIGITS);
      });

      test("draws five dice with dice lock", () => {
        const diceDrawer = new DiceDrawer([2, 3, 4, 5, 6], [false, true, false, true, true]);
        const drawing = diceDrawer.drawDice(DiceDesign.DIGITS);
        expect(drawing).toBe(` ______   ______   ______   ______   ______  
|      | |      | |      | |      | |      | 
|   2  | |   3  | |   4  | |   5  | |   6  | 
|______| |______| |______| |______| |______| 

             L                 L        L    
`);
        expect(getDiceDesignSpy).toHaveBeenCalledWith(DiceDesign.DIGITS);
      });
    });
  });

  describe("renderDice", () => {
    let logSpy: jest.SpiedFunction<typeof console.log>;
    let drawDiceSpy: jest.SpiedFunction<typeof DiceDrawer.prototype.drawDice>;

    beforeAll(() => {
      logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      drawDiceSpy = jest.spyOn(DiceDrawer.prototype, "drawDice");
    });

    beforeEach(() => {
      logSpy.mockClear();
      drawDiceSpy.mockClear();
    });

    afterAll(() => {
      logSpy.mockRestore();
      drawDiceSpy.mockRestore();
    });

    test("render dice", () => {
      const diceDrawer = new DiceDrawer([2, 3, 4, 5, 6], [false, true, false, true, true]);
      diceDrawer.renderDice(DiceDesign.CLASSIC);
      expect(drawDiceSpy).toHaveBeenCalledWith(DiceDesign.CLASSIC);
      expect(logSpy).toHaveBeenCalledWith(` ______   ______   ______   ______   ______  
|    0 | |    0 | | 0  0 | | 0  0 | | 0  0 | 
|      | |   0  | |      | |   0  | | 0  0 | 
|_0____| |_0____| |_0__0_| |_0__0_| |_0__0_| 

             L                 L        L    
`);
    });
  });
});