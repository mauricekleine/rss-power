import type { ComponentProps } from "react";
import { forwardRef } from "react";

import BaseButton from "./base-button";

const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ComponentProps<typeof BaseButton>, "className">
>(
  (
    {
      children,
      isDisabled = false,
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
        className="rounded-full p-2"
        isDisabled={isDisabled || isLoading}
        name={name}
        onClick={onClick}
        type={type}
        value={value}
      >
        {children}
      </BaseButton>
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
