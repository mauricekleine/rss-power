import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  className: string;
  isDisabled?: ComponentProps<"button">["disabled"];
  isLoading?: boolean;
  name?: ComponentProps<"button">["name"];
  onClick?: ComponentProps<"button">["onClick"];
  type?: ComponentProps<"button">["type"];
  value?: ComponentProps<"button">["value"];
};

const BaseButton = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
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
      <button
        className={classNames(
          className,
          "flex items-center border text-sm font-normal text-gray-600",
          {
            "border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-800":
              !isDisabled && !isLoading,
            "animate-pulse": isLoading,
            "border-gray-200 bg-gray-100": isDisabled,
          }
        )}
        disabled={isDisabled || isLoading}
        name={name}
        onClick={onClick}
        style={isDisabled ? { pointerEvents: "none" } : undefined}
        type={type}
        value={value}
      >
        {children}
      </button>
    );
  }
);

BaseButton.displayName = "BaseButton";

export default BaseButton;
