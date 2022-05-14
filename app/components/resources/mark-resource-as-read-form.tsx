import { CheckSquareOffset } from "phosphor-react";

import UserResourceActionForm from "~/components/resources/resource-action-form";

import { ResourceActions } from "~/routes/__authenticated/resources/$resourceId";

type Props = {
  hasRead: boolean;
  resourceId: string;
};

export default function MarkResourceAsReadForm({ hasRead, resourceId }: Props) {
  return (
    <UserResourceActionForm
      action={ResourceActions.MARK_AS_READ}
      disabled={hasRead}
      resourceId={resourceId}
      tooltipContent={hasRead ? "Read" : "Mark as read"}
    >
      <CheckSquareOffset
        className="text-gray-900"
        size={18}
        weight={hasRead ? "duotone" : "regular"}
      />
    </UserResourceActionForm>
  );
}
