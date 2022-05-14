import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Tray } from "phosphor-react";

import InfiniteScroller from "~/components/infinite-scroller";
import ResourceCard from "~/components/resources/resource-card";
import PageHeader from "~/components/ui/typography/page-header";

import type { ResourcesForUserId } from "~/models/resource.server";
import { getPaginatedUnreadResourcesForUserId } from "~/models/resource.server";
import { getUnreadResourcesCountForUserId } from "~/models/resource.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  count: number;
  resources: ResourcesForUserId;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);

  const startString = url.searchParams.get("start");
  const start = !startString
    ? undefined
    : Number.isInteger(parseInt(startString))
    ? parseInt(startString)
    : undefined;

  try {
    const [count, resources] = await Promise.all([
      getUnreadResourcesCountForUserId({ userId }),
      getPaginatedUnreadResourcesForUserId({
        start,
        userId,
      }),
    ]);

    return json<LoaderData>({ count: count[0].count, resources });
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
          <div className="flex items-center space-x-1">
            <Tray className="h-6 w-6 text-black" weight="bold" />

            <PageHeader>Inbox</PageHeader>
          </div>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          One place for all your unread feeds
        </p>
      </div>

      <InfiniteScroller<typeof data.resources[0]>
        count={data.count}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.resources}
        items={fetcher.data?.resources}
        loadMoreItems={(count) => {
          fetcher.load(`/inbox?start=${count}`);
        }}
        renderItem={(item) => (
          <ResourceCard
            showPublisherInformation
            resource={item}
            userResource={item.userResources[0]}
          />
        )}
      />
    </div>
  );
}
