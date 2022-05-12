import { useSubmit } from "@remix-run/react";
import classNames from "classnames";

import BookmarkResourceForm from "~/components/resources/bookmark-resource-form";
import MarkResourceAsReadForm from "~/components/resources/mark-resource-as-read-form";
import SnoozeResourceForm from "~/components/resources/snooze-resource-form";
import Avatar from "~/components/ui/avatars/avatar";
import Card from "~/components/ui/cards/card";
import RelativeDate from "~/components/ui/typography/relative-date";
import SanitizedText from "~/components/ui/typography/sanitized-text";

import type { ResourcesForFeedIdAndUserId } from "~/models/resource.server";
import type { UserResource } from "~/models/user-resource.server";
import { ResourceActions } from "~/routes/__authenticated/resources/$resourceId";

type Props = {
  resource: ResourcesForFeedIdAndUserId[0];
  showFeedInformation?: boolean;
  userResource?: UserResource;
};

export default function ResourceCard({
  showFeedInformation,
  resource,
  userResource,
}: Props) {
  const submit = useSubmit();

  const handleClick = () => {
    submit(
      {
        action: ResourceActions.MARK_AS_READ,
        redirectTo:
          typeof document !== "undefined" ? new URL(document.URL).pathname : "",
      },
      {
        action: `/resources/${resource.id}`,
        method: "post",
      }
    );
  };

  return (
    <Card isInactive={userResource?.hasRead}>
      {showFeedInformation ? (
        <Card.Header>
          <Avatar
            image={resource.feedResource?.feed.image}
            title={resource.feedResource!.feed.title}
          >
            {resource.publishedAt ? (
              <RelativeDate date={resource.publishedAt} />
            ) : null}
          </Avatar>
        </Card.Header>
      ) : null}

      <Card.LinkableBody href={resource.link} onClick={handleClick}>
        <div className="flex flex-row justify-between space-x-2 sm:justify-start">
          <p
            className={classNames("text-sm font-medium", {
              "text-gray-600": userResource?.hasRead,
              "text-gray-900": !userResource?.hasRead,
            })}
          >
            {resource.title}
          </p>

          {resource.publishedAt && !showFeedInformation ? (
            <>
              <p className="hidden text-sm text-gray-500 sm:block">·</p>

              <RelativeDate date={resource.publishedAt} />
            </>
          ) : null}
        </div>

        <div
          className={classNames("mt-1 text-sm line-clamp-5", {
            "text-gray-500": userResource?.hasRead,
            "text-gray-600": !userResource?.hasRead,
          })}
        >
          <SanitizedText text={resource.description} />
        </div>
      </Card.LinkableBody>

      <Card.Footer>
        <div className="-mr-4 flex justify-end">
          {userResource?.hasRead ? null : (
            <SnoozeResourceForm
              isSnoozed={userResource?.isSnoozed ?? false}
              resourceId={resource.id}
            />
          )}

          <BookmarkResourceForm
            isBookmarked={userResource?.isBookmarked ?? false}
            resourceId={resource.id}
          />

          <MarkResourceAsReadForm
            hasRead={userResource?.hasRead ?? false}
            resourceId={resource.id}
          />
        </div>
      </Card.Footer>
    </Card>
  );
}
