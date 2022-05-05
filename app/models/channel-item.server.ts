import type { Channel, ChannelItem, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { ChannelItem } from "@prisma/client";

export function getChannelItemsForChannelIdAndUserId({
  channelId,
  start,
  userId,
}: {
  channelId: Channel["id"];
  start?: number;
  userId: User["id"];
}) {
  return prisma.channelItem.findMany({
    include: {
      channel: {
        select: {
          image: true,
          title: true,
        },
      },
      userChannelItems: {
        select: {
          isReadLater: true,
          hasRead: true,
        },
        where: {
          userId,
        },
      },
    },
    orderBy: [{ pubDate: "desc" }, { order: "desc" }],
    skip: start,
    take: 50,
    where: { channelId },
  });
}

export function getChannelItemsSavedForLater({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.channelItem.findMany({
    include: {
      channel: {
        select: {
          image: {
            select: {
              title: true,
              url: true,
            },
          },
          title: true,
        },
      },
      userChannelItems: {
        select: {
          isReadLater: true,
          hasRead: true,
        },
        where: {
          userId,
        },
      },
    },
    orderBy: [{ pubDate: "desc" }, { order: "desc" }],
    where: {
      userChannelItems: {
        some: {
          isReadLater: true,
          userId,
        },
      },
    },
  });
}

export function getChannelItemsSavedForLaterCount({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.channelItem.count({
    select: {
      _all: true,
    },
    where: {
      userChannelItems: {
        some: {
          isReadLater: true,
          userId,
        },
      },
    },
  });
}

export function getUnreadChannelItemsForUserId({
  start,
  userId,
}: {
  start?: number;
  userId: User["id"];
}) {
  return prisma.channelItem.findMany({
    include: {
      channel: {
        select: {
          image: true,
          title: true,
        },
      },
      userChannelItems: {
        select: {
          isReadLater: true,
          hasRead: true,
        },
        where: {
          userId,
        },
      },
    },
    orderBy: [{ pubDate: "desc" }],
    skip: start,
    take: 50,
    where: {
      NOT: {
        pubDate: {
          equals: null,
        },
      },
      channel: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      userChannelItems: {
        every: {
          userId,
        },
        none: {
          hasRead: true,
        },
      },
    },
  });
}

export function getUnreadChannelItemsCountForUserId({
  userId,
}: {
  userId: User["id"];
}) {
  return prisma.channelItem.count({
    select: {
      _all: true,
    },
    where: {
      pubDate: {
        not: {
          equals: null,
        },
      },
      userChannelItems: {
        every: {
          hasRead: false,
          userId,
        },
      },
    },
  });
}

export function markChannelItemAsRead({
  channelItemId,
  userId,
}: {
  channelItemId: ChannelItem["id"];
  userId: User["id"];
}) {
  return prisma.userChannelItem.upsert({
    create: {
      channelItemId,
      hasRead: true,
      isReadLater: false,
      readAt: new Date(),
      userId,
    },
    update: {
      hasRead: true,
      isReadLater: false,
      readAt: new Date(),
    },
    where: {
      channelItemId_userId: {
        channelItemId,
        userId,
      },
    },
  });
}

export function saveChannelItemToReadLater({
  channelItemId,
  userId,
}: {
  channelItemId: ChannelItem["id"];
  userId: User["id"];
}) {
  return prisma.userChannelItem.upsert({
    create: {
      channelItemId,
      isReadLater: true,
      userId,
    },
    update: {
      isReadLater: true,
    },
    where: {
      channelItemId_userId: {
        channelItemId,
        userId,
      },
    },
  });
}
