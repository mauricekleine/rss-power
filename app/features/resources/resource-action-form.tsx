import { Form, useTransition } from "@remix-run/react";
import type { ReactNode } from "react";

import { IconButton } from "~/features/ui/button";
import { Tooltip } from "~/features/ui/tooltip";

import type { ResourceActions } from "./types";

type Props = {
  action: keyof typeof ResourceActions;
  children: ReactNode;
  isDisabled?: boolean;
  resourceId: string;
  tooltipContent: string;
};

export default function ResourceActionForm({
  action,
  children,
  isDisabled,
  resourceId,
  tooltipContent,
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

      <Tooltip content={tooltipContent} delayDuration={100}>
        <span tabIndex={0}>
          <IconButton
            isDisabled={isDisabled}
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
          </IconButton>
        </span>
      </Tooltip>
    </Form>
  );
}
