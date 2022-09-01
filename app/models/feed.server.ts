import type { Image, Feed as PrismaFeed, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

import { prisma } from "~/db.server";

export function createFeed({
  description,
  image,
  link,
  origin,
  title,
  userId,
}: Pick<PrismaFeed, "description" | "link" | "origin" | "title"> & {
  image?: Pick<Image, "link" | "title" | "url">;
  userId: User["id"];
}) {
  return prisma.feed.create({
    data: {
      description,
      image: image?.url
        ? {
            connectOrCreate: {
              create: {
                link: image.link,
                title: image.title,
                url: image.url,
              },
              where: {
                url: image.url,
              },
            },
          }
        : undefined,
      link,
      origin,
      publisher: {
        create: {
          description,
          image: image?.url
            ? {
                connectOrCreate: {
                  create: {
                    link: image.link,
                    title: image.title,
                    url: image.url,
                  },
                  where: {
                    url: image.url,
                  },
                },
              }
            : undefined,
          link,
          title,
        },
      },
      title,
      userFeeds: {
        create: {
          userId,
        },
      },
    },
  });
}

export function getFeed(id: PrismaFeed["id"]) {
  return prisma.feed.findUnique({ include: { image: true }, where: { id } });
}

export type Feed = NonNullable<SerializeFrom<typeof getFeed>>;

export function getFeedForOrigin({ origin }: Pick<PrismaFeed, "origin">) {
  return prisma.feed.findUnique({
    where: { origin },
  });
}

export function getFeeds() {
  return prisma.feed.findMany({
    include: {
      _count: { select: { feedResources: true, userFeeds: true } },
      image: true,
    },
  });
}

export type Feeds = SerializeFrom<typeof getFeeds>;

export function getFeedsForUserId({ userId }: { userId: User["id"] }) {
  return prisma.feed.findMany({
    include: {
      _count: {
        select: {
          feedResources: true,
        },
      },
    },
    orderBy: [{ title: "asc" }],
    where: {
      userFeeds: {
        some: {
          userId,
        },
      },
    },
  });
}

export type FeedsForUserId = SerializeFrom<typeof getFeedsForUserId>;

export function getFeedsToUpdate() {
  return prisma.feed.findMany({
    include: {
      _count: {
        select: {
          userFeeds: true,
        },
      },
      image: true,
      feedResources: {
        include: { resource: true },
      },
    },
  });
}

export function getSuggestedFeedsForUserId({ userId }: { userId: User["id"] }) {
  return prisma.feed.findMany({
    include: {
      _count: {
        select: {
          userFeeds: true,
        },
      },
      image: true,
    },
    where: {
      userFeeds: {
        every: {
          userId: {
            not: userId,
          },
        },
      },
    },
  });
}

export type FeedSuggestions = SerializeFrom<typeof getSuggestedFeedsForUserId>;

export function updateFeed(
  id: PrismaFeed["id"],
  {
    description,
    image,
    link,
    title,
  }: {
    description?: PrismaFeed["description"];
    image?: {
      link?: Image["link"];
      title?: Image["title"];
      url: Image["url"];
    };
    link?: PrismaFeed["link"];
    title?: PrismaFeed["title"];
  }
) {
  return prisma.feed.update({
    data: {
      description,
      image: image?.url
        ? {
            connectOrCreate: {
              create: {
                link: image.link,
                title: image.title,
                url: image.url,
              },
              where: {
                url: image.url,
              },
            },
          }
        : undefined,
      link,
      title,
    },
    where: {
      id,
    },
  });
}
