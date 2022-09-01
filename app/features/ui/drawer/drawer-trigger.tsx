import { Trigger } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DrawerTrigger({ children }: Props) {
  return (
    <Trigger className="fixed right-5 bottom-5 z-10 md:hidden">
      {children}
    </Trigger>
  );
}
