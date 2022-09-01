import { Root } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type DropdownMenuProps = {
  children: ReactNode | ReactNode[];
};

export default function DropdownMenu({ children }: DropdownMenuProps) {
  return <Root>{children}</Root>;
}
