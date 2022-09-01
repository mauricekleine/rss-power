import { ClockAfternoon } from "~/features/ui/icon";

import ResourceActionForm from "./resource-action-form";
import { ResourceActions } from "./types";

type Props = {
  isSnoozed: boolean;
  resourceId: string;
};

export default function SnoozeResourceForm({ isSnoozed, resourceId }: Props) {
  return (
    <ResourceActionForm
      action={ResourceActions.SNOOZE}
      disabled={isSnoozed}
      resourceId={resourceId}
      tooltipContent={isSnoozed ? "Snoozed" : "Snooze"}
    >
      <ClockAfternoon
        className="text-gray-900"
        size={18}
        weight={isSnoozed ? "duotone" : "regular"}
      />
    </ResourceActionForm>
  );
}
