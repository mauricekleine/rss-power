import { List, X } from "phosphor-react";
import type { ReactNode } from "react";

import SidebarNavigation from "~/components/sidebar/sidebar-navigation";
import Drawer from "~/components/ui/dialogs/drawer";

import type { FeedsForUserId } from "~/models/feed.server";
import type { User } from "~/models/user.server";

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
          <span className="sr-only">Open sidebar</span>

          <List className="h-7 w-7 text-white" weight="bold" />
        </Drawer.Trigger>

        <Drawer.Content
          closeComponent={
            <>
              <span className="sr-only">Close sidebar</span>

              <X className="h-7 w-7 text-white" weight="bold" />
            </>
          }
        >
          <SidebarNavigation
            bookmarkedResourcesCount={bookmarkedResourcesCount}
            feeds={feeds}
            snoozedResourcesCount={snoozedResourcesCount}
            unreadResourcesCount={unreadResourcesCount}
            user={user}
          />
        </Drawer.Content>
      </Drawer>

      {/* Static sidebar for desktop */}

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarNavigation
          bookmarkedResourcesCount={bookmarkedResourcesCount}
          feeds={feeds}
          snoozedResourcesCount={snoozedResourcesCount}
          unreadResourcesCount={unreadResourcesCount}
          user={user}
        />
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
