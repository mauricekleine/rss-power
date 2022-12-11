import type { SerializeFrom } from "@remix-run/node";
import classNames from "classnames";

import {
  BookmarkResourceForm,
  MarkResourceAsReadForm,
  SnoozeResourceForm,
} from "~/features/resources";
import { Card } from "~/features/ui/card";
import { Stack } from "~/features/ui/layout";
import { RelativeDate, SanitizedText } from "~/features/ui/typography";

import type { PaginatedResourcesForUserId } from "~/models/resource.server";
import type { UserResource } from "~/models/user-resource.server";

import ResourceCardHeader from "./resource-card-header";

type Props = {
  resource: PaginatedResourcesForUserId[0];
  showPublisherInformation?: boolean;
  userResource?: SerializeFrom<UserResource>;
};

export default function ResourceCard({
  showPublisherInformation,
  resource,
  userResource,
}: Props) {
  return (
    <Card isInactive={userResource?.hasRead}>
      {showPublisherInformation ? (
        <Card.Header>
          <ResourceCardHeader
            imageUrl={resource.publisher?.image?.url ?? resource.image?.url}
            linkToFeed={
              resource.feedResource?.feedId
                ? `/feeds/${resource.feedResource.feedId}`
                : undefined
            }
            title={`${resource.type}: ${
              resource.publisher?.title ?? resource.title
            }`}
          />
        </Card.Header>
      ) : null}

      <Card.LinkableBody href={resource.link}>
        <div className="flex flex-col gap-y-4 sm:flex-row sm:justify-between sm:gap-x-4">
          <Stack direction="vertical" gap="gap-1">
            <Stack gap="gap-2">
              {resource.publishedAt ? (
                <RelativeDate date={resource.publishedAt} />
              ) : null}

              <p
                className={classNames("text-sm font-medium line-clamp-1", {
                  "text-gray-600": userResource?.hasRead,
                  "text-gray-900": !userResource?.hasRead,
                })}
              >
                {resource.title}
              </p>
            </Stack>

            <div
              className={classNames("text-sm line-clamp-3", {
                "text-gray-500": userResource?.hasRead,
                "text-gray-600": !userResource?.hasRead,
              })}
            >
              <SanitizedText text={resource.description} />
            </div>
          </Stack>

          <div className="flex flex-row items-center justify-end gap-x-4 sm:justify-start">
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
        </div>
      </Card.LinkableBody>
    </Card>
  );
}
