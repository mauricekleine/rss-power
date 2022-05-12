import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  disabled?: ComponentProps<"button">["disabled"];
  isLoading?: boolean;
  name?: ComponentProps<"button">["name"];
  onClick?: ComponentProps<"button">["onClick"];
  type?: ComponentProps<"button">["type"];
  value?: ComponentProps<"button">["value"];
};

export default function TextButton({
  children,
  disabled = false,
  isLoading,
  name,
  onClick,
  type = "button",
  value,
}: Props) {
  return (
    <button
      className={classNames(
        "flex items-center space-x-2 rounded py-2 px-4 text-sm font-normal text-gray-600",
        {
          "underline hover:text-gray-800": !disabled && !isLoading,
          "animate-pulse": isLoading,
        }
      )}
      disabled={disabled || isLoading}
      name={name}
      onClick={onClick}
      type={type}
      value={value}
    >
      {children}
    </button>
  );
}
