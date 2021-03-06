import { Link } from "@remix-run/react";
import { BookmarksSimple, ClockAfternoon, Plus, Tray } from "phosphor-react";

import DropdownMenu from "../ui/dropdown-menu/dropdown-menu";

import SidebarLink from "~/components/nav/sidebar-link";
import SectionHeader from "~/components/ui/typography/section-header";

import type { FeedsForUserId } from "~/models/feed.server";
import type { User } from "~/models/user.server";

type Props = {
  bookmarkedResourcesCount: number;
  feeds: FeedsForUserId;
  unreadResourcesCount: number;
  snoozedResourcesCount: number;
  user: User;
};

export default function SidebarNavigation({
  bookmarkedResourcesCount,
  feeds,
  snoozedResourcesCount,
  unreadResourcesCount,
  user,
}: Props) {
  return (
    <div className="flex min-h-0 md:sticky md:top-10">
      <nav className="flex-1 space-y-4">
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <button
              className="group flex w-full items-center justify-center rounded-full bg-gray-800 py-1.5 hover:bg-gray-700"
              type="button"
            >
              <Plus
                className="text-gray-200 group-hover:text-gray-100"
                size={24}
              />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content>
            <DropdownMenu.Item>
              <Link to="/bookmarks/new">New bookmark</Link>
            </DropdownMenu.Item>

            <DropdownMenu.Item>
              <Link to="/feeds/new">New feed</Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>

        <div className="space-y-2">
          <SectionHeader>Folders</SectionHeader>

          <div>
            <SidebarLink itemCount={bookmarkedResourcesCount} to="bookmarks">
              <BookmarksSimple className="text-black" size={18} />

              <span>Bookmarks</span>
            </SidebarLink>

            <SidebarLink itemCount={unreadResourcesCount} to="inbox">
              <Tray className="text-black" size={18} />

              <span>Inbox</span>
            </SidebarLink>

            <SidebarLink itemCount={snoozedResourcesCount} to="read-later">
              <ClockAfternoon className="text-black" size={18} />

              <span>Snoozed</span>
            </SidebarLink>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-2">
          <SectionHeader>Feeds</SectionHeader>

          <div>
            {feeds.length === 0 ? (
              <p className="p-4">No feeds yet</p>
            ) : (
              feeds.map((feed) => (
                <SidebarLink
                  itemCount={feed._count.feedResources}
                  key={feed.id}
                  to={`/feeds/${feed.id}`}
                >
                  {feed.title}
                </SidebarLink>
              ))
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
