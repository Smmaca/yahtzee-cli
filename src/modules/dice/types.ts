
export interface IDice {
  diceCount: number;
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
