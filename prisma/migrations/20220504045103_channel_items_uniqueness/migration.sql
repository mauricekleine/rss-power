-- DropIndex
DROP INDEX "ChannelItem_link_key";

-- AlterTable
ALTER TABLE "ChannelItem" ADD COLUMN     "guid" TEXT;
