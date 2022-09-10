import type { ActionArgs } from "@remix-run/server-runtime";
import RssParser from "rss-parser";

import { createOrUpdateFeedResource } from "~/models/feed-resource.server";
import { getFeedsToUpdate, updateFeed } from "~/models/feed.server";
import { createOrUpdateResource } from "~/models/resource.server";

const parser = new RssParser();

export async function action({ request }: ActionArgs) {
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
        console.log(`> Updating feed ${feed.title} from ${feed.origin}`);

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

        return Promise.allSettled(input);
      });

    await Promise.allSettled(promises);

    return new Response("OK");
  } catch (e) {
    return new Response(`ERROR: ${e}`, { status: 500 });
  }
}
