import type { Password, User } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: {
      lastActiveAt: "desc",
    },
    select: {
      _count: {
        select: {
          userFeeds: true,
        },
      },
      createdAt: true,
      id: true,
      lastActiveAt: true,
      userResources: {
        select: {
          hasRead: true,
          isBookmarked: true,
          isSnoozed: true,
        },
      },
    },
  });
}

export type Users = SerializeFrom<typeof getUsers>;

export async function updateLastActiveAtById(id: User["id"]) {
  return prisma.user.update({
    data: {
      lastActiveAt: new Date(),
    },
    where: {
      id,
    },
  });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
