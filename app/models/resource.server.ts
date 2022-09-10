import type { Feed, Image, Resource, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

import type { UserResourceFilter } from "~/models/user-resource.server";

import { prisma } from "~/db.server";

export type { Resource } from "@prisma/client";

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

export function getPaginatedResourcesForUserId({
  filter,
  start,
  userId,
}: {
  filter: UserResourceFilter;
  start?: number;
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
    skip: start,
    take: 50,
    where: {
      userResources: {
        some: {
          isBookmarked: filter.isBookmarked,
          isSnoozed: filter.isSnoozed,
          userId,
        },
      },
    },
  });
}

export type ResourcesForUserId = Awaited<
  ReturnType<typeof getPaginatedResourcesForUserId>
>;

export function getPaginatedResourcesForFeedIdAndUserId({
  feedId,
  start,
  userId,
}: {
  feedId: Feed["id"];
  start?: number;
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
    skip: start,
    take: 50,
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

export async function getPaginatedUnreadResourcesForUserId({
  start,
  userId,
}: {
  start?: number;
  userId: User["id"];
}) {
  const ids = await prisma.$queryRaw<{ id: Resource["id"] }[]>`
    SELECT "Resource".id FROM "Resource"
    LEFT OUTER JOIN "FeedResource"
      ON "FeedResource"."resourceId" = "Resource".id
    LEFT OUTER JOIN "UserFeed"
      ON "UserFeed"."feedId" = "FeedResource"."feedId"
    LEFT OUTER JOIN "UserResource"
      ON "UserResource"."resourceId" = "Resource".id AND "UserFeed"."userId" = "UserResource"."userId"
    WHERE 
      ("UserResource"."hasRead" = false OR "UserResource"."hasRead" IS NULL) AND
      ("UserFeed"."userId" = ${userId} OR "UserResource"."userId" = ${userId})
  `;

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
      publisher: {
        include: {
          image: true,
        },
      },
      image: true,
      userResources: {
        take: 1,
        where: {
          userId,
        },
      },
    },
    orderBy: [{ publishedAt: "desc" }, { feedResource: { order: "desc" } }],
    skip: start,
    take: 50,
    where: {
      id: {
        in: ids.map(({ id }) => id),
      },
    },
  });
}

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

export function getUnreadResourcesCountForUserId({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*) FROM "Resource"
    LEFT OUTER JOIN "FeedResource"
      ON "FeedResource"."resourceId" = "Resource".id
    LEFT OUTER JOIN "UserFeed"
      ON "UserFeed"."feedId" = "FeedResource"."feedId"
    LEFT OUTER JOIN "UserResource"
      ON "UserResource"."resourceId" = "Resource".id AND "UserFeed"."userId" = "UserResource"."userId"
    WHERE 
      ("UserResource"."hasRead" = false OR "UserResource"."hasRead" IS NULL) AND
      ("UserFeed"."userId" = ${userId} OR "UserResource"."userId" = ${userId})
  `;
}
