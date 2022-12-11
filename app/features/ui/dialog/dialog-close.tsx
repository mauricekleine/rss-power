import { Close } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DialogClose({ children }: Props) {
  return <Close>{children}</Close>;
}
