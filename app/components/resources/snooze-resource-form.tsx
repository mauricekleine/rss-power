import { CheckCircle, ClockAfternoon } from "phosphor-react";

import ResourceActionForm from "~/components/resources/resource-action-form";

import { ResourceActions } from "~/routes/__authenticated/resources/$resourceId";

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
    >
      {isSnoozed ? (
        <CheckCircle weight="bold" />
      ) : (
        <ClockAfternoon weight="bold" />
      )}

      <span>{isSnoozed ? "Added to read later" : "Read later"}</span>
    </ResourceActionForm>
  );
}
