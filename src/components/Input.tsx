"use client";
import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
  wrapperClassName?: string;
}

// eslint-disable-next-line react/display-name
const Input = forwardRef<HTMLInputElement, Props>(
  ({ error, wrapperClassName, className, ...rest }, ref) => {
    return (
      <div className={wrapperClassName}>
        <input
          ref={ref}
          className={`${
            error ? "!border-error focus:border-error" : ""
          } ${className} `}
          {...rest}
        />
        {error && (
          <p className="text-xs text-error mt-2 font-normal">{error}</p>
        )}
      </div>
    );
  }
);

export default Input;
