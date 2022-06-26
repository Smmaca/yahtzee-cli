
export interface IDice {
  diceCount: 5;
  values: number[];
  lock: boolean[];
  roll(): void;
  setValues(values: number[]): void;
  setLock(lock: boolean[]): void;
  resetValues(): void;
  resetLock(): void;
  reset(): void;
  toJSON(): { values: number[]; lock: boolean[] };
}
