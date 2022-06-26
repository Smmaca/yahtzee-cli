import { IChoice } from "../modules/prompters/BasePrompter";

export function constructChoice<T extends string>(
  choice: T,
  labels: Record<T, string>,
): IChoice<T, T> {
  return {
    name: choice,
    value: choice,
    message: labels[choice],
  };
}
