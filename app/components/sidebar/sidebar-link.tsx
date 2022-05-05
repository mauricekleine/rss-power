import { NavLink } from "@remix-run/react";
import classNames from "classnames";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  itemCount: number;
  to: ComponentProps<typeof NavLink>["to"];
};

export default function SidebarLink({
  children,
  itemCount: itemCountProp,
  to,
}: Props) {
  const [hasUpdates, setHasUpdates] = useState(false);
  const [itemCount, setItemCount] = useState(itemCountProp);

  useEffect(() => {
    if (itemCountProp !== itemCount) {
      setItemCount(itemCountProp);
      setHasUpdates(true);
    }
  }, [itemCount, itemCountProp]);

  return (
    <NavLink
      className={({ isActive }) =>
        classNames(
          "group flex flex-col rounded-md px-2 py-2 text-sm font-medium",
          {
            "bg-gray-100 font-semibold text-gray-900": isActive,
            "text-gray-700 hover:bg-gray-50 hover:text-gray-900": !isActive,
          }
        )
      }
      to={to}
    >
      {({ isActive }) => (
        <div className="flex items-center space-x-2">
          <p className="flex flex-1 items-center space-x-1 truncate text-sm tracking-tight">
            {children}
          </p>

          {itemCount > 0 ? (
            <span
              className={classNames(
                "ml-auto inline-block rounded-full py-0.5 px-3 text-xs",
                {
                  "bg-white": !hasUpdates && isActive,
                  "bg-gray-100 text-gray-600 group-hover:bg-gray-200":
                    !hasUpdates && !isActive,
                  "bg-red-100 text-red-800 group-hover:bg-red-200":
                    hasUpdates && !isActive,
                  "bg-red-200 text-red-800": hasUpdates && isActive,
                }
              )}
            >
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          ) : null}
        </div>
      )}
    </NavLink>
  );
}
