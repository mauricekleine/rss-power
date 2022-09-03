import { NavLink } from "@remix-run/react";
import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";

import { Stack } from "~/features/ui/layout";

type Props = {
  children: ReactNode | ReactNode[];
  itemCount: number;
  to: ComponentProps<typeof NavLink>["to"];
};

export default function SidebarLink({ children, itemCount, to }: Props) {
  const [hasUpdates, setHasUpdates] = useState(false);
  const [prevItemCount, setPrevItemCount] = useState(itemCount);

  if (prevItemCount !== itemCount) {
    setPrevItemCount(itemCount);
    setHasUpdates(true);
  }

  return (
    <NavLink
      className={({ isActive }) =>
        classNames("group flex flex-col rounded-md px-2 py-2 text-sm", {
          "bg-gray-200 font-medium text-gray-900": isActive,
          "text-gray-700 hover:bg-gray-200/50 hover:font-medium hover:text-gray-900":
            !isActive,
        })
      }
      to={to}
    >
      {({ isActive }) => (
        <Stack gap="gap-2">
          <p className="flex flex-1 items-center space-x-2 truncate text-sm tracking-tight">
            {children}
          </p>

          {itemCount > 0 ? (
            <span
              className={classNames(
                "ml-auto inline-block rounded-full py-0.5 px-3 text-xs",
                {
                  "bg-gray-300": !hasUpdates && isActive,
                  "bg-gray-300/50 text-gray-600": !hasUpdates && !isActive,
                  "bg-red-100 text-red-800 group-hover:bg-red-200":
                    hasUpdates && !isActive,
                  "bg-red-200 text-red-800": hasUpdates && isActive,
                }
              )}
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          ) : null}
        </Stack>
      )}
    </NavLink>
  );
}
