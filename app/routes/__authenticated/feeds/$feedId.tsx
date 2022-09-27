import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ResourceCard } from "~/features/resources";
import { Avatar } from "~/features/ui/avatar";
import { TextButton } from "~/features/ui/button";
import { BellSimpleSlash } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
import { LazyList, parsePaginatedSearchParams } from "~/features/ui/lists";
import { PageHeader } from "~/features/ui/typography";

import { getFeed } from "~/models/feed.server";
import { getResourceCountForFeedId } from "~/models/resource.server";
import { getPaginatedResourcesForFeedIdAndUserId } from "~/models/resource.server";
import { deleteUserFeedForFeedIdAndUserId } from "~/models/user-feed.server";

import { requireUserId } from "~/session.server";

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.feedId, "feedId not found");

  const url = new URL(request.url);
  const { limit, offset } = parsePaginatedSearchParams(url.searchParams);

  try {
    const [count, feed, resources] = await Promise.all([
      getResourceCountForFeedId({ feedId: params.feedId }),
      getFeed(params.feedId),
      getPaginatedResourcesForFeedIdAndUserId({
        feedId: params.feedId,
        limit,
        offset,
        userId,
      }),
    ]);

    if (!feed) {
      throw new Response("Not Found", { status: 404 });
    }

    return json({ count: count._all, feed, resources });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
}

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.feedId, "feedId not found");

  await deleteUserFeedForFeedIdAndUserId({ feedId: params.feedId, userId });

  return redirect("/feeds");
}

export default function FeedPage() {
  const data = useLoaderData<typeof loader>();
  const transition = useTransition();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-start">
          <Stack alignItems="center" gap="gap-2">
            <Avatar
              size="lg"
              src={data.feed.image?.url ?? undefined}
              title={data.feed.title}
            />

            <Stack direction="vertical" gap="gap-0">
              <PageHeader>{data.feed.title}</PageHeader>

              <a
                className="text-xs font-medium tracking-tighter text-gray-500 hover:text-gray-400"
                href={data.feed.link}
                rel="noreferrer"
                target="_blank"
              >
                {data.feed.link}
              </a>
            </Stack>
          </Stack>

          <Form className="-mt-1.5 -mr-2 flex justify-end" method="post">
            <TextButton
              isLoading={
                transition.state === "submitting" &&
                transition.submission.formData.get("action") === "unsubscribe"
              }
              type="submit"
            >
              <BellSimpleSlash weight="bold" />

              <span>Unsubscribe</span>
            </TextButton>
          </Form>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          {data.feed.description}
        </p>
      </div>

      <LazyList
        count={data.count}
        items={data.resources}
        renderItem={(item) => (
          <ResourceCard resource={item} userResource={item.userResources[0]} />
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
