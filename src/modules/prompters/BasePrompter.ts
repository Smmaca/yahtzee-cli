
export interface IChoice<K extends string, V = any> {
  name: K;
  message?: string;
  value?: V;
  hint?: string;
  disabled?: boolean | string;
  role?: "separator";
}

export interface IConfirmParams {
  name: string;
  message: string;
}

export interface IInputParams extends IConfirmParams {
  initial?: string;
}

export interface ISelectParams<K extends string, V = any> extends IConfirmParams {
  choices: IChoice<K, V>[];
}

export interface IMultiselectParams<K extends string, V = any> extends ISelectParams<K, V> {
  initial?: K[];
  limit?: number;
}

export interface IPrompter {
  getInput(params: IInputParams): Promise<string>;
  getInputFromConfirm(params: IConfirmParams): Promise<boolean>;
  getInputFromSelect<K extends string, V = any>(params: ISelectParams<K, V>): Promise<K>;
  getInputFromMultiselect<K extends string, V = any>(params: IMultiselectParams<K, V>): Promise<Record<K, V>>;
}

export default abstract class BasePrompter implements IPrompter {
  abstract getInputFromConfirm(params: IConfirmParams): Promise<boolean>;
  abstract getInput(params: IInputParams): Promise<string>;
  abstract getInputFromSelect<K extends string>(params: ISelectParams<K>): Promise<K>;
  abstract getInputFromMultiselect<K extends string, V = any>(
    params: IMultiselectParams<K, V>): Promise<Record<K, V>>;
}