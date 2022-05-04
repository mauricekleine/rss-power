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

import ChannelItemCard from "~/components/channels/channel-item-card";
import InfiniteScroller from "~/components/infinite-scroller";
import TextButton from "~/components/ui/text-button";
import PageHeader from "~/components/ui/typography/page-header";

import { getChannelItemsForChannelIdAndUserId } from "~/models/channel-item.server";
import { getChannel, removeUserFromChannel } from "~/models/channel.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  channel: NonNullable<Awaited<ReturnType<typeof getChannel>>>;
  items: Awaited<ReturnType<typeof getChannelItemsForChannelIdAndUserId>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.channelId, "channelId not found");

  const url = new URL(request.url);

  const startString = url.searchParams.get("start");
  const start = !startString
    ? undefined
    : Number.isInteger(parseInt(startString))
    ? parseInt(startString)
    : undefined;

  try {
    const [channel, items] = await Promise.all([
      getChannel({ id: params.channelId }),
      getChannelItemsForChannelIdAndUserId({
        channelId: params.channelId,
        start,
        userId,
      }),
    ]);

    if (!channel) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({ channel, items });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.channelId, "channelId not found");

  await removeUserFromChannel({ id: params.channelId, userId });

  return redirect("/feeds");
};

export default function ChannelDetailsPage() {
  const fetcher = useFetcher<LoaderData>();
  const data = useLoaderData() as LoaderData;
  const transition = useTransition();

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.channel.image ? (
              <img
                alt={data.channel.image.title ?? data.channel.title}
                className="h-12 w-12 rounded-lg object-cover"
                src={data.channel?.image?.url}
              />
            ) : null}

            <div>
              <PageHeader>{data.channel.title}</PageHeader>

              <a
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
                href={data.channel.link}
                rel="noreferrer"
                target="_blank"
              >
                {data.channel.link}
              </a>
            </div>
          </div>

          <Form method="post">
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
          {data.channel.description}
        </p>
      </div>

      <InfiniteScroller<typeof data.items[0]>
        count={data.channel._count.items}
        isDisabled={fetcher.state !== "idle"}
        isLoading={fetcher.state === "loading"}
        initialItems={data.items}
        items={fetcher.data?.items}
        loadMoreItems={(count) => {
          fetcher.load(`/feeds/${data.channel.id}?start=${count}`);
        }}
        renderItem={(item) => <ChannelItemCard item={item} />}
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
    return <div>Channel not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
