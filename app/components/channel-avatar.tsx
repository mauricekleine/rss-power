import type { Channel, Image } from "@prisma/client";
import classNames from "classnames";
import type { ReactNode } from "react";

type Props = {
  channel: Pick<Channel, "title"> & {
    image: Pick<Image, "title" | "url"> | null;
  };
  children?: ReactNode;
};

export default function ChannelAvatar({ channel, children }: Props) {
  return (
    <div
      className={classNames(
        "flex items-center space-x-2 px-4 leading-none sm:px-6",
        {
          "py-3.5": channel.image,
          "py-5": !channel.image,
        }
      )}
    >
      {channel.image ? (
        <div className="flex-shrink-0">
          <img
            alt={channel.image.title ?? channel.title}
            className="h-8 w-8 rounded-full object-cover"
            src={channel?.image?.url}
          />
        </div>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {channel.title}
        </p>

        {children}
      </div>
    </div>
  );
}
