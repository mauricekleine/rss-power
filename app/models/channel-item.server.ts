import type { Channel, ChannelItem, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { ChannelItem } from "@prisma/client";

export function getChannelItemsForChannelIdAndUserId({
  channelId,
  userId,
}: {
  channelId: Channel["id"];
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
