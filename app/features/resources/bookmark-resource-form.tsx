import type { UserResource } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { IconButton } from "~/features/ui/button";
import { BookmarkSimple } from "~/features/ui/icon";
import { Tooltip } from "~/features/ui/tooltip";

type Props = {
  isBookmarked: boolean;
  resourceId: string;
};

export default function BookmarkResourceForm({
  isBookmarked: isBookmarkedProp,
  resourceId,
}: Props) {
  const fetcher = useFetcher<{ userResource: UserResource }>();

  const isBookmarked =
    isBookmarkedProp ||
    fetcher.submission?.formData.get("isBookmarked") === "on";

  return (
    <fetcher.Form action={`/resources/${resourceId}/bookmark`} method="post">
      <input
        className="hidden"
        name="isBookmarked"
        type="checkbox"
        value="on"
      />

      <Tooltip
        content={isBookmarked ? "Bookmarked" : "Bookmark"}
        delayDuration={100}
      >
        <span tabIndex={0}>
          <IconButton
            isDisabled={isBookmarked}
            isLoading={fetcher.state === "submitting"}
            type="submit"
          >
            <BookmarkSimple
              className="text-gray-900"
              size={18}
              weight={isBookmarked ? "duotone" : "regular"}
            />
          </IconButton>
        </span>
      </Tooltip>
    </fetcher.Form>
  );
}
