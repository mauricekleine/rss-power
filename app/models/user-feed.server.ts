import type { UserFeed } from "@prisma/client";

import { prisma } from "~/db.server";

export type { UserFeed } from "@prisma/client";

export function createUserFeedForFeedIdAndUserId({
  feedId,
  userId,
}: Pick<UserFeed, "feedId" | "userId">) {
  return prisma.userFeed.create({
    data: { feedId, subscribedAt: new Date(), userId },
  });
}

export function deleteUserFeedForFeedIdAndUserId({
  feedId,
  userId,
}: Pick<UserFeed, "feedId" | "userId">) {
  return prisma.userFeed.delete({
    where: { feedId_userId: { feedId, userId } },
  });
}
