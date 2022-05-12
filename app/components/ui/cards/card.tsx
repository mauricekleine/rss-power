import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
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

type CardLinkableBodyProps = CardBodyProps & {
  disabled?: boolean;
  href: ComponentProps<"a">["href"];
  onClick?: ComponentProps<"a">["onClick"];
};

function CardLinkableBody({ children, href, onClick }: CardLinkableBodyProps) {
  const { isInactive } = useContext(CardContext);

  return (
    <a
      className={classNames({
        "bg-gray-100": isInactive,
        "bg-white hover:bg-gray-50": !isInactive,
      })}
      href={href}
      onClick={onClick}
      rel="noreferrer"
      target="_blank"
    >
      <CardBody>{children}</CardBody>
    </a>
  );
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

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.LinkableBody = CardLinkableBody;

export default Card;
