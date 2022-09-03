import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function CardHeader({ children }: Props) {
  return <div className="px-4 py-4 sm:px-6">{children}</div>;
}
