import classNames from "classnames";
import type { ReactNode } from "react";

import { useCardContext } from "./card-context";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function CardFooter({ children }: Props) {
  const { isInactive } = useCardContext();

  return (
    <div
      className={classNames("py-2 px-4 sm:px-6", {
        "bg-gray-100": isInactive,
        "bg-gray-50": !isInactive,
      })}
    >
      {children}
    </div>
  );
}
