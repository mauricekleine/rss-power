import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Bell, Rss } from "phosphor-react";
import * as React from "react";
import RssParser from "rss-parser";

import ChannelCard from "~/components/channels/channel-card";
import Card from "~/components/ui/cards/card";
import SectionHeader from "~/components/ui/typography/section-header";

import {
  addUserToChannel,
  createChannel,
  getChannelForOrigin,
  getUnsubscribedChannelsForUserId,
} from "~/models/channel.server";
import { requireUserId } from "~/session.server";

const parser = new RssParser();

type ActionData = {
  errors?: {
    origin?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const origin = formData.get("origin");

  if (typeof origin !== "string" || origin.length === 0) {
    return json<ActionData>(
      { errors: { origin: "Origin is required" } },
      { status: 400 }
    );
  }

  const existingChannel = await getChannelForOrigin({ origin });

  if (existingChannel) {
    try {
      await addUserToChannel({ id: existingChannel.id, userId });
      return redirect(`/feeds/${existingChannel.id}`);
    } catch (e) {
      console.log(e);

      return json<ActionData>(
        { errors: { origin: "Origin is invalid" } },
        { status: 400 }
      );
    }
  }

  try {
    const parsed = await parser.parseURL(origin);

    if (!parsed || !parsed.link || !parsed.title) {
      return json<ActionData>(
        { errors: { origin: "Origin is invalid" } },
        { status: 400 }
      );
    }

    /*
      Assuming that items are returned in the order the author intended,
      we want to give the last element returned the lowest `order`.
      Since we rely on auto-increment, reversing the array should be sufficient.
    */
    const ascendingItems = parsed.items.reverse();

    const channel = await createChannel({
      description: parsed.description ?? "",
      image: parsed.image?.url
        ? {
            link: parsed.image?.link || parsed.link,
            title: parsed.image?.title || parsed.title,
            url: parsed.image.url,
          }
        : undefined,
      items: ascendingItems.map((item) => ({
        description: item.summary ?? item.content ?? "",
        guid: item.guid ?? null,
        link: item.link ?? "",
        pubDate: item.pubDate ? new Date(item.pubDate) : null,
        title: item.title ?? "",
      })),
      link: parsed.link,
      origin,
      title: parsed.title,
      userId,
    });

    return redirect(`/feeds/${channel.id}`);
  } catch (e) {
    console.log(e);

    return json<ActionData>(
      { errors: { origin: "Origin is invalid" } },
      { status: 400 }
    );
  }
};

type LoaderData = {
  channels: Awaited<ReturnType<typeof getUnsubscribedChannelsForUserId>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  try {
    const channels = await getUnsubscribedChannelsForUserId({ userId });

    return json<LoaderData>({ channels });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
};

export default function NewFeedPage() {
  const actionData = useActionData() as ActionData;
  const data = useLoaderData() as LoaderData;

  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.origin) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeader>Add a new feed</SectionHeader>

        <Form method="post">
          <Card>
            <Card.CardBody>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-500"
                  htmlFor="origin"
                >
                  Feed url
                </label>

                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Rss className="h-5 w-5 text-gray-400" weight="bold" />
                  </div>

                  <input
                    aria-invalid={actionData?.errors?.origin ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.origin ? "url-error" : undefined
                    }
                    autoFocus
                    className="dark:bg-neutral-500 dark:text-neutral-50 dark:placeholder-neutral-400 block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-600 sm:text-sm"
                    id="origin"
                    name="origin"
                    placeholder="https://example.com/feed"
                    type="url"
                    ref={titleRef}
                  />

                  {actionData?.errors?.origin && (
                    <div className="pt-1 text-red-700" id="origin-error">
                      {actionData.errors.origin}
                    </div>
                  )}
                </div>
              </div>
            </Card.CardBody>

            <Card.CardFooter>
              <div className="flex justify-end">
                <button
                  className="flex items-center space-x-2 rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                  type="submit"
                >
                  <Bell weight="bold" />

                  <span>Save</span>
                </button>
              </div>
            </Card.CardFooter>
          </Card>
        </Form>
      </div>

      <div className="space-y-4">
        <SectionHeader>Subscribe to trending feeds</SectionHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.channels
            .sort(
              (channelA, channelB) =>
                channelB.users.length - channelA.users.length
            )
            .map((channel) => (
              <ChannelCard channel={channel} key={channel.id} />
            ))}
        </div>
      </div>
    </div>
  );
}
