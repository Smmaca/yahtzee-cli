
export enum DiceDesign {
  CLASSIC = "classic",
  DIGITS = "digits",
  PALMS = "palms",
  WORDY = "wordy",
  VOID = "void",
  ROMAN = "roman",
  TWINKLE = "twinkle",
  MONEYMAKER = "moneymaker",
  RIDDLER = "riddler",
  SYMBOLS = "symbols",
}

export function getPipDesignOne(pip: string) {
  return [
    "      ",
    `   ${pip}  `,
    "______",
  ];
}

export function getPipDesignTwo(pip: string) {
  return [
    `    ${pip} `,
    "      ",
    `_${pip}____`,
  ];
}

export function getPipDesignThree(pip: string) {
  return [
    `    ${pip} `,
    `   ${pip}  `,
    `_${pip}____`,
  ];
}

export function getPipDesignFour(pip: string) {
  return [
    ` ${pip}  ${pip} `,
    "      ",
    `_${pip}__${pip}_`,
  ];
}

export function getPipDesignFive(pip: string) {
  return [
    ` ${pip}  ${pip} `,
    `   ${pip}  `,
    `_${pip}__${pip}_`,
  ];
}

export function getPipDesignSix(pip: string) {
  return [
    ` ${pip}  ${pip} `,
    ` ${pip}  ${pip} `,
    `_${pip}__${pip}_`,
  ];
}

export function getPipDesign(pip: string) {
  return [
    getPipDesignOne(pip),
    getPipDesignTwo(pip),
    getPipDesignThree(pip),
    getPipDesignFour(pip),
    getPipDesignFive(pip),
    getPipDesignSix(pip),
  ];
}

export function getDigitsDesign() {
  return [1, 2, 3, 4, 5, 6].map((digit) => [
    "      ",
    `   ${digit}  `,
    "______",
  ]);
}

export function getWordyDesign() {
  return [" ONE  ", " TWO  ", "THREE ", " FOUR ", " FIVE ", " SIX  "].map((word) => [
    "      ",
    word,
    "______",
  ]);
}

export function getRomanDesign() {
  return ["   I  ", "  II  ", "  III ", "  IV  ", "   V  ", "  VI  "].map((numerals) => [
    "      ",
    numerals,
    "______",
  ]);
}

export function getSymbolsDesign() {
  return [
    getPipDesignOne("!"),
    getPipDesignTwo("@"),
    getPipDesignThree("#"),
    getPipDesignFour("$"),
    getPipDesignFive("%"),
    getPipDesignSix("&"),
  ];
}

export function getDiceDesign(design: DiceDesign) {
  switch (design) {
    case DiceDesign.CLASSIC:
      return getPipDesign("0");
    case DiceDesign.DIGITS:
      return getDigitsDesign();
    case DiceDesign.PALMS:
      return getPipDesign("*");
    case DiceDesign.WORDY:
      return getWordyDesign();
    case DiceDesign.VOID:
      return getPipDesign("O");
    case DiceDesign.ROMAN:
      return getRomanDesign();
    case DiceDesign.TWINKLE:
      return getPipDesign("+");
    case DiceDesign.MONEYMAKER:
      return getPipDesign("$");
    case DiceDesign.RIDDLER:
      return getPipDesign("?");
    case DiceDesign.SYMBOLS:
      return getSymbolsDesign();
    default: 
      return getPipDesign("0");
  }
}

/* Classic
 ______   ______   ______   ______   ______   ______
|      | |    0 | |    0 | | 0  0 | | 0  0 | | 0  0 |
|   0  | |      | |   0  | |      | |   0  | | 0  0 |
|______| |_0____| |_0____| |_0__0_| |_0__0_| |_0__0_|
*/

/* Digits
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|   1  | |   2  | |   3  | |   4  | |   5  | |   6  |
|______| |______| |______| |______| |______| |______|
*/

/* Palms
 ______   ______   ______   ______   ______   ______
|      | |    * | |    * | | *  * | | *  * | | *  * |
|   *  | |      | |   *  | |      | |   *  | | *  * |
|______| |_*____| |_*____| |_*__*_| |_*__*_| |_*__*_|
*/

/* Wordy
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
| ONE  | | TWO  | |THREE | | FOUR | | FIVE | | SIX  |
|______| |______| |______| |______| |______| |______|
*/

/* Void
 ______   ______   ______   ______   ______   ______
|      | |    O | |    O | | O  O | | O  O | | O  O |
|   O  | |      | |   O  | |      | |   O  | | O  O |
|______| |_O____| |_O____| |_O__O_| |_O__O_| |_O__O_|
*/

/* Roman
 ______   ______   ______   ______   ______   ______
|      | |      | |      | |      | |      | |      |
|   I  | |  II  | |  III | |  IV  | |   V  | |  VI  |
|______| |______| |______| |______| |______| |______|
*/

/* Twinkle
 ______   ______   ______   ______   ______   ______
|      | |    + | |    + | | +  + | | +  + | | +  + |
|   +  | |      | |   +  | |      | |   +  | | +  + |
|______| |_+____| |_+____| |_+__+_| |_+__+_| |_+__+_|
*/

/* Moneymaker
 ______   ______   ______   ______   ______   ______
|      | |    $ | |    $ | | $  $ | | $  $ | | $  $ |
|   $  | |      | |   $  | |      | |   $  | | $  $ |
|______| |_$____| |_$____| |_$__$_| |_$__$_| |_$__$_|
*/

/* Riddler
 ______   ______   ______   ______   ______   ______
|      | |    ? | |    ? | | ?  ? | | ?  ? | | ?  ? |
|   ?  | |      | |   ?  | |      | |   ?  | | ?  ? |
|______| |_?____| |_?____| |_?__?_| |_?__?_| |_?__?_|
*/

/* @#$%&!
 ______   ______   ______   ______   ______   ______
|      | |    @ | |    # | | $  $ | | %  % | | &  & |
|   !  | |      | |   #  | |      | |   %  | | &  & |
|______| |_@____| |_#____| |_$__$_| |_%__%_| |_&__&_|
*/

/* 
|   .  | |  __  | |  __  | |   .  | |  ___ | |   .  |
|  /|  | | /  \ | | /  \ | |  /   | | |__  | |  /_  |
|   |  | |   /  | |   <  | | /_|_ | |    \ | | /  \ |
|   |  | | /___ | | \__/ | |   |  | | \__/ | | \__/ |
*/