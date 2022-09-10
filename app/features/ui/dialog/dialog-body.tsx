import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DialogBody({ children }: Props) {
  return <div className="flex-1 px-4 py-5 sm:p-6">{children}</div>;
}
