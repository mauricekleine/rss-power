import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { BellSimpleSlash } from "phosphor-react";
import invariant from "tiny-invariant";

import ChannelItemCard from "~/components/channel-item-card";

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

  try {
    const [channel, items] = await Promise.all([
      getChannel({ id: params.channelId }),
      getChannelItemsForChannelIdAndUserId({
        channelId: params.channelId,
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

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="static flex items-center space-x-2">
            {data.channel.image ? (
              <img
                alt={data.channel.image.title ?? data.channel.title}
                className="h-12 w-12 rounded-lg object-cover"
                src={data.channel?.image?.url}
              />
            ) : null}

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {data.channel.title}
              </h3>

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
            <button
              className="flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600 underline hover:text-gray-800"
              name="action"
              type="submit"
              value="unsubscribe"
            >
              <BellSimpleSlash weight="bold" />

              <span>Unsubscribe</span>
            </button>
          </Form>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          {data.channel.description}
        </p>
      </div>

      <div className="space-y-4">
        {data.items.map((item) => (
          <ChannelItemCard item={item} key={item.id} />
        ))}
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
