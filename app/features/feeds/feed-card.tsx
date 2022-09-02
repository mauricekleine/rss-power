import { Form, useTransition } from "@remix-run/react";

import { Avatar } from "~/features/ui/avatar";
import { TextButton } from "~/features/ui/button";
import { Card } from "~/features/ui/card";
import { Bell, User, Users, UsersFour, UsersThree } from "~/features/ui/icon";

import type { FeedSuggestions } from "~/models/feed.server";

type Props = {
  feed: FeedSuggestions[0];
};

export default function FeedCard({ feed }: Props) {
  const transition = useTransition();

  return (
    <Card>
      <Card.Header>
        <Avatar image={feed.image ?? undefined} title={feed.title} />
      </Card.Header>

      <Card.Body>
        <div className="flex justify-between space-x-3">
          <div className="mt-1 text-sm text-gray-600 line-clamp-4">
            {feed.description}
          </div>
        </div>
      </Card.Body>

      <Card.Footer>
        <div className="flex justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            {feed._count.userFeeds === 1 ? <User weight="bold" /> : null}

            {feed._count.userFeeds === 2 ? <Users weight="bold" /> : null}

            {feed._count.userFeeds === 3 ? <UsersThree weight="bold" /> : null}

            {feed._count.userFeeds >= 4 ? <UsersFour weight="bold" /> : null}

            {feed._count.userFeeds > 0 ? (
              <span className="text-sm">{feed._count.userFeeds}</span>
            ) : null}
          </div>

          <Form method="post">
            <input name="origin" type="hidden" value={feed.origin} />

            <TextButton
              isLoading={
                transition.state === "submitting" &&
                transition.submission.formData.get("origin") === feed.origin
              }
              type="submit"
            >
              <Bell weight="bold" />

              <span>Subscribe</span>
            </TextButton>
          </Form>
        </div>
      </Card.Footer>
    </Card>
  );
}
