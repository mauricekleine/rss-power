import { Form, useSubmit } from "@remix-run/react";
import classnames from "classnames";
import { formatDistance } from "date-fns";
import { Book, BookOpen } from "phosphor-react";

import type { getChannelItemsForChannelIdAndUserId } from "~/models/channel-item.server";

type Props = {
  item: Awaited<ReturnType<typeof getChannelItemsForChannelIdAndUserId>>[0];
};

export default function ChannelItemCard({ item }: Props) {
  const submit = useSubmit();

  const handleClick = () => {
    submit(null, {
      method: "post",
      action: `/feeds/${item.channelId}/${item.id}`,
    });
  };

  const hasRead = item.userChannelItems[0]?.hasRead;

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
      <a
        className={classnames("block px-4 py-5 sm:p-6", {
          "bg-gray-100": hasRead,
          "bg-white hover:bg-gray-50": !hasRead,
        })}
        href={item.link}
        key={item.id}
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

        <div className="mt-1">
          <p
            className={classnames("line-clamp-2 text-sm", {
              "text-gray-500": hasRead,
              "text-gray-600": !hasRead,
            })}
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      </a>

      <div
        className={classnames("flex justify-end py-2 sm:px-2", {
          "bg-gray-100": hasRead,
          "bg-gray-50": !hasRead,
        })}
      >
        <Form action={`/feeds/${item.channelId}/${item.id}`} method="post">
          <button
            className={classnames(
              "flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600",
              {
                "underline hover:text-gray-800": !hasRead,
              }
            )}
            disabled={hasRead}
            type="submit"
          >
            {hasRead ? <Book weight="bold" /> : <BookOpen weight="bold" />}

            <span>{hasRead ? "Read" : "Mark as read"}</span>
          </button>
        </Form>
      </div>
    </div>
  );
}
