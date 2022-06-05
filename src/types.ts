
export enum GameMode {
  ROLL = "ROLL",
  DICE_LOCKER = "DICE_LOCKER",
  VIEW_SCORE = "VIEW_SCORE",
  EDIT_SCORE = "EDIT_SCORE",
}

export interface IGame {
  turn: number;
  diceRoll: number[];
  diceLock: boolean[];
  rollNumber: number,
  mode: GameMode;
};
