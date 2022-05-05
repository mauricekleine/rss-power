import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

import SidebarLayout from "~/components/sidebar/sidebar-layout";

import {
  getChannelItemsSavedForLaterCount,
  getUnreadChannelItemsCountForUserId,
} from "~/models/channel-item.server";
import { getChannelsForUserId } from "~/models/channel.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

const POLLING_INTERVAL = 30 * 1000; // 30s

type LoaderData = {
  channels: Awaited<ReturnType<typeof getChannelsForUserId>>;
  inboxCount: number;
  readLaterCount: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const [channels, inbox, readLater] = await Promise.all([
    getChannelsForUserId({ userId }),
    getUnreadChannelItemsCountForUserId({ userId }),
    getChannelItemsSavedForLaterCount({ userId }),
  ]);

  return json<LoaderData>({
    channels,
    inboxCount: inbox._all,
    readLaterCount: readLater._all,
  });
};

export default function FeedsPage() {
  const fetcher = useFetcher<LoaderData>();
  const loaderData = useLoaderData() as LoaderData;
  const [data, setData] = useState<LoaderData>(loaderData);
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
      <SidebarLayout
        channels={data.channels}
        inboxCount={data.inboxCount}
        readLaterCount={data.readLaterCount}
        user={user}
      >
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
