-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ARTICLE', 'BOOK', 'OTHER', 'PODCAST', 'VIDEO');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "type" "ResourceType" NOT NULL DEFAULT 'ARTICLE';
