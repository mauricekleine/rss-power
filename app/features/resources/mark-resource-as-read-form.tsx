import ResourceActionForm from "~/features/resources/resource-action-form";
import { CheckSquareOffset } from "~/features/ui/icon";

import { ResourceActions } from "./types";

type Props = {
  hasRead: boolean;
  resourceId: string;
};

export default function MarkResourceAsReadForm({ hasRead, resourceId }: Props) {
  return (
    <ResourceActionForm
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
    </ResourceActionForm>
  );
}
