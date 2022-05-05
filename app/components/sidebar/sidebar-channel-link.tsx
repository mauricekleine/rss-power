import { NavLink } from "@remix-run/react";
import classNames from "classnames";
import { useEffect, useState } from "react";

import type { Channel } from "~/models/channel.server";

type Props = {
  channel: Channel;
  itemCount: number;
};

export default function SidebarChannelLink({
  channel,
  itemCount: itemCountProp,
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
          "group flex flex-col rounded-md px-2 py-2 text-sm font-medium mb-2",
          {
            "bg-gray-100 text-gray-900 dark:text-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600": isActive,
            "text-gray-700 dark:text-neutral-400 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-neutral-700 dark:hover:text-neutral-100": !isActive,
          }
        )
      }
      to={channel.id}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center space-x-2">
            <p className="flex-1 truncate text-base">{channel.title}</p>

            {itemCount > 0 ? (
              <span
                className={classNames(
                  {
                    "bg-white dark:bg-neutral-600 dark:text-neutral-300": !hasUpdates && isActive,
                    "bg-gray-100 dark:bg-neutral-600 text-gray-600 dark:text-neutral-300 group-hover:bg-gray-200 dark:group-hover:bg-neutral-500":
                      !hasUpdates && !isActive,
                    "bg-red-100 text-red-800 group-hover:bg-red-200":
                      hasUpdates && !isActive,
                    "bg-red-200 text-red-800": hasUpdates && isActive,
                  },
                  "ml-auto inline-block rounded-full py-0.5 px-3 text-xs"
                )}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </div>

          <p className="truncate text-sm text-gray-500 dark:text-neutral-500">
            {channel.description}
          </p>
        </>
      )}
    </NavLink>
  );
}
