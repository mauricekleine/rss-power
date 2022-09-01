import { Close } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DrawerClose({ children }: Props) {
  return (
    <Close className="fixed right-5 bottom-5 z-10 animate-fade-in">
      {children}
    </Close>
  );
}
