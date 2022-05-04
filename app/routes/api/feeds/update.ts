import type { ActionFunction } from "@remix-run/server-runtime";
import { compareAsc } from "date-fns";
import RssParser from "rss-parser";

import {
  deleteChannelImage,
  getChannelsToUpdate,
  updateChannel,
} from "~/models/channel.server";

const parser = new RssParser();

export const action: ActionFunction = async ({ request }) => {
  const headers = request.headers;
  const authorization = headers.get("Authorization");

  if (authorization !== `Bearer ${process.env.UPDATE_CRON_KEY}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const channels = await getChannelsToUpdate();

    const promises = channels
      .filter((channel) => channel._count.users > 0)
      .map(async (channel) => {
        const parsed = await parser.parseURL(channel.origin);

        const newItems = parsed.items.filter(
          (newItem) =>
            !channel.items.find((item) => {
              const hasSameGuid = item.guid === newItem.guid;
              const hasSameLink = item.link === newItem.link;
              const hasSamePubDate =
                item.pubDate !== null &&
                typeof newItem.pubDate === "string" &&
                compareAsc(item.pubDate, new Date(newItem.pubDate)) === 0;
              const hasSameTitle = item.title === newItem.title;

              // TODO: is this enough to guarantee uniqueness?
              return (
                hasSameGuid ||
                (hasSamePubDate && hasSameTitle) ||
                (hasSameLink && hasSameTitle)
              );
            })
        );

        /*
          Assuming that items are returned in the order the author intended,
          we want to give the last element returned the lowest `order`.
          Since we rely on auto-increment, reversing the array should be sufficient.
        */
        const ascendingItems = newItems.reverse();

        console.log(`Updating channel ${channel.title} from ${channel.origin}`);

        if (
          parsed.image?.url &&
          channel.image &&
          channel.image.url !== parsed.image.url
        ) {
          deleteChannelImage({ id: channel.image.id });
        }

        await updateChannel({
          data: {
            description: parsed.description ?? channel.description,
            image:
              parsed.image?.url && channel.image?.url !== parsed.image.url
                ? {
                    link: parsed.image?.link || (parsed.link ?? channel.link),
                    title:
                      parsed.image?.title || (parsed.title ?? channel.title),
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
            link: parsed.link ?? channel.title,
            title: parsed.title ?? channel.title,
          },
          id: channel.id,
        });
      });

    await Promise.allSettled(promises);

    return new Response("OK");
  } catch (e) {
    return new Response("ERROR", { status: 500 });
  }
};
