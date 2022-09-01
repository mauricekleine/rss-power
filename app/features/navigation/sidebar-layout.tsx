import type { ReactNode } from "react";

import { Drawer } from "~/features/ui/drawer";
import { List, X } from "~/features/ui/icon";

import type { FeedsForUserId } from "~/models/feed.server";
import type { User } from "~/models/user.server";

import SidebarNavigation from "./sidebar-navigation";

type Props = {
  bookmarkedResourcesCount: number;
  children: ReactNode;
  feeds: FeedsForUserId;
  snoozedResourcesCount: number;
  unreadResourcesCount: number;
  user: User;
};

export default function SidebarLayout({
  bookmarkedResourcesCount,
  children,
  feeds,
  snoozedResourcesCount,
  unreadResourcesCount,
  user,
}: Props) {
  return (
    <>
      <Drawer>
        <Drawer.Trigger>
          <div className="rounded-full bg-gray-600/75 p-1.5">
            <List className="text-white" size={36} />
          </div>
        </Drawer.Trigger>

        <Drawer.Content
          closeComponent={
            <div className="rounded-full bg-gray-400 p-1.5">
              <X className="text-white" size={36} />
            </div>
          }
        >
          <div className="px-4 py-6">
            <SidebarNavigation
              bookmarkedResourcesCount={bookmarkedResourcesCount}
              feeds={feeds}
              snoozedResourcesCount={snoozedResourcesCount}
              unreadResourcesCount={unreadResourcesCount}
              user={user}
            />
          </div>
        </Drawer.Content>
      </Drawer>

      {/* Static sidebar for desktop */}

      <div className="py-8">
        <div className="mx-auto max-w-3xl px-6 md:grid md:max-w-6xl md:grid-cols-12 md:gap-14 lg:px-8">
          <div className="hidden md:col-span-4 md:block lg:col-span-3">
            <SidebarNavigation
              bookmarkedResourcesCount={bookmarkedResourcesCount}
              feeds={feeds}
              snoozedResourcesCount={snoozedResourcesCount}
              unreadResourcesCount={unreadResourcesCount}
              user={user}
            />
          </div>

          <main className="md:col-span-8 lg:col-span-9">{children}</main>
        </div>
      </div>
    </>
  );
}
