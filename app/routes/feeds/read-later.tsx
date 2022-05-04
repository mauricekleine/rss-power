import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import { BookmarkSimple } from "phosphor-react";
import invariant from "tiny-invariant";

import ChannelItemCard from "~/components/channels/channel-item-card";
import PageHeader from "~/components/ui/typography/page-header";

import {
  getChannelItemsSavedForLater,
  markChannelItemAsRead,
} from "~/models/channel-item.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  items: Awaited<ReturnType<typeof getChannelItemsSavedForLater>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  try {
    const items = await getChannelItemsSavedForLater({
      userId,
    });

    return json<LoaderData>({ items });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const channelItemId = formData.get("channelItemId");
  invariant(channelItemId, "channelItemId not found");

  if (typeof channelItemId !== "string") {
    throw new Response("channelItemId not found", { status: 401 });
  }

  await markChannelItemAsRead({
    channelItemId,
    userId,
  });

  return redirect(`/feeds/read-later`);
};

export default function ReadLaterPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookmarkSimple className="h-5 w-5 text-gray-900" weight="bold" />

            <PageHeader>Read later</PageHeader>
          </div>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          Articles you've marked as read later
        </p>
      </div>

      <div className="space-y-4">
        {data.items.map((item) => (
          <ChannelItemCard item={item} key={item.id} showChannelInformation />
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
