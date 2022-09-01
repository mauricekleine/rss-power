import { Item } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DropdownMenuItem({ children }: Props) {
  return (
    <Item
      asChild
      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200/50 hover:text-gray-900 hover:outline-none"
    >
      {children}
    </Item>
  );
}
