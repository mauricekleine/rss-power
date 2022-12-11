import { Avatar } from "~/features/ui/avatar";
import { TextButton } from "~/features/ui/button";
import { Dialog } from "~/features/ui/dialog";
import {
  Article,
  BookmarkSimple,
  BookmarksSimple,
  Books,
  ClockAfternoon,
  DotsThreeOutline,
  LinkBreak,
  Microphone,
  MonitorPlay,
  Plus,
  SquaresFour,
  Tray,
} from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
import { SectionHeader } from "~/features/ui/typography";

import type { FeedsForUserId } from "~/models/feed.server";
import type { ResourceCountsByGroup } from "~/models/resource.server";

import SidebarLink from "./sidebar-link";

type Props = {
  counts: ResourceCountsByGroup;
  feeds: FeedsForUserId;
};

export default function SidebarNavigation({ counts, feeds }: Props) {
  return (
    <div className="min-h-0 md:sticky md:top-10">
      <nav className="flex-1 space-y-4">
        <Dialog>
          <Dialog.Trigger>
            <button
              className="group flex w-full items-center justify-center rounded-full bg-gray-800 py-1.5 hover:bg-gray-700"
              type="button"
            >
              <Plus
                className="text-gray-200 group-hover:text-gray-100"
                size={24}
              />
            </button>
          </Dialog.Trigger>

          <Dialog.Content>
            <Dialog.Header>New resource</Dialog.Header>

            <Dialog.Body>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="link"
                >
                  URL
                </label>

                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LinkBreak
                      className="h-5 w-5 text-gray-400"
                      weight="bold"
                    />
                  </div>

                  <input
                    // aria-invalid={
                    //   actionData?.errors?.link ? true : undefined
                    // }
                    // aria-errormessage={
                    //   actionData?.errors?.link ? "url-error" : undefined
                    // }
                    autoFocus
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-600 sm:text-sm"
                    id="link"
                    name="link"
                    placeholder="https://blog.example.com/article"
                    type="url"
                    // ref={titleRef}
                  />

                  {/* 
                    {actionData?.errors?.link && (
                      <div className="pt-1 text-red-700" id="link-error">
                        {actionData.errors.link}
                      </div>
                    )} */}
                </div>
              </div>
            </Dialog.Body>

            <Dialog.Footer>
              <Stack justifyContent="end">
                <TextButton type="submit">
                  <BookmarkSimple weight="bold" />

                  <span>Save</span>
                </TextButton>
              </Stack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>

        <Stack direction="vertical" gap="gap-4" hasDivider>
          <Stack direction="vertical" gap="gap-2">
            <SectionHeader>My resources</SectionHeader>

            <div>
              <SidebarLink itemCount={counts.all} to="/resources">
                <SquaresFour className="text-black" size={18} />

                <span>All</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.articles} to="/resources/articles">
                <Article className="text-black" size={18} />

                <span>Articles</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.books} to="/resources/books">
                <Books className="text-black" size={18} />

                <span>Books</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.podcasts} to="/resources/podcasts">
                <Microphone className="text-black" size={18} />

                <span>Podcasts</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.videos} to="/resources/videos">
                <MonitorPlay className="text-black" size={18} />

                <span>Videos</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.others} to="/resources/other">
                <DotsThreeOutline className="text-black" size={18} />

                <span>Other</span>
              </SidebarLink>
            </div>
          </Stack>

          <Stack direction="vertical" gap="gap-2">
            <SectionHeader>Folders</SectionHeader>

            <div>
              <SidebarLink itemCount={counts.bookmarks} to="/folders/bookmarks">
                <BookmarksSimple className="text-black" size={18} />

                <span>Bookmarks</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.unread} to="/folders/inbox">
                <Tray className="text-black" size={18} />

                <span>Inbox</span>
              </SidebarLink>

              <SidebarLink itemCount={counts.snoozed} to="/folders/read-later">
                <ClockAfternoon className="text-black" size={18} />

                <span>Snoozed</span>
              </SidebarLink>
            </div>
          </Stack>

          <Stack direction="vertical" gap="gap-2">
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
                    <Avatar
                      size="xs"
                      src={feed.image?.url}
                      title={feed.image?.title ?? feed.title}
                    />

                    <span className="truncate">{feed.title}</span>
                  </SidebarLink>
                ))
              )}
            </div>
          </Stack>
        </Stack>
      </nav>
    </div>
  );
}
