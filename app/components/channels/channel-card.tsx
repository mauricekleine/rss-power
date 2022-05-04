import { Form, useTransition } from "@remix-run/react";
import { Bell, User, Users, UsersFour, UsersThree } from "phosphor-react";

import ChannelAvatar from "~/components/channels/channel-avatar";
import Card from "~/components/ui/cards/card";
import TextButton from "~/components/ui/text-button";

import type { getUnsubscribedChannelsForUserId } from "~/models/channel.server";

type Props = {
  channel: Awaited<ReturnType<typeof getUnsubscribedChannelsForUserId>>[0];
};

export default function ChannelCard({ channel }: Props) {
  const transition = useTransition();

  return (
    <Card>
      <Card.CardHeader>
        <ChannelAvatar channel={channel} />
      </Card.CardHeader>

      <Card.CardBody>
        <div className="flex justify-between space-x-3">
          <div className="mt-1 text-sm text-gray-600 line-clamp-4">
            {channel.description}
          </div>
        </div>
      </Card.CardBody>

      <Card.CardFooter>
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            {channel.users.length === 1 ? <User weight="bold" /> : null}

            {channel.users.length === 2 ? <Users weight="bold" /> : null}

            {channel.users.length === 3 ? <UsersThree weight="bold" /> : null}

            {channel.users.length >= 4 ? <UsersFour weight="bold" /> : null}

            {channel.users.length > 0 ? (
              <span className="text-sm">{channel.users.length}</span>
            ) : null}
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
      </Card.CardFooter>
    </Card>
  );
}
