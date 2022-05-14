import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { forwardRef } from "react";

type DropdownMenuProps = {
  children: ReactNode | ReactNode[];
};

function DropdownMenu({ children }: DropdownMenuProps) {
  return <DropdownMenuPrimitive.Root>{children}</DropdownMenuPrimitive.Root>;
}

type DropdownTriggerProps = {
  children: ReactNode | ReactNode[];
};

type DropdownMenuContentProps = {
  children: ReactNode | ReactNode[];
};

const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Content
      className="mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
      ref={forwardedRef}
    >
      {children}
    </DropdownMenuPrimitive.Content>
  );
});

DropdownMenuContent.displayName = "DropdownMenuContent";

type DropdownMenuItemProps = {
  children: ReactNode | ReactNode[];
};

function DropdownMenuItem({ children }: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      asChild
      className="block w-full rounded-lg px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200/50 hover:text-gray-900 hover:outline-none"
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

type DropdownMenuLabelProps = {
  children: ReactNode | ReactNode[];
};

function DropdownMenuLabel({ children }: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label className="px-4 py-3">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

function DropdownMenuTrigger({ children }: DropdownTriggerProps) {
  return (
    <DropdownMenuPrimitive.Trigger asChild className="focus:outline-none">
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}

DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Label = DropdownMenuLabel;
DropdownMenu.Trigger = DropdownMenuTrigger;

export default DropdownMenu;
