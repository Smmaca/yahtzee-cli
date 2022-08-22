
export enum DiceDesign {
  CLASSIC = "classic",
  DIGITS = "digits",
}

export function getPipDesign(pip: string) {
  return [
    [
      "      ",
      `   ${pip}  `,
      "______",
    ],
    [
      `    ${pip} `,
      "      ",
      `_${pip}____`,
    ],
    [
      `    ${pip} `,
      `   ${pip}  `,
      `_${pip}____`,
    ],
    [
      ` ${pip}  ${pip} `,
      "      ",
      `_${pip}__${pip}_`,
    ],
    [
      ` ${pip}  ${pip} `,
      `   ${pip}  `,
      `_${pip}__${pip}_`,
    ],
    [
      ` ${pip}  ${pip} `,
      ` ${pip}  ${pip} `,
      `_${pip}__${pip}_`,
    ],
  ];
}

export function getDigitsDesign() {
  return [1, 2, 3, 4, 5, 6].map((digit) => [
    "      ",
    `   ${digit}  `,
    "______",
  ]);
}

export function getDiceDesign(design: DiceDesign) {
  switch (design) {
    case DiceDesign.CLASSIC:
      return getPipDesign("0");
    case DiceDesign.DIGITS:
      return getDigitsDesign();
    default: 
      return getPipDesign("0");
  }
}