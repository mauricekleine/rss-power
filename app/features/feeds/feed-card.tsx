import { Form, useTransition } from "@remix-run/react";

import { Avatar } from "~/features/ui/avatar";
import { TextButton } from "~/features/ui/button";
import { Card } from "~/features/ui/card";
import { Bell, User, Users, UsersFour, UsersThree } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";

import type { FeedSuggestions } from "~/models/feed.server";

type Props = {
  feed: FeedSuggestions[0];
};

export default function FeedCard({ feed }: Props) {
  const transition = useTransition();

  return (
    <Card>
      <Card.Header>
        <Stack gap="gap-2">
          <Avatar
            src={feed.image?.url}
            title={feed.image?.title ?? feed.title}
          />

          <span className="truncate text-sm font-medium text-gray-900">
            {feed.title}
          </span>
        </Stack>
      </Card.Header>

      <Card.Body>
        <div className="text-sm text-gray-600 line-clamp-4">
          {feed.description && feed.description !== "" ? (
            feed.description
          ) : (
            <span className="italic text-gray-400">
              No description provided
            </span>
          )}
        </div>
      </Card.Body>

      <Card.Footer>
        <Stack gap="gap-2" justifyContent="between">
          <Stack gap="gap-2">
            <span className="text-gray-700">
              {feed._count.userFeeds === 1 ? <User weight="bold" /> : null}

              {feed._count.userFeeds === 2 ? <Users weight="bold" /> : null}

              {feed._count.userFeeds === 3 ? (
                <UsersThree weight="bold" />
              ) : null}

              {feed._count.userFeeds >= 4 ? <UsersFour weight="bold" /> : null}
            </span>

            {feed._count.userFeeds > 0 ? (
              <span className="text-sm text-gray-700">
                {feed._count.userFeeds}
              </span>
            ) : null}
          </Stack>

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
        </Stack>
      </Card.Footer>
    </Card>
  );
}
