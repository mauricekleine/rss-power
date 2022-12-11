import { Trigger } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DialogTrigger({ children }: Props) {
  return <Trigger asChild>{children}</Trigger>;
}
