import { BookOpen, Check } from "phosphor-react";

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
    >
      {hasRead ? <Check weight="bold" /> : <BookOpen weight="bold" />}

      <span>{hasRead ? "Read" : "Mark as read"}</span>
    </UserResourceActionForm>
  );
}
