import type { UserResource } from "@prisma/client";
import { useFetcher } from "@remix-run/react";

import { IconButton } from "~/features/ui/button";
import { ClockAfternoon } from "~/features/ui/icon";
import { Tooltip } from "~/features/ui/tooltip";

type Props = {
  isSnoozed: boolean;
  resourceId: string;
};

export default function SnoozeResourceForm({
  isSnoozed: isSnoozedProp,
  resourceId,
}: Props) {
  const fetcher = useFetcher<{ userResource: UserResource }>();

  const isSnoozed =
    isSnoozedProp || fetcher.submission?.formData.get("isSnoozed") === "on";

  return (
    <fetcher.Form action={`/resources/${resourceId}/snooze`} method="post">
      <input className="hidden" name="isSnoozed" type="checkbox" value="on" />

      <Tooltip content={isSnoozed ? "Snoozed" : "Snooze"} delayDuration={100}>
        <span tabIndex={0}>
          <IconButton
            isDisabled={isSnoozed}
            isLoading={fetcher.state === "submitting"}
            type="submit"
          >
            <ClockAfternoon
              className="text-gray-900"
              size={18}
              weight={isSnoozed ? "duotone" : "regular"}
            />
          </IconButton>
        </span>
      </Tooltip>
    </fetcher.Form>
  );
}
