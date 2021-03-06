import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useCatch,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { BellSimpleSlash } from "phosphor-react";
import invariant from "tiny-invariant";

import InfiniteScroller from "~/components/infinite-scroller";
import ResourceCard from "~/components/resources/resource-card";
import Avatar from "~/components/ui/avatars/avatar";
import TextButton from "~/components/ui/buttons/text-button";

import type { Feed } from "~/models/feed.server";
import { getFeed } from "~/models/feed.server";
import type { ResourcesForFeedIdAndUserId } from "~/models/resource.server";
import { getResourceCountForFeedId } from "~/models/resource.server";
import { getPaginatedResourcesForFeedIdAndUserId } from "~/models/resource.server";
import { deleteUserFeedForFeedIdAndUserId } from "~/models/user-feed.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  count: number;
  feed: Feed;
  resources: ResourcesForFeedIdAndUserId;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.feedId, "feedId not found");

  const url = new URL(request.url);

  const startString = url.searchParams.get("start");
  const start = !startString
    ? undefined
    : Number.isInteger(parseInt(startString))
    ? parseInt(startString)
    : undefined;

  try {
    const [count, feed, resources] = await Promise.all([
      getResourceCountForFeedId({ feedId: params.feedId }),
      getFeed(params.feedId),
      getPaginatedResourcesForFeedIdAndUserId({
        feedId: params.feedId,
        start,
        userId,
      }),
    ]);

    if (!feed) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({ count: count._all, feed, resources });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.feedId, "feedId not found");

  await deleteUserFeedForFeedIdAndUserId({ feedId: params.feedId, userId });

  return redirect("/feeds");
};

export default function FeedPage() {
  const fetcher = useFetcher<LoaderData>();
  const data = useLoaderData() as LoaderData;
  const transition = useTransition();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex flex-col-reverse justify-between sm:flex-row sm:items-start">
          <div className="flex items-center space-x-2">
            <Avatar
              image={data.feed.image ?? undefined}
              pageHeader
              title={data.feed.title}
            >
              <a
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
                href={data.feed.link}
                rel="noreferrer"
                target="_blank"
              >
                {data.feed.link}
              </a>
            </Avatar>
          </div>

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

      <InfiniteScroller<typeof data.resources[0]>
        count={data.count}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.resources}
        items={fetcher.data?.resources}
        loadMoreItems={(count) => {
          fetcher.load(`/feeds/${data.feed.id}?start=${count}`);
        }}
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
