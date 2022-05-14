import type { ActionFunction } from "@remix-run/server-runtime";
import { compareAsc } from "date-fns";
import RssParser from "rss-parser";

import { createFeedResource } from "~/models/feed-resource.server";
import { getFeedsToUpdate, updateFeed } from "~/models/feed.server";
import { createResource } from "~/models/resource.server";

const parser = new RssParser();

export const action: ActionFunction = async ({ request }) => {
  const headers = request.headers;
  const authorization = headers.get("Authorization");

  if (authorization !== `Bearer ${process.env.UPDATE_CRON_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const feeds = await getFeedsToUpdate();

    const promises = feeds
      .filter((feed) => feed._count.userFeeds > 0)
      .map(async (feed) => {
        console.log(`Updating feed ${feed.title} from ${feed.origin}`);

        const parsed = await parser.parseURL(feed.origin);

        await updateFeed(feed.id, {
          description: parsed.description ?? undefined,
          image:
            parsed.image?.url && feed.image?.url !== parsed.image.url
              ? {
                  link: parsed.image?.link || (parsed.link ?? feed.link),
                  title: parsed.image?.title || (parsed.title ?? feed.title),
                  url: parsed.image.url,
                }
              : undefined,
          link: parsed.link ?? undefined,
          title: parsed.title ?? undefined,
        });

        /*
          Assuming that items are returned in the order the author intended,
          we want to give the last element returned the lowest `order`.
          Since we rely on auto-increment, reversing the array should be sufficient.
        */
        const sortedItems = parsed.items.reverse();

        const filteredItems = sortedItems.filter((item) => {
          const duplicateResource = feed.feedResources.find((feedResource) => {
            const hasSameGuid = item.guid === feedResource.guid;
            const hasSameLink = item.link === feedResource.resource.link;
            const hasSamePubDate =
              typeof item.pubDate === "string" &&
              typeof feedResource.resource.publishedAt === "string" &&
              compareAsc(
                new Date(item.pubDate),
                new Date(feedResource.resource.publishedAt)
              ) === 0;
            const hasSameTitle = item.title === feedResource.resource.title;

            // TODO: is this enough to guarantee uniqueness?
            return (
              hasSameGuid ||
              (hasSamePubDate && hasSameTitle) ||
              (hasSameLink && hasSameTitle)
            );
          });

          return typeof duplicateResource === "undefined" ? true : false;
        });

        const input = filteredItems.map(async (item) => {
          const resource = await createResource({
            description: item.summary ?? item.content ?? "",
            link: item.link ?? "",
            publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
            publisherId: feed.publisherId,
            title: item.title ?? "",
          });

          return createFeedResource({
            feedId: feed.id,
            guid: item.guid ?? null,
            resourceId: resource.id,
          });
        });

        return Promise.allSettled(input);
      });

    await Promise.allSettled(promises);

    return new Response("OK");
  } catch (e) {
    return new Response("ERROR", { status: 500 });
  }
};
