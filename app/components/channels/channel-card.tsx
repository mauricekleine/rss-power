import { Form, useTransition } from "@remix-run/react";
import { Bell, User, Users, UsersFour, UsersThree } from "phosphor-react";

import ChannelAvatar from "~/components/channels/channel-avatar";
import TextButton from "~/components/ui/text-button";

import type { getUnsubscribedChannelsForUserId } from "~/models/channel.server";

type Props = {
  channel: Awaited<ReturnType<typeof getUnsubscribedChannelsForUserId>>[0];
};

export default function ChannelCard({ channel }: Props) {
  const transition = useTransition();

  return (
    <div className="flex flex-col divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow">
      <ChannelAvatar channel={channel} />

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

        <Form className="-mr-4" method="post">
          <input name="origin" type="hidden" value={channel.origin} />

          <TextButton
            isLoading={
              transition.state === "submitting" &&
              transition.submission.formData.get("origin") === channel.origin
            }
            type="submit"
          >
            <Bell weight="bold" />

            <span>Subscribe</span>
          </TextButton>
        </Form>
      </div>
    </div>
  );
}
