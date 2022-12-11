import { ResourceType } from "@prisma/client";
import type { Feed, Image, Resource, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

import type { UserResourceFilter } from "~/models/user-resource.server";

import { prisma } from "~/db.server";

export type { Resource } from "@prisma/client";
export { ResourceType };

const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 0;

export async function createOrUpdateResource({
  description,
  image,
  link,
  publishedAt,
  publisherId,
  title,
}: Pick<Resource, "description" | "link" | "publisherId" | "title"> & {
  image?: Pick<Image, "link" | "title" | "url">;
  publishedAt?: Date;
}) {
  const existingResource = await prisma.resource.findFirst({
    where: {
      link,
    },
  });

  if (existingResource) {
    return prisma.resource.update({
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
        publishedAt,
        publisher: {
          connect: {
            id: publisherId,
          },
        },
        title,
      },
      where: {
        id: existingResource.id,
      },
    });
  }

  return prisma.resource.create({
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
      publishedAt,
      publisher: {
        connect: {
          id: publisherId,
        },
      },
      title,
    },
  });
}

export type PaginatedResourcesForUserIdFilter = {
  type?: ResourceType;
} & UserResourceFilter;

export function getPaginatedResourcesForUserId({
  filter,
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  userId,
}: {
  filter?: PaginatedResourcesForUserIdFilter;
  limit?: number;
  offset?: number;
  userId: User["id"];
}) {
  return prisma.$transaction([
    prisma.resource.count({
      where: {
        type: filter?.type,
        userResources: {
          some: {
            isBookmarked: filter?.isBookmarked,
            isSnoozed: filter?.isSnoozed,
            userId,
          },
        },
      },
    }),
    prisma.resource.findMany({
      include: {
        feedResource: {
          include: {
            feed: {
              include: {
                image: true,
              },
            },
          },
        },
        image: true,
        publisher: {
          include: {
            image: true,
          },
        },
        userResources: {
          take: 1,
          where: {
            userId,
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }, { feedResource: { order: "desc" } }],
      skip: offset,
      take: limit,
      where: {
        type: filter?.type,
        userResources: {
          some: {
            hasRead: filter?.hasRead,
            isBookmarked: filter?.isBookmarked,
            isSnoozed: filter?.isSnoozed,
            userId,
          },
        },
      },
    }),
  ]);
}

export type PaginatedResourcesForUserId = SerializeFrom<
  typeof getPaginatedResourcesForUserId
>[1];

export function getPaginatedResourcesForFeedIdAndUserId({
  feedId,
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  userId,
}: {
  feedId: Feed["id"];
  limit?: number;
  offset?: number;
  userId: User["id"];
}) {
  return prisma.resource.findMany({
    include: {
      feedResource: {
        include: {
          feed: {
            include: {
              image: true,
            },
          },
        },
      },
      image: true,
      publisher: {
        include: {
          image: true,
        },
      },
      userResources: {
        take: 1,
        where: {
          userId,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { feedResource: { order: "desc" } }],
    skip: offset,
    take: limit,
    where: {
      feedResource: {
        feedId,
      },
    },
  });
}

export type ResourcesForFeedIdAndUserId = SerializeFrom<
  typeof getPaginatedResourcesForFeedIdAndUserId
>;

export function getResourceCountForFeedId({ feedId }: { feedId: Feed["id"] }) {
  return prisma.resource.count({
    select: {
      _all: true,
    },
    where: {
      feedResource: {
        feedId,
      },
    },
  });
}

export function getResourceForLink({ link }: Pick<Resource, "link">) {
  return prisma.resource.findFirst({
    where: {
      link,
    },
  });
}

export async function getResourceCountsByGroupForUserId({
  userId,
}: {
  userId: User["id"];
}) {
  const [unreadCount, bookmarksCount, snoozedCount, groupedByTypeCounts] =
    await prisma.$transaction([
      prisma.resource.count({
        where: {
          userResources: {
            some: {
              hasRead: false,
              userId,
            },
          },
        },
      }),
      prisma.resource.count({
        where: {
          userResources: {
            some: {
              isBookmarked: true,
              userId,
            },
          },
        },
      }),
      prisma.resource.count({
        where: {
          userResources: {
            some: {
              isSnoozed: true,
              userId,
            },
          },
        },
      }),
      prisma.resource.groupBy({
        _count: true,
        by: ["type"],
        where: {
          userResources: {
            some: {
              userId,
            },
          },
        },
      }),
    ]);

  const counts = {
    all: 0,
    articles: 0,
    bookmarks: bookmarksCount,
    books: 0,
    others: 0,
    podcasts: 0,
    snoozed: snoozedCount,
    videos: 0,
    unread: unreadCount,
  };

  groupedByTypeCounts.forEach(({ _count, type }) => {
    const key = `${type.toLowerCase()}s` as `${Lowercase<ResourceType>}s`;
    counts[key] = _count;
  });

  counts.all =
    counts.articles +
    counts.books +
    counts.others +
    counts.podcasts +
    counts.videos;

  return counts;
}

export type ResourceCountsByGroup = SerializeFrom<
  typeof getResourceCountsByGroupForUserId
>;
