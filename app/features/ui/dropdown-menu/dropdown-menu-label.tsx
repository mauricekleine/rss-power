import { Label } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DropdownMenuLabel({ children }: Props) {
  return <Label className="px-4 py-3">{children}</Label>;
}
