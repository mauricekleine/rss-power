import { Form, Link } from "@remix-run/react";
import {
  BookmarkSimple,
  PlusCircle,
  Rss,
  Tray,
  User as UserIcon,
} from "phosphor-react";

import SidebarLink from "~/components/sidebar/sidebar-link";
import SectionHeader from "~/components/ui/typography/section-header";

import type { getChannelsForUserId } from "~/models/channel.server";
import type { User } from "~/models/user.server";

type Props = {
  channels: Awaited<ReturnType<typeof getChannelsForUserId>>;
  inboxCount: number;
  readLaterCount: number;
  user: User;
};

export default function SidebarNavigation({
  channels,
  inboxCount,
  readLaterCount,
  user,
}: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
        <div className="flex flex-shrink-0 items-center space-x-2 border-b border-gray-200 px-4 pb-4">
          <Rss color="black" size={32} weight="bold" />

          <span className="text-3xl font-bold">RSS Power</span>
        </div>

        <nav className="flex-1 space-y-6">
          <div className="mt-4 px-2">
            <div className="px-2">
              <SectionHeader>Folders</SectionHeader>
            </div>

            <div className="mt-1">
              <SidebarLink itemCount={inboxCount} to="inbox">
                <Tray className="text-black" weight="bold" />

                <span>Inbox</span>
              </SidebarLink>

              <SidebarLink itemCount={readLaterCount} to="read-later">
                <BookmarkSimple className="text-black" weight="bold" />

                <span>Read later</span>
              </SidebarLink>
            </div>
          </div>

          <div className="px-2">
            <div className="px-2">
              <SectionHeader>Channels</SectionHeader>
            </div>

            <div className="mt-1">
              {channels.length === 0 ? (
                <p className="p-4">No channels yet</p>
              ) : (
                channels.map((channel) => (
                  <SidebarLink
                    itemCount={channel._count.items}
                    key={channel.id}
                    to={channel.id}
                  >
                    {channel.title}
                  </SidebarLink>
                ))
              )}
            </div>
          </div>
        </nav>

        <div className="px-2">
          <Link
            to="new"
            className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            <PlusCircle size={16} weight="bold" />

            <span>New channel</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
        <div className="block w-full flex-shrink-0">
          <div className="flex items-center">
            <div>
              <UserIcon size={32} />
            </div>

            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user.email}</p>

              <div className="text-xs font-medium text-gray-500 hover:text-gray-700">
                <Form action="/logout" method="post">
                  <button type="submit">Logout</button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
