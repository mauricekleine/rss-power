import { NavLink } from "@remix-run/react";
import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode[];
  to: ComponentProps<typeof NavLink>["to"];
};

export default function SidebarFolderLink({ children, to }: Props) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        classNames(
          "group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          {
            "bg-gray-100 text-gray-900": isActive,
            "text-gray-700 hover:bg-gray-50 hover:text-gray-900": !isActive,
          }
        )
      }
    >
      <span className="flex items-center space-x-2 truncate">{children}</span>
    </NavLink>
  );
}
