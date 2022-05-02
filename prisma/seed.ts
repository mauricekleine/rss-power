import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "test@rsspower.com";

  // cleanup the existing database
  await prisma.channel.deleteMany();
  await prisma.channelItem.deleteMany();
  await prisma.image.deleteMany();
  await prisma.user.deleteMany();

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
