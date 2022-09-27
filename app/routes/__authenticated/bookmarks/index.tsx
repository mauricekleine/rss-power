import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { ResourceCard } from "~/features/resources";
import { BookmarksSimple } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
import { LazyList, parsePaginatedSearchParams } from "~/features/ui/lists";
import { PageHeader } from "~/features/ui/typography";

import { getPaginatedResourcesForUserId } from "~/models/resource.server";
import type { UserResourceFilter } from "~/models/user-resource.server";
import { getUserResourceCountForUserId } from "~/models/user-resource.server";

import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { limit, offset } = parsePaginatedSearchParams(url.searchParams);

  const filter: UserResourceFilter = { isBookmarked: true };

  try {
    const [count, resources] = await Promise.all([
      getUserResourceCountForUserId({ filter, userId }),
      getPaginatedResourcesForUserId({
        filter,
        limit,
        offset,
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

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <Stack alignItems="center" gap="gap-1">
          <BookmarksSimple className="h-6 w-6 text-black" weight="bold" />

          <PageHeader>Bookmarks</PageHeader>
        </Stack>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          Everything you've bookmarked
        </p>
      </div>

      <LazyList
        count={data.count}
        items={data.resources}
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
