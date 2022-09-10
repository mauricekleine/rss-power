import type { FeedResource } from "@prisma/client";

import { prisma } from "~/db.server";

export type { FeedResource } from "@prisma/client";

export function createOrUpdateFeedResource({
  feedId,
  guid,
  resourceId,
}: Pick<FeedResource, "feedId" | "guid" | "resourceId">) {
  return prisma.feedResource.upsert({
    create: {
      feedId,
      guid,
      resourceId,
    },
    update: {
      guid,
    },
    where: {
      resourceId,
    },
  });
}
