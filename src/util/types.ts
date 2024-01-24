export type Form<T> = {
  [K in keyof T]: string;
};

export type Maybe<T> = T | null;

export interface FormState<T> {
  success: Maybe<boolean>;
  message?: Maybe<string>;
  form?: Maybe<Form<T>>;
}
