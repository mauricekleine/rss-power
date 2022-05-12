import { BookmarkSimple, CheckCircle } from "phosphor-react";

import ResourceActionForm from "~/components/resources/resource-action-form";

import { ResourceActions } from "~/routes/__authenticated/resources/$resourceId";

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
    >
      {isBookmarked ? (
        <CheckCircle weight="bold" />
      ) : (
        <BookmarkSimple weight="bold" />
      )}

      <span>{isBookmarked ? "Added to bookmarks" : "Bookmark"}</span>
    </ResourceActionForm>
  );
}
