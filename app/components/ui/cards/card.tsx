import classNames from "classnames";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

const CardContext = createContext({ isInactive: false });

type CardProps = {
  children: ReactNode | ReactNode[];
  isInactive?: boolean;
};

function Card({ children, isInactive = false }: CardProps) {
  return (
    <CardContext.Provider value={{ isInactive }}>
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
    </CardContext.Provider>
  );
}

type CardHeaderProps = {
  children: ReactNode | ReactNode[];
};

function CardHeader({ children }: CardHeaderProps) {
  return <div className="px-4 py-5 sm:px-6">{children}</div>;
}

type CardBodyProps = {
  children: ReactNode | ReactNode[];
};

function CardBody({ children }: CardBodyProps) {
  return <div className="flex-1 px-4 py-5 sm:p-6">{children}</div>;
}

type CardFooterProps = {
  children: ReactNode | ReactNode[];
};

function CardFooter({ children }: CardFooterProps) {
  const { isInactive } = useContext(CardContext);

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

Card.CardBody = CardBody;
Card.CardFooter = CardFooter;
Card.CardHeader = CardHeader;

export default Card;
