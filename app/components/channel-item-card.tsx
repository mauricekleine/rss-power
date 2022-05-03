import { Form, useSubmit } from "@remix-run/react";
import classnames from "classnames";
import { formatDistance } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import { BookOpen, BookmarkSimple, Check, CheckCircle } from "phosphor-react";
import { useMemo } from "react";

import type { getChannelItemsForChannelIdAndUserId } from "~/models/channel-item.server";
import { ChannelItemActions } from "~/routes/feeds/$channelId";

type Props = {
  item: Awaited<ReturnType<typeof getChannelItemsForChannelIdAndUserId>>[0];
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
        action: `/feeds/${item.channelId}/${item.id}`,
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
      className={classnames(
        "divide-y divide-gray-200 overflow-hidden rounded-lg shadow",
        {
          "bg-gray-100": hasRead,
          "bg-white ": !hasRead,
        }
      )}
    >
      {showChannelInformation ? (
        <div className="flex items-center space-x-2 px-4 py-5 leading-none sm:px-6">
          {item.channel.image ? (
            <div className="flex-shrink-0">
              <img
                alt={item.channel.image.title ?? item.channel.title}
                className="h-8 w-8 rounded-full object-cover"
                src={item.channel?.image?.url}
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {item.channel.title}
            </p>

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
          </div>
        </div>
      ) : null}

      <a
        className={classnames("block px-4 py-5 sm:p-6", {
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
              className={classnames("truncate text-sm font-medium", {
                "text-gray-600": hasRead,
                "text-gray-900": !hasRead,
              })}
            >
              {item.title}
            </p>
          </div>
        </div>

        <div
          className={classnames("line-clamp-2 mt-1 text-sm", {
            "text-gray-500": hasRead,
            "text-gray-600": !hasRead,
          })}
        >
          {itemDescription}
        </div>
      </a>

      <div
        className={classnames("flex justify-end py-2 sm:px-2", {
          "bg-gray-100": hasRead,
          "bg-gray-50": !hasRead,
        })}
      >
        {hasRead ? null : (
          <Form method="post">
            <input name="channelItemId" type="hidden" value={item.id} />

            <button
              className={classnames(
                "flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600",
                {
                  "underline hover:text-gray-800": !isReadLater,
                }
              )}
              disabled={isReadLater}
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
            </button>
          </Form>
        )}

        <Form method="post">
          <input name="channelItemId" type="hidden" value={item.id} />

          <button
            className={classnames(
              "flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600",
              {
                "underline hover:text-gray-800": !hasRead,
              }
            )}
            disabled={hasRead}
            name="action"
            value={ChannelItemActions.MARK_AS_READ}
            type="submit"
          >
            {hasRead ? <Check weight="bold" /> : <BookOpen weight="bold" />}

            <span>{hasRead ? "Read" : "Mark as read"}</span>
          </button>
        </Form>
      </div>
    </div>
  );
}
