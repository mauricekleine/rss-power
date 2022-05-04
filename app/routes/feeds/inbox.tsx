import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Tray } from "phosphor-react";

import ChannelItemCard from "~/components/channels/channel-item-card";
import InfiniteScroller from "~/components/infinite-scroller";
import PageHeader from "~/components/ui/typography/page-header";

import {
  getUnreadChannelItemsCountForUserId,
  getUnreadChannelItemsForUserId,
} from "~/models/channel-item.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  count: Awaited<ReturnType<typeof getUnreadChannelItemsCountForUserId>>;
  items: Awaited<ReturnType<typeof getUnreadChannelItemsForUserId>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  const url = new URL(request.url);

  const startString = url.searchParams.get("start");
  const start = !startString
    ? undefined
    : Number.isInteger(parseInt(startString))
    ? parseInt(startString)
    : undefined;

  try {
    const [count, items] = await Promise.all([
      getUnreadChannelItemsCountForUserId({ userId }),
      getUnreadChannelItemsForUserId({
        start,
        userId,
      }),
    ]);

    return json<LoaderData>({ count, items });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
};

export default function InboxPage() {
  const fetcher = useFetcher<LoaderData>();
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tray className="h-5 w-5 text-gray-900" weight="bold" />

            <PageHeader>Inbox</PageHeader>
          </div>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          One place for all your unread feeds
        </p>
      </div>

      <InfiniteScroller<typeof data.items[0]>
        count={data.count._all}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.items}
        items={fetcher.data?.items}
        loadMoreItems={(count) => {
          fetcher.load(`/feeds/inbox?start=${count}`);
        }}
        renderItem={(item) => (
          <ChannelItemCard item={item} showChannelInformation />
        )}
      />
    </div>
  );
}
