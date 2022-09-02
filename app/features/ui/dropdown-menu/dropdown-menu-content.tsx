import { Content } from "@radix-ui/react-dropdown-menu";
import type { ReactNode } from "react";
import { forwardRef } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

const DropdownMenuContent = forwardRef<HTMLDivElement, Props>(
  ({ children }, forwardedRef) => {
    return (
      <Content
        className="z-50 mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none"
        ref={forwardedRef}
      >
        {children}
      </Content>
    );
  }
);

DropdownMenuContent.displayName = "DropdownMenuContent";

export default DropdownMenuContent;
