import type { Image } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Image } from "@prisma/client";

export function deleteImageForFeedId({
  feedId,
}: {
  feedId: NonNullable<Image["feedId"]>;
}) {
  return prisma.image.delete({ where: { feedId } });
}
