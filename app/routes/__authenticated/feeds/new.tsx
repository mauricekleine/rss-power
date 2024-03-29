import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import * as React from "react";
import RssParser from "rss-parser";

import { FeedCard } from "~/features/feeds";
import { TextButton } from "~/features/ui/button";
import { Card } from "~/features/ui/card";
import { Bell, Rss } from "~/features/ui/icon";
import { SectionHeader } from "~/features/ui/typography";

import { createOrUpdateFeedResource } from "~/models/feed-resource.server";
import {
  createFeed,
  getFeedForOrigin,
  getSuggestedFeedsForUserId,
} from "~/models/feed.server";
import { createOrUpdateResource } from "~/models/resource.server";
import { createUserFeedForFeedIdAndUserId } from "~/models/user-feed.server";

import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const origin = formData.get("origin");

  if (typeof origin !== "string" || origin.length === 0) {
    return json({ errors: { origin: "Origin is required" } }, { status: 400 });
  }

  const feed = await getFeedForOrigin({ origin });

  if (feed) {
    await createUserFeedForFeedIdAndUserId({ feedId: feed.id, userId });

    return redirect(`/feeds/${feed.id}`);
  }

  try {
    const parser = new RssParser();
    const parsed = await parser.parseURL(origin);

    if (!parsed || !parsed.link || !parsed.title) {
      return json({ errors: { origin: "Origin is invalid" } }, { status: 400 });
    }

    const feed = await createFeed({
      description: parsed.description ?? "",
      image: parsed.image?.url
        ? {
            link: parsed.image?.link || parsed.link,
            title: parsed.image?.title || parsed.title,
            url: parsed.image.url,
          }
        : undefined,
      link: parsed.link,
      origin,
      title: parsed.title,
      userId,
    });

    /*
      Assuming that items are returned in the order the author intended,
      we want to give the last element returned the lowest `order`.
      Since we rely on auto-increment, reversing the array should be sufficient.
    */
    const sortedItems = parsed.items.reverse();

    const input = sortedItems.map(async (item) => {
      const resource = await createOrUpdateResource({
        description: item.summary ?? item.content ?? "",
        link: item.link ?? "",
        publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
        publisherId: feed.publisherId,
        title: item.title ?? "",
      });

      return createOrUpdateFeedResource({
        feedId: feed.id,
        guid: item.guid ?? null,
        resourceId: resource.id,
      });
    });

    await Promise.allSettled(input);

    return redirect(`/feeds/${feed.id}`);
  } catch (e) {
    console.log(e);

    return json({ errors: { origin: "Origin is invalid" } }, { status: 400 });
  }
}

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  try {
    const feeds = await getSuggestedFeedsForUserId({ userId });

    return json({ feeds });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function NewFeedPage() {
  const actionData = useActionData<typeof action>();
  const data = useLoaderData<typeof loader>();

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
            <Card.Body>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
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
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-600 sm:text-sm"
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
            </Card.Body>

            <Card.Footer>
              <div className="flex justify-end">
                <TextButton type="submit">
                  <Bell weight="bold" />

                  <span>Save</span>
                </TextButton>
              </div>
            </Card.Footer>
          </Card>
        </Form>
      </div>

      {data.feeds.length > 0 ? (
        <div className="space-y-4">
          <SectionHeader>Subscribe to trending feeds</SectionHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.feeds
              .sort(
                (feedA, feedB) =>
                  feedB._count.userFeeds - feedA._count.userFeeds
              )
              .map((feed) => (
                <FeedCard feed={feed} key={feed.id} />
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
