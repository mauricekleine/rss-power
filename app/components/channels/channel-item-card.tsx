import type {
  Channel,
  ChannelItem,
  Image,
  UserChannelItem,
} from "@prisma/client";
import { useSubmit } from "@remix-run/react";
import classNames from "classnames";
import DOMPurify from "isomorphic-dompurify";
import { useMemo } from "react";

import RelativeDate from "../ui/typography/relative-date";

import ChannelAvatar from "~/components/channels/channel-avatar";
import ChannelItemMarkAsReadForm from "~/components/channels/channel-item-mark-as-read-form";
import ChannelItemReadLaterForm from "~/components/channels/channel-item-read-later-form";
import Card from "~/components/ui/cards/card";

type Props = {
  item: ChannelItem & {
    channel: Pick<Channel, "title"> & {
      image: Pick<Image, "title" | "url"> | null;
    };
    userChannelItems: Pick<UserChannelItem, "hasRead" | "isReadLater">[];
  };
  showChannelInformation?: boolean;
};

export default function ChannelItemCard({
  item,
  showChannelInformation,
}: Props) {
  const submit = useSubmit();

  const handleClick = () => {
    submit(
      { channelItemId: item.id },
      {
        method: "post",
      }
    );
  };

  const hasRead = useMemo(() => {
    if (!Array.isArray(item.userChannelItems)) {
      return false;
    }

    return item.userChannelItems[0]?.hasRead;
  }, [item.userChannelItems]);

  const isReadLater = useMemo(() => {
    if (!Array.isArray(item.userChannelItems)) {
      return false;
    }

    return item.userChannelItems[0]?.isReadLater;
  }, [item.userChannelItems]);

  const itemDescription = useMemo(() => {
    return DOMPurify.sanitize(item.description, {
      ALLOWED_TAGS: [], // strip all HTML from an item's description
    });
  }, [item.description]);

  return (
    <Card isInactive={hasRead}>
      {showChannelInformation ? (
        <Card.CardHeader>
          <ChannelAvatar channel={item.channel}>
            {item.pubDate ? <RelativeDate date={item.pubDate} /> : null}
          </ChannelAvatar>
        </Card.CardHeader>
      ) : null}

      <a
        className={classNames({
          "bg-gray-100": hasRead,
          "bg-white hover:bg-gray-50": !hasRead,
        })}
        href={item.link}
        onClick={handleClick}
        rel="noreferrer"
        target="_blank"
      >
        <Card.CardBody>
          <div className="flex flex-row justify-between space-x-2 sm:justify-start">
            <p
              className={classNames("truncate text-sm font-medium", {
                "text-gray-600": hasRead,
                "text-gray-900": !hasRead,
              })}
            >
              {item.title}
            </p>

            {item.pubDate && !showChannelInformation ? (
              <>
                <p className="hidden text-sm text-gray-500 sm:block">·</p>

                <RelativeDate date={item.pubDate} />
              </>
            ) : null}
          </div>

          <div
            className={classNames("mt-1 text-sm line-clamp-2", {
              "text-gray-500": hasRead,
              "text-gray-600": !hasRead,
            })}
          >
            {itemDescription}
          </div>
        </Card.CardBody>
      </a>

      <Card.CardFooter>
        <div className="-mr-4 flex justify-end">
          {hasRead ? null : (
            <ChannelItemReadLaterForm isReadLater={isReadLater} item={item} />
          )}

          <ChannelItemMarkAsReadForm hasRead={hasRead} item={item} />
        </div>
      </Card.CardFooter>
    </Card>
  );
}
