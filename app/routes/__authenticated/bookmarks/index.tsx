import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { ResourceCard } from "~/features/resources";
import { BookmarksSimple } from "~/features/ui/icon";
import { LazyList } from "~/features/ui/lists";
import { PageHeader } from "~/features/ui/typography";

import { getPaginatedResourcesForUserId } from "~/models/resource.server";
import type { UserResourceFilter } from "~/models/user-resource.server";
import { getUserResourceCountForUserId } from "~/models/user-resource.server";

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

  const filter: UserResourceFilter = { isBookmarked: true };

  try {
    const [count, resources] = await Promise.all([
      getUserResourceCountForUserId({ filter, userId }),
      getPaginatedResourcesForUserId({
        filter,
        start,
        userId,
      }),
    ]);

    return json({ count: count._all, resources });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function BookmarksPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof data>();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <BookmarksSimple className="h-6 w-6 text-black" weight="bold" />

            <PageHeader>Bookmarks</PageHeader>
          </div>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          Everything you've bookmarked
        </p>
      </div>

      <LazyList<typeof data.resources[0]>
        count={data.count}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.resources}
        items={fetcher.data?.resources}
        loadMoreItems={(count) => {
          fetcher.load(`/bookmarks?start=${count}`);
        }}
        renderItem={(item) => (
          <ResourceCard
            resource={item}
            showPublisherInformation
            userResource={item.userResources[0]}
          />
        )}
      />
    </div>
  );
}
