import { DiceDesign, getDiceDesign, getDigitsDesign, getPipDesign, getPipDesignFive, getPipDesignFour, getPipDesignOne, getPipDesignSix, getPipDesignThree, getPipDesignTwo, getRomanDesign, getSymbolsDesign, getWordyDesign } from "../diceDesigns";

describe("getPipDesignOne", () => {
  test("returns design for a dice showing a value of 1", () => {
    const design = getPipDesignOne("0");
    expect(design).toEqual(["      ", "   0  ", "______"]);
  });
});

describe("getPipDesignTwo", () => {
  test("returns design for a dice showing a value of 2", () => {
    const design = getPipDesignTwo("0");
    expect(design).toEqual(["    0 ", "      ", "_0____"]);
  });
});

describe("getPipDesignThree", () => {
  test("returns design for a dice showing a value of 3", () => {
    const design = getPipDesignThree("0");
    expect(design).toEqual(["    0 ", "   0  ", "_0____"]);
  });
});

describe("getPipDesignFour", () => {
  test("returns design for a dice showing a value of 4", () => {
    const design = getPipDesignFour("0");
    expect(design).toEqual([" 0  0 ", "      ", "_0__0_"]);
  });
});

describe("getPipDesignFive", () => {
  test("returns design for a dice showing a value of 5", () => {
    const design = getPipDesignFive("0");
    expect(design).toEqual([" 0  0 ", "   0  ", "_0__0_"]);
  });
});

describe("getPipDesignSix", () => {
  test("returns design for a dice showing a value of 6", () => {
    const design = getPipDesignSix("0");
    expect(design).toEqual([" 0  0 ", " 0  0 ", "_0__0_"]);
  });
});

describe("getPipDesign", () => {
  test("returns designs for all possible dice values in order", () => {
    const design = getPipDesign("0");
    expect(design).toEqual([
      ["      ", "   0  ", "______"],
      ["    0 ", "      ", "_0____"],
      ["    0 ", "   0  ", "_0____"],
      [" 0  0 ", "      ", "_0__0_"],
      [" 0  0 ", "   0  ", "_0__0_"],
      [" 0  0 ", " 0  0 ", "_0__0_"],
    ]);
  });
});

describe("getDigitsDesign", () => {
  test("returns designs for all possible dice values in order", () => {
    const design = getDigitsDesign();
    expect(design).toEqual([
      ["      ", "   1  ", "______"],
      ["      ", "   2  ", "______"],
      ["      ", "   3  ", "______"],
      ["      ", "   4  ", "______"],
      ["      ", "   5  ", "______"],
      ["      ", "   6  ", "______"],
    ]);
  });
});

describe("getWordyDesign", () => {
  test("returns designs for all possible dice values in order", () => {
    const design = getWordyDesign();
    expect(design).toEqual([
      ["      ", " ONE  ", "______"],
      ["      ", " TWO  ", "______"],
      ["      ", "THREE ", "______"],
      ["      ", " FOUR ", "______"],
      ["      ", " FIVE ", "______"],
      ["      ", " SIX  ", "______"],
    ]);
  });
});

describe("getRomanDesign", () => {
  test("returns designs for all possible dice values in order", () => {
    const design = getRomanDesign();
    expect(design).toEqual([
      ["      ", "   I  ", "______"],
      ["      ", "  II  ", "______"],
      ["      ", "  III ", "______"],
      ["      ", "  IV  ", "______"],
      ["      ", "   V  ", "______"],
      ["      ", "  VI  ", "______"],
    ]);
  });
});

describe("getSymbolsDesign", () => {
  test("returns designs for all possible dice values in order", () => {
    const design = getSymbolsDesign();
    expect(design).toEqual([
      ["      ", "   !  ", "______"],
      ["    @ ", "      ", "_@____"],
      ["    # ", "   #  ", "_#____"],
      [" $  $ ", "      ", "_$__$_"],
      [" %  % ", "   %  ", "_%__%_"],
      [" &  & ", " &  & ", "_&__&_"],
    ]);
  });
});

