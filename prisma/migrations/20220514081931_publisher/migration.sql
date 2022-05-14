-- AlterTable
ALTER TABLE "Feed" ADD COLUMN "imageId" TEXT;
ALTER TABLE "Feed" ADD COLUMN "publisherId" TEXT;

-- InsertData
UPDATE "Feed"
SET "imageId" = "Image"."id"
FROM (
  SELECT "Image"."id", "Image"."feedId"
  FROM "Image"
) AS "Image"
WHERE "Image"."feedId" = "Feed"."id";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN "imageId" TEXT;
ALTER TABLE "Resource" ADD COLUMN "publisherId" TEXT;

-- InsertData
UPDATE "Resource"
SET "imageId" = "Image"."id"
FROM (
  SELECT "Image"."id", "Image"."resourceId"
  FROM "Image"
) AS "Image"
WHERE "Image"."resourceId" = "Resource"."id";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_feedId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_resourceId_fkey";

-- DropIndex
DROP INDEX "Image_feedId_key";

-- DropIndex
DROP INDEX "Image_resourceId_key";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "feedId";
ALTER TABLE "Image" DROP COLUMN "resourceId";

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageId" TEXT,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- InsertData

-- ADD PUBLISHER TO ALL FEEDS
INSERT INTO "Publisher" ("id", "description", "link", "title", "updatedAt", "imageId")
SELECT "id", "description", "link", "title", CURRENT_TIMESTAMP, "imageId"
FROM "Feed";

-- UPDATE
UPDATE "Feed" SET "publisherId" = "id";

-- AlterTable
ALTER TABLE "Feed" ALTER COLUMN "publisherId" SET NOT NULL;

-- ADD PUBLISHER TO ALL RESOURCES
UPDATE "Resource"
SET "publisherId" = "FeedResource"."feedId"
FROM (
  SELECT "FeedResource"."feedId", "FeedResource"."resourceId"
  FROM "FeedResource"
) AS "FeedResource"
WHERE "FeedResource"."resourceId" = "Resource"."id";

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "publisherId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publisher" ADD CONSTRAINT "Publisher_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
