import type { UserResource } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { IconButton } from "~/features/ui/button";
import { CheckSquareOffset } from "~/features/ui/icon";
import { Tooltip } from "~/features/ui/tooltip";

type Props = {
  hasRead: boolean;
  resourceId: string;
};

export default function MarkResourceAsReadForm({
  hasRead: hasReadProp,
  resourceId,
}: Props) {
  const fetcher = useFetcher<{ userResource: UserResource }>();

  const hasRead =
    hasReadProp || fetcher.submission?.formData.get("hasRead") === "on";

  return (
    <fetcher.Form
      action={`/resources/${resourceId}/mark-as-read`}
      method="post"
    >
      <input className="hidden" name="hasRead" type="checkbox" value="on" />

      <Tooltip content={hasRead ? "Read" : "Mark as read"} delayDuration={100}>
        <span tabIndex={0}>
          <IconButton
            isDisabled={hasRead}
            isLoading={fetcher.state === "submitting"}
            type="submit"
          >
            <CheckSquareOffset
              className="text-gray-900"
              size={18}
              weight={hasRead ? "duotone" : "regular"}
            />
          </IconButton>
        </span>
      </Tooltip>
    </fetcher.Form>
  );
}
