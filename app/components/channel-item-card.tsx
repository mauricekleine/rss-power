import type {
  Channel,
  ChannelItem,
  Image,
  UserChannelItem,
} from "@prisma/client";
import { Form, useSubmit, useTransition } from "@remix-run/react";
import classNames from "classNames";
import { formatDistance } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { BookOpen, BookmarkSimple, Check, CheckCircle } from "phosphor-react";
import { useMemo } from "react";

import ChannelAvatar from "./channel-avatar";
import TextButton from "./ui/text-button";

import { ChannelItemActions } from "~/routes/feeds/$channelId";

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
  const transition = useTransition();

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
    <div
      className={classNames(
        "divide-y divide-gray-200 overflow-hidden rounded-lg shadow",
        {
          "bg-gray-100": hasRead,
          "bg-white ": !hasRead,
        }
      )}
    >
      {showChannelInformation ? (
        <ChannelAvatar channel={item.channel}>
          <time
            className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
            dateTime={
              item.pubDate ? new Date(item.pubDate).toISOString() : undefined
            }
          >
            {item.pubDate
              ? `${formatDistance(new Date(item.pubDate), new Date())} ago`
              : null}
          </time>
        </ChannelAvatar>
      ) : null}

      <a
        className={classNames("block px-4 py-5 sm:p-6", {
          "bg-gray-100": hasRead,
          "bg-white hover:bg-gray-50": !hasRead,
        })}
        href={item.link}
        onClick={handleClick}
        rel="noreferrer"
        target="_blank"
      >
        <div className="flex justify-between space-x-3">
          <div className="min-w-0 flex-1">
            <p
              className={classNames("truncate text-sm font-medium", {
                "text-gray-600": hasRead,
                "text-gray-900": !hasRead,
              })}
            >
              {item.title}
            </p>
          </div>

          {showChannelInformation ? null : (
            <time
              className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
              dateTime={
                item.pubDate ? new Date(item.pubDate).toISOString() : undefined
              }
            >
              {item.pubDate
                ? `${formatDistance(new Date(item.pubDate), new Date())} ago`
                : null}
            </time>
          )}
        </div>

        <div
          className={classNames("mt-1 text-sm line-clamp-2", {
            "text-gray-500": hasRead,
            "text-gray-600": !hasRead,
          })}
        >
          {itemDescription}
        </div>
      </a>

      <div
        className={classNames("flex justify-end py-2 sm:px-2", {
          "bg-gray-100": hasRead,
          "bg-gray-50": !hasRead,
        })}
      >
        {hasRead ? null : (
          <Form method="post">
            <input name="channelItemId" type="hidden" value={item.id} />

            <TextButton
              disabled={isReadLater}
              isLoading={
                transition.state === "submitting" &&
                transition.submission.formData.get("action") ===
                  ChannelItemActions.READ_LATER &&
                transition.submission.formData.get("channelItemId") === item.id
              }
              name="action"
              value={ChannelItemActions.READ_LATER}
              type="submit"
            >
              {isReadLater ? (
                <CheckCircle weight="bold" />
              ) : (
                <BookmarkSimple weight="bold" />
              )}

              <span>{isReadLater ? "Added to read later" : "Read later"}</span>
            </TextButton>
          </Form>
        )}

        <Form method="post">
          <input name="channelItemId" type="hidden" value={item.id} />

          <TextButton
            disabled={hasRead}
            isLoading={
              transition.state === "submitting" &&
              transition.submission.formData.get("action") ===
                ChannelItemActions.MARK_AS_READ &&
              transition.submission.formData.get("channelItemId") === item.id
            }
            name="action"
            value={ChannelItemActions.MARK_AS_READ}
            type="submit"
          >
            {hasRead ? <Check weight="bold" /> : <BookOpen weight="bold" />}

            <span>{hasRead ? "Read" : "Mark as read"}</span>
          </TextButton>
        </Form>
      </div>
    </div>
  );
}
