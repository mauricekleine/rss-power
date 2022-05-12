import { Form, useTransition } from "@remix-run/react";
import type { ReactNode } from "react";

import TextButton from "../ui/text-button";

import type { ResourceActions } from "~/routes/__authenticated/resources/$resourceId";

type Props = {
  action: keyof typeof ResourceActions;
  children: ReactNode;
  disabled?: boolean;
  resourceId: string;
};

export default function ResourceActionForm({
  action,
  children,
  disabled,
  resourceId,
}: Props) {
  const transition = useTransition();

  return (
    <Form action={`/resources/${resourceId}`} method="post">
      <input
        name="redirectTo"
        type="hidden"
        value={
          typeof document !== "undefined" ? new URL(document.URL).pathname : ""
        }
      />

      <TextButton
        disabled={disabled}
        isLoading={
          transition.state === "submitting" &&
          transition.submission.formData.get("action") === action &&
          transition.location.pathname.includes(resourceId)
        }
        name="action"
        value={action}
        type="submit"
      >
        {children}
      </TextButton>
    </Form>
  );
}
