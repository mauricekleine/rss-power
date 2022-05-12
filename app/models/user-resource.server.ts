import type { User, UserResource } from "@prisma/client";

import { prisma } from "~/db.server";

export type { UserResource } from "@prisma/client";

export type UserResourceFilter = {
  hasRead?: boolean;
  isBookmarked?: boolean;
  isSnoozed?: boolean;
};

export function getUserResourceCountForUserId({
  filter,
  userId,
}: {
  filter: UserResourceFilter;
  userId: User["id"];
}) {
  return prisma.userResource.count({
    select: {
      _all: true,
    },
    where: {
      isBookmarked: filter.isBookmarked,
      isSnoozed: filter.isSnoozed,
      userId,
    },
  });
}

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
      isBookmarked,
      isSnoozed,
      hasRead,
      resourceId,
      userId,
    },
    update: {
      isBookmarked,
      isSnoozed,
      hasRead,
    },
    where: {
      resourceId_userId: {
        resourceId,
        userId,
      },
    },
  });
}
