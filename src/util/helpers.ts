import { ValidationError } from "yup";
import { Form } from "./types";

export const changeLanguage = (pathname: string, locale: string) => {
  if (!pathname) return "/";
  const segments = pathname.split("/");
  segments[1] = locale;
  return segments.join("/");
};

export function transformYupErrorsIntoObject<T>(
  errors: ValidationError
): Form<T> {
  return errors.inner.reduce(
    (acc, curr: any) =>
      curr.path !== undefined ? { ...acc, [curr.path]: curr.errors[0] } : acc,
    {} as Form<T>
  );
}
