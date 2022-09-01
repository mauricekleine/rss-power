import { Trigger } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DropdownMenuTrigger({ children }: Props) {
  return (
    <Trigger asChild className="focus:outline-none">
      {children}
    </Trigger>
  );
}
