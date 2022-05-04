import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useCatch,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import classNames from "classnames";
import { BellSimpleSlash, CircleNotch } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import ChannelItemCard from "~/components/channels/channel-item-card";
import TextButton from "~/components/ui/text-button";
import PageHeader from "~/components/ui/typography/page-header";

import {
  getChannelItemsForChannelIdAndUserId,
  markChannelItemAsRead,
  saveChannelItemToReadLater,
} from "~/models/channel-item.server";
import { getChannel, removeUserFromChannel } from "~/models/channel.server";
import { requireUserId } from "~/session.server";

export const ChannelItemActions = {
  MARK_AS_READ: "mark-as-read",
  READ_LATER: "read-later",
} as const;

type LoaderData = {
  channel: NonNullable<Awaited<ReturnType<typeof getChannel>>>;
  items: Awaited<ReturnType<typeof getChannelItemsForChannelIdAndUserId>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.channelId, "channelId not found");

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;

  try {
    const [channel, items] = await Promise.all([
      getChannel({ id: params.channelId }),
      getChannelItemsForChannelIdAndUserId({
        channelId: params.channelId,
        cursor,
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

  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "unsubscribe") {
    await removeUserFromChannel({ id: params.channelId, userId });

    return redirect("/feeds");
  }

  const channelItemId = formData.get("channelItemId");
  invariant(channelItemId, "channelItemId not found");

  if (typeof channelItemId !== "string") {
    throw new Response("channelItemId not found", { status: 401 });
  }

  if (action === ChannelItemActions.MARK_AS_READ) {
    await markChannelItemAsRead({
      channelItemId,
      userId,
    });
  }

  if (action === ChannelItemActions.READ_LATER) {
    await saveChannelItemToReadLater({
      channelItemId,
      userId,
    });
  }

  return redirect(`/feeds/${params.channelId}`);
};

const SCROLL_OFFSET = 750;

export default function ChannelDetailsPage() {
  const fetcher = useFetcher<LoaderData>();
  const data = useLoaderData() as LoaderData;
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(data.items);
  const transition = useTransition();

  const handleLoadMore = () => {
    if (fetcher.state !== "idle") {
      return;
    }

    fetcher.load(
      `/feeds/${data.channel.id}?cursor=${items[items.length - 1].id}`
    );
  };

  useEffect(() => {
    let debounce: NodeJS.Timer;

    const scrollHandler = (event: Event) => {
      clearTimeout(debounce);

      debounce = setTimeout(() => {
        if (fetcher.state !== "idle" || !ref.current) {
          return;
        }

        if (
          document.documentElement.scrollTop >
          ref.current?.offsetHeight - SCROLL_OFFSET
        ) {
          fetcher.load(
            `/feeds/${data.channel.id}?cursor=${items[items.length - 1].id}`
          );
        }
      }, 100);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      clearTimeout(debounce);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [data.channel.id, fetcher, items]);

  useEffect(() => {
    if (fetcher.state !== "idle") {
      return;
    }

    if (fetcher.data) {
      setItems((items) => [...items, ...fetcher.data.items]);
    }
  }, [fetcher.data, fetcher.state, setItems]);

  useEffect(() => {
    setItems(data.items);
  }, [data.items]);

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
              name="action"
              type="submit"
              value="unsubscribe"
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

      <div className="space-y-4" ref={ref}>
        {items.map((item) => (
          <ChannelItemCard item={item} key={item.id} />
        ))}

        {items.length < data.channel._count.items ? (
          <div className="flex justify-center">
            <TextButton
              isLoading={fetcher.state === "loading"}
              onClick={handleLoadMore}
            >
              <CircleNotch
                className={classNames({
                  "animate-spin": fetcher.state === "loading",
                })}
                weight="bold"
              />

              <span>Load more</span>
            </TextButton>
          </div>
        ) : null}
      </div>
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
