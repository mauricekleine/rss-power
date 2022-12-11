import type { UserResource } from "@prisma/client";

import { prisma } from "~/db.server";

export type { UserResource } from "@prisma/client";

export type UserResourceFilter = {
  hasRead?: boolean;
  isBookmarked?: boolean;
  isSnoozed?: boolean;
};

export function updateUserResourceForResourceIdAndUserId({
  isBookmarked,
  isSnoozed,
  hasRead,
  resourceId,
  userId,
}: {
  isBookmarked?: UserResource["isBookmarked"];
  isSnoozed?: UserResource["isSnoozed"];
  hasRead?: UserResource["hasRead"];
  resourceId: UserResource["resourceId"];
  userId: UserResource["userId"];
}) {
  return prisma.userResource.upsert({
    create: {
      bookmarkedAt: isBookmarked ? new Date() : undefined,
      isBookmarked,
      isSnoozed,
      hasRead,
      readAt: hasRead ? new Date() : undefined,
      resourceId,
      snoozedAt: isSnoozed ? new Date() : undefined,
      userId,
    },
    update: {
      bookmarkedAt: isBookmarked ? new Date() : undefined,
      isBookmarked,
      isSnoozed,
      hasRead,
      readAt: hasRead ? new Date() : undefined,
      snoozedAt: isSnoozed ? new Date() : undefined,
    },
    where: {
      resourceId_userId: {
        resourceId,
        userId,
      },
    },
  });
}
