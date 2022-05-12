import type { FeedResource } from "@prisma/client";

import { prisma } from "~/db.server";

export type { FeedResource } from "@prisma/client";

export function createFeedResource(
  data: Pick<FeedResource, "feedId" | "guid" | "resourceId">
) {
  return prisma.feedResource.create({
    data,
  });
}
