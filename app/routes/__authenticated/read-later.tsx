import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useFetcher, useLoaderData } from "@remix-run/react";

import { ResourceCard } from "~/features/resources";
import { BookmarkSimple } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
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

  const filter: UserResourceFilter = { isSnoozed: true };

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

export default function ReadLaterPage() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof data>();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <Stack alignItems="center" gap="gap-1">
          <BookmarkSimple className="h-6 w-6 text-black" weight="bold" />

          <PageHeader>Read later</PageHeader>
        </Stack>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          Articles you've marked as read later
        </p>
      </div>

      <LazyList<typeof data.resources[0]>
        count={data.count}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.resources}
        items={fetcher.data?.resources}
        loadMoreItems={(count) => {
          fetcher.load(`/read-later?start=${count}`);
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Feed not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
