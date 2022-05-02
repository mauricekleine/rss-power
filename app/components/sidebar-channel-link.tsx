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
          {
            "bg-gray-100 text-gray-900": isActive,
            "text-gray-700 hover:bg-gray-50 hover:text-gray-900": !isActive,
          },
          "group flex flex-col rounded-md px-2 py-2 text-sm font-medium"
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
                    "bg-white": !hasUpdates && isActive,
                    "bg-gray-100 text-gray-600 group-hover:bg-gray-200":
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

          <p className="truncate text-sm text-gray-500">
            {channel.description}
          </p>
        </>
      )}
    </NavLink>
  );
}
