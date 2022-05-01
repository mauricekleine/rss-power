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
          "group flex flex-col px-2 py-2 text-sm font-medium rounded-md"
        )
      }
      to={channel.id}
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center space-x-2">
            <p className="flex-1 text-base truncate">{channel.title}</p>

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
                  "ml-auto inline-block py-0.5 px-3 text-xs rounded-full"
                )}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </div>

          <p className="text-gray-500 text-sm truncate">
            {channel.description}
          </p>
        </>
      )}
    </NavLink>
  );
}
