import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DialogFooter({ children }: Props) {
  return <div className="py-4 px-4 sm:px-6">{children}</div>;
}
