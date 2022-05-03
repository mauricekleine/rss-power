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
      userChannelItems: {
        select: {
          hasRead: true,
        },
        where: {
          userId,
        },
      },
    },
    orderBy: { pubDate: "desc" },
    where: { channelId },
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
      readAt: new Date(),
      userId,
    },
    update: {
      hasRead: true,
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
