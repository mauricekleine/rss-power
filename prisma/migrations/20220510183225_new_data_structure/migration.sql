
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_imageId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelItem" DROP CONSTRAINT "ChannelItem_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelItem" DROP CONSTRAINT "ChannelItem_imageId_fkey";

-- DropForeignKey
ALTER TABLE "UserChannelItem" DROP CONSTRAINT "UserChannelItem_channelItemId_fkey";

-- DropForeignKey
ALTER TABLE "UserChannelItem" DROP CONSTRAINT "UserChannelItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChannelToUser" DROP CONSTRAINT "_ChannelToUser_B_fkey";

-- DropIndex
DROP INDEX "UserChannelItem_channelItemId_userId_key";

-- DropIndex
DROP INDEX "Channel_origin_key";

---------------------------------------- Image ----------------------------------------

-- AlterTable
ALTER TABLE "Image" ADD COLUMN "feedId" TEXT;
ALTER TABLE "Image" ADD COLUMN "resourceId" TEXT;

---------------------------------------- Feed ----------------------------------------

-- AlterTable
ALTER TABLE "Channel" RENAME TO "Feed";
ALTER TABLE "Feed" RENAME CONSTRAINT "Channel_pkey" TO "Feed_pkey";

-- InsertData
UPDATE "Image"
SET "feedId" = feed.id
FROM (SELECT "id", "imageId" FROM "Feed") AS feed
WHERE "Image".id = feed."imageId";

-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "imageId";

---------------------------------------- Feed Resource ----------------------------------------

-- CreateTable
CREATE TABLE "FeedResource" (
    "id" TEXT NOT NULL,
    "guid" TEXT,
    "order" SERIAL NOT NULL,
    "feedId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,

    CONSTRAINT "FeedResource_pkey" PRIMARY KEY ("id")
);

-- InsertData
INSERT INTO "FeedResource" ("id", "guid", "order", "feedId", "resourceId")
SELECT "id", "guid", "order", "channelId", "id"
FROM "ChannelItem";

---------------------------------------- Resource ----------------------------------------

-- AlterTable
ALTER TABLE "ChannelItem" DROP COLUMN "order";
-- DropSequence
DROP SEQUENCE IF EXISTS "ChannelItem_order_seq";
-- AlterTable
ALTER TABLE "ChannelItem" RENAME TO "Resource";
ALTER TABLE "Resource" RENAME CONSTRAINT "ChannelItem_pkey" TO "Resource_pkey";
ALTER TABLE "Resource" RENAME COLUMN "pubDate" TO "publishedAt";
ALTER TABLE "Resource" DROP COLUMN "channelId";
ALTER TABLE "Resource" DROP COLUMN "guid";

-- InsertData
UPDATE "Image"
SET "resourceId" = resource.id
FROM (SELECT "id", "imageId" FROM "Resource") AS resource
WHERE "Image".id = resource."imageId";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "imageId";

---------------------------------------- UserFeed ----------------------------------------

-- CreateTable
CREATE TABLE "UserFeed" (
    "id" TEXT NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserFeed_pkey" PRIMARY KEY ("id")
);

-- InsertData
INSERT INTO "UserFeed" ("id", "feedId", "userId", "updatedAt")
SELECT substring("A" for 18) || substring("B" from 18 for 18), "A", "B", CURRENT_TIMESTAMP
FROM "_ChannelToUser";

-- DropTable
DROP TABLE "_ChannelToUser";

-- AlterTable
ALTER TABLE "UserFeed" ALTER COLUMN "updatedAt" DROP DEFAULT;

---------------------------------------- UserResource ----------------------------------------

-- AlterTable
ALTER TABLE "UserChannelItem" RENAME TO "UserResource";
ALTER TABLE "UserResource" RENAME CONSTRAINT "UserChannelItem_pkey" TO "UserResource_pkey";
ALTER TABLE "UserResource" ADD COLUMN "isBookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "UserResource" ADD COLUMN "bookmarkedAt" TIMESTAMP(3);
ALTER TABLE "UserResource" RENAME COLUMN "isReadLater" TO "isSnoozed";
ALTER TABLE "UserResource" ADD COLUMN "snoozedAt" TIMESTAMP(3);
ALTER TABLE "UserResource" RENAME COLUMN "channelItemId" TO "resourceId";
ALTER TABLE "UserResource" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "UserResource" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserResource" ALTER COLUMN "updatedAt" DROP DEFAULT;

---------------------------------------- Indices & Constraints ----------------------------------------

-- CreateIndex
CREATE UNIQUE INDEX "Feed_origin_key" ON "Feed"("origin");

-- CreateIndex
CREATE UNIQUE INDEX "FeedResource_resourceId_key" ON "FeedResource"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_feedId_key" ON "Image"("feedId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_resourceId_key" ON "Image"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeed_feedId_userId_key" ON "UserFeed"("feedId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserResource_resourceId_userId_key" ON "UserResource"("resourceId", "userId");

-- AddForeignKey
ALTER TABLE "FeedResource" ADD CONSTRAINT "FeedResource_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedResource" ADD CONSTRAINT "FeedResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeed" ADD CONSTRAINT "UserFeed_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeed" ADD CONSTRAINT "UserFeed_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResource" ADD CONSTRAINT "UserResource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

