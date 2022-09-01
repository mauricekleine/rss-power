import classNames from "classnames";
import type { ReactNode } from "react";

import { CardContextProvider } from "./card-context";

type Props = {
  children: ReactNode | ReactNode[];
  isInactive?: boolean;
};

export default function Card({ children, isInactive = false }: Props) {
  return (
    <CardContextProvider value={{ isInactive }}>
      <div
        className={classNames(
          "flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg shadow",
          {
            "bg-gray-100": isInactive,
            "bg-white ": !isInactive,
          }
        )}
      >
        {children}
      </div>
    </CardContextProvider>
  );
}
