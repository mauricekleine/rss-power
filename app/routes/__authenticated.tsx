import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { SidebarLayout, TopbarNavigation } from "~/features/navigation";

import { getFeedsForUserId } from "~/models/feed.server";
import { getUnreadResourcesCountForUserId } from "~/models/resource.server";
import { getUserResourceCountForUserId } from "~/models/user-resource.server";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

const POLLING_INTERVAL = 30 * 1000; // 30s

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const [bookmarkedResources, feeds, snoozedResources, unreadResources] =
    await Promise.all([
      getUserResourceCountForUserId({ filter: { isBookmarked: true }, userId }),
      getFeedsForUserId({ userId }),
      getUserResourceCountForUserId({ filter: { isSnoozed: true }, userId }),
      getUnreadResourcesCountForUserId({ userId }),
    ]);

  return json({
    bookmarkedResourcesCount: bookmarkedResources._all,
    feeds,
    snoozedResourcesCount: snoozedResources._all,
    unreadResourcesCount: parseInt(unreadResources[0].count.toString()), //BigInt
  });
}

export default function FeedsPage() {
  const loaderData = useLoaderData<SerializeFrom<typeof loader>>();

  const fetcher = useFetcher<typeof loaderData>();
  const [data, setData] = useState<typeof loaderData>(loaderData);
  const user = useUser();

  useEffect(() => setData(loaderData), [loaderData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/feeds");
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data);
    }
  }, [fetcher.data]);

  return (
    <div className="flex h-full min-h-screen flex-col">
      <TopbarNavigation user={user} />

      <SidebarLayout
        bookmarkedResourcesCount={data.bookmarkedResourcesCount}
        feeds={data.feeds}
        snoozedResourcesCount={data.snoozedResourcesCount}
        unreadResourcesCount={data.unreadResourcesCount}
        user={user}
      >
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
