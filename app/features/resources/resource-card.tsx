import type { SerializeFrom } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import classNames from "classnames";

import {
  BookmarkResourceForm,
  MarkResourceAsReadForm,
  SnoozeResourceForm,
} from "~/features/resources";
import { Avatar } from "~/features/ui/avatar";
import { Card } from "~/features/ui/card";
import { RelativeDate, SanitizedText } from "~/features/ui/typography";

import type { ResourcesForFeedIdAndUserId } from "~/models/resource.server";
import type { UserResource } from "~/models/user-resource.server";

import { ResourceActions } from "./types";

type Props = {
  resource: ResourcesForFeedIdAndUserId[0];
  showPublisherInformation?: boolean;
  userResource?: SerializeFrom<UserResource>;
};

export default function ResourceCard({
  showPublisherInformation,
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
      {showPublisherInformation ? (
        <Card.Header>
          <Avatar
            image={resource.publisher?.image ?? resource.image}
            title={resource.publisher?.title ?? resource.title}
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

          {resource.publishedAt && !showPublisherInformation ? (
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
        <div className="-mr-4 flex justify-end space-x-2">
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
