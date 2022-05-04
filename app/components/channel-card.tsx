import { Form } from "@remix-run/react";
import classNames from "classnames";
import { Bell, User, Users, UsersFour, UsersThree } from "phosphor-react";

import type { getUnsubscribedChannelsForUserId } from "~/models/channel.server";

type Props = {
  channel: Awaited<ReturnType<typeof getUnsubscribedChannelsForUserId>>[0];
};

export default function ChannelCard({ channel }: Props) {
  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
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
          <p className="text-sm font-medium text-gray-900">{channel.title}</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 sm:p-6">
        <div className="flex justify-between space-x-3">
          <div className="mt-1 text-sm text-gray-600 line-clamp-4">
            {channel.description}
          </div>
        </div>
      </div>

      <div className="flex justify-between bg-gray-50 py-2 px-4 sm:px-6">
        <div className="flex items-center space-x-2 text-gray-700">
          {channel.users.length === 1 ? <User weight="bold" /> : null}

          {channel.users.length === 2 ? <Users weight="bold" /> : null}

          {channel.users.length === 3 ? <UsersThree weight="bold" /> : null}

          {channel.users.length >= 4 ? <UsersFour weight="bold" /> : null}

          <span className="text-sm">{channel.users.length}</span>
        </div>

        <Form method="post">
          <input name="origin" type="hidden" value={channel.origin} />

          <button
            className="-mr-4 flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600 underline hover:text-gray-800"
            type="submit"
          >
            <Bell weight="bold" />

            <span>Subscribe</span>
          </button>
        </Form>
      </div>
    </div>
  );
}
