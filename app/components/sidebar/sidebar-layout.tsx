import { List, X } from "phosphor-react";
import type { ReactNode } from "react";

import SidebarNavigation from "~/components/sidebar/sidebar-navigation";
import Drawer from "~/components/ui/dialogs/drawer";

import type { getChannelsForUserId } from "~/models/channel.server";
import type { User } from "~/models/user.server";

type Props = {
  channels: Awaited<ReturnType<typeof getChannelsForUserId>>;
  children: ReactNode;
  inboxCount: number;
  readLaterCount: number;
  user: User;
};

export default function SidebarLayout({
  channels,
  children,
  inboxCount,
  readLaterCount,
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
            channels={channels}
            inboxCount={inboxCount}
            readLaterCount={readLaterCount}
            user={user}
          />
        </Drawer.Content>
      </Drawer>

      {/* Static sidebar for desktop */}

      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <SidebarNavigation
          channels={channels}
          inboxCount={inboxCount}
          readLaterCount={readLaterCount}
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
