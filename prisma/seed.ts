import { faker } from "@faker-js/faker";
import type { Publisher, Resource, UserResource } from "@prisma/client";
import { PrismaClient, ResourceType } from "@prisma/client";
import bcrypt from "bcryptjs";

function getRandomElementFromArray<T extends any[] | []>(array: T): T[number] {
  return array[Math.floor(Math.random() * array.length)];
}

const resourceTypes = [
  ResourceType.ARTICLE,
  ResourceType.BOOK,
  ResourceType.OTHER,
  ResourceType.PODCAST,
  ResourceType.VIDEO,
];

const prisma = new PrismaClient();

async function seed() {
  // cleanup the existing database
  await Promise.allSettled([
    prisma.feed.deleteMany(),
    prisma.feedResource.deleteMany(),
    prisma.image.deleteMany(),
    prisma.resource.deleteMany(),
    prisma.user.deleteMany(),
    prisma.userFeed.deleteMany(),
    prisma.userResource.deleteMany(),
  ]);

  const email = "test@rsspower.com";
  const hashedPassword = await bcrypt.hash("rssisfun", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const publishers: Publisher[] = new Array(10).fill(undefined).map(() => {
    return {
      createdAt: faker.date.past(),
      description: faker.random.words(25),
      id: faker.datatype.uuid(),
      imageId: null,
      link: faker.internet.url(),
      title: faker.random.words(),
      updatedAt: new Date(),
    };
  });

  const resources: Resource[] = new Array(100).fill(undefined).map(() => {
    return {
      createdAt: faker.date.past(),
      description: faker.random.words(25),
      id: faker.datatype.uuid(),
      imageId: null,
      link: faker.internet.url(),
      publishedAt: faker.date.past(),
      publisherId: getRandomElementFromArray(publishers).id,
      title: faker.random.words(),
      type: getRandomElementFromArray(resourceTypes),
      updatedAt: new Date(),
    };
  });

  const userResources: UserResource[] = new Array(25)
    .fill(undefined)
    .map((_, i) => {
      return {
        bookmarkedAt: null,
        createdAt: faker.date.past(),
        hasRead: faker.datatype.boolean(),
        id: faker.datatype.uuid(),
        isBookmarked: faker.datatype.boolean(),
        isSnoozed: faker.datatype.boolean(),
        readAt: null,
        resourceId: resources[i * 3].id,
        snoozedAt: null,
        updatedAt: new Date(),
        userId: user.id,
      };
    });

  await prisma.publisher.createMany({
    data: publishers,
  });

  await prisma.resource.createMany({
    data: resources,
  });

  await prisma.userResource.createMany({
    data: userResources,
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
