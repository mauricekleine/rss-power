import { BookmarkSimple } from "~/features/ui/icon";

import ResourceActionForm from "./resource-action-form";
import { ResourceActions } from "./types";

type Props = {
  isBookmarked: boolean;
  resourceId: string;
};

export default function BookmarkResourceForm({
  isBookmarked,
  resourceId,
}: Props) {
  return (
    <ResourceActionForm
      action={ResourceActions.BOOKMARK}
      disabled={isBookmarked}
      resourceId={resourceId}
      tooltipContent={isBookmarked ? "Bookmarked" : "Bookmark"}
    >
      <BookmarkSimple
        className="text-gray-900"
        size={18}
        weight={isBookmarked ? "duotone" : "regular"}
      />
    </ResourceActionForm>
  );
}
