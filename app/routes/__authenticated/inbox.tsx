import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { ResourceCard } from "~/features/resources";
import { Tray } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
import { LazyList } from "~/features/ui/lists";
import { PageHeader } from "~/features/ui/typography";

import { getPaginatedUnreadResourcesForUserId } from "~/models/resource.server";
import { getUnreadResourcesCountForUserId } from "~/models/resource.server";

import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
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

    return json({ count: parseInt(count[0].count.toString()), resources });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function InboxPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof data>();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <Stack alignItems="center" gap="gap-1">
          <Tray className="h-6 w-6 text-black" weight="bold" />

          <PageHeader>Inbox</PageHeader>
        </Stack>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          One place for all your unread feeds
        </p>
      </div>

      <LazyList<typeof data.resources[0]>
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
