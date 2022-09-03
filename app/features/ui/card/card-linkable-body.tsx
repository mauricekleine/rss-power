import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";

import CardBody from "./card-body";
import { useCardContext } from "./card-context";

type Props = {
  children: ReactNode | ReactNode[];
  href: ComponentProps<"a">["href"];
  onClick?: ComponentProps<"a">["onClick"];
};

export default function CardLinkableBody({ children, href, onClick }: Props) {
  const { isInactive } = useCardContext();

  return (
    <a
      className={classNames({
        "hover:bg-gray-50": !isInactive,
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
