import type { Image, Publisher } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Publisher } from "@prisma/client";

export function createPublisher({
  description,
  image,
  link,
  title,
}: Pick<Publisher, "description" | "link" | "title"> & {
  image?: Pick<Image, "link" | "title" | "url">;
}) {
  return prisma.publisher.create({
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
      title,
    },
  });
}