describe("getDiceDesign", () => {
  test("return classic design", () => {
    const design = getDiceDesign(DiceDesign.CLASSIC);
    expect(design).toEqual([
      ["      ", "   0  ", "______"],
      ["    0 ", "      ", "_0____"],
      ["    0 ", "   0  ", "_0____"],
      [" 0  0 ", "      ", "_0__0_"],
      [" 0  0 ", "   0  ", "_0__0_"],
      [" 0  0 ", " 0  0 ", "_0__0_"],
    ]);
  });

  test("returns digits design", () => {
    const design = getDiceDesign(DiceDesign.DIGITS);
    expect(design).toEqual([
      ["      ", "   1  ", "______"],
      ["      ", "   2  ", "______"],
      ["      ", "   3  ", "______"],
      ["      ", "   4  ", "______"],
      ["      ", "   5  ", "______"],
      ["      ", "   6  ", "______"],
    ]);
  });

  test("returns palms design", () => {
    const design = getDiceDesign(DiceDesign.PALMS);
    expect(design).toEqual([
      ["      ", "   *  ", "______"],
      ["    * ", "      ", "_*____"],
      ["    * ", "   *  ", "_*____"],
      [" *  * ", "      ", "_*__*_"],
      [" *  * ", "   *  ", "_*__*_"],
      [" *  * ", " *  * ", "_*__*_"],
    ]);
  });

  test("returns wordy design", () => {
    const design = getDiceDesign(DiceDesign.WORDY);
    expect(design).toEqual([
      ["      ", " ONE  ", "______"],
      ["      ", " TWO  ", "______"],
      ["      ", "THREE ", "______"],
      ["      ", " FOUR ", "______"],
      ["      ", " FIVE ", "______"],
      ["      ", " SIX  ", "______"],
    ]);
  });

  test("returns void design", () => {
    const design = getDiceDesign(DiceDesign.VOID);
    expect(design).toEqual([
      ["      ", "   O  ", "______"],
      ["    O ", "      ", "_O____"],
      ["    O ", "   O  ", "_O____"],
      [" O  O ", "      ", "_O__O_"],
      [" O  O ", "   O  ", "_O__O_"],
      [" O  O ", " O  O ", "_O__O_"],
    ]);
  });

  test("returns roman design", () => {
    const design = getDiceDesign(DiceDesign.ROMAN);
    expect(design).toEqual([
      ["      ", "   I  ", "______"],
      ["      ", "  II  ", "______"],
      ["      ", "  III ", "______"],
      ["      ", "  IV  ", "______"],
      ["      ", "   V  ", "______"],
      ["      ", "  VI  ", "______"],
    ]);
  });

  test("returns twinkle design", () => {
    const design = getDiceDesign(DiceDesign.TWINKLE);
    expect(design).toEqual([
      ["      ", "   +  ", "______"],
      ["    + ", "      ", "_+____"],
      ["    + ", "   +  ", "_+____"],
      [" +  + ", "      ", "_+__+_"],
      [" +  + ", "   +  ", "_+__+_"],
      [" +  + ", " +  + ", "_+__+_"],
    ]);
  });

  test("returns moneymaker design", () => {
    const design = getDiceDesign(DiceDesign.MONEYMAKER);
    expect(design).toEqual([
      ["      ", "   $  ", "______"],
      ["    $ ", "      ", "_$____"],
      ["    $ ", "   $  ", "_$____"],
      [" $  $ ", "      ", "_$__$_"],
      [" $  $ ", "   $  ", "_$__$_"],
      [" $  $ ", " $  $ ", "_$__$_"],
    ]);
  });

  test("returns riddler design", () => {
    const design = getDiceDesign(DiceDesign.RIDDLER);
    expect(design).toEqual([
      ["      ", "   ?  ", "______"],
      ["    ? ", "      ", "_?____"],
      ["    ? ", "   ?  ", "_?____"],
      [" ?  ? ", "      ", "_?__?_"],
      [" ?  ? ", "   ?  ", "_?__?_"],
      [" ?  ? ", " ?  ? ", "_?__?_"],
    ]);
  });

  test("returns symbols design", () => {
    const design = getDiceDesign(DiceDesign.SYMBOLS);
    expect(design).toEqual([
      ["      ", "   !  ", "______"],
      ["    @ ", "      ", "_@____"],
      ["    # ", "   #  ", "_#____"],
      [" $  $ ", "      ", "_$__$_"],
      [" %  % ", "   %  ", "_%__%_"],
      [" &  & ", " &  & ", "_&__&_"],
    ]);
  });

  test("returns default design if invalid design is passed", () => {
    // @ts-ignore
    const design = getDiceDesign();
    expect(design).toEqual([
      ["      ", "   0  ", "______"],
      ["    0 ", "      ", "_0____"],
      ["    0 ", "   0  ", "_0____"],
      [" 0  0 ", "      ", "_0__0_"],
      [" 0  0 ", "   0  ", "_0__0_"],
      [" 0  0 ", " 0  0 ", "_0__0_"],
    ]);
  });
});