-- CreateTable
CREATE TABLE "UserChannelItem" (
    "id" TEXT NOT NULL,
    "hasRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3) NOT NULL,
    "channelItemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserChannelItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserChannelItem_channelItemId_userId_key" ON "UserChannelItem"("channelItemId", "userId");

-- AddForeignKey
ALTER TABLE "UserChannelItem" ADD CONSTRAINT "UserChannelItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChannelItem" ADD CONSTRAINT "UserChannelItem_channelItemId_fkey" FOREIGN KEY ("channelItemId") REFERENCES "ChannelItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
