import type { ComponentProps } from "react";
import { forwardRef } from "react";

import BaseButton from "./base-button";

const TextButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<typeof BaseButton>, "className">
>(
  (
    {
      children,
      disabled = false,
      isLoading = false,
      name,
      onClick,
      type = "button",
      value,
    },
    ref
  ) => {
    return (
      <BaseButton
        className="space-x-2 rounded-md py-2 px-4"
        disabled={disabled || isLoading}
        name={name}
        onClick={onClick}
        ref={ref}
        type={type}
        value={value}
      >
        {children}
      </BaseButton>
    );
  }
);

TextButton.displayName = "TextButton";

export default TextButton;
