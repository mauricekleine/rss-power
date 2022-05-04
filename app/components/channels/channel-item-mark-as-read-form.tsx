import type { ChannelItem } from "@prisma/client";
import { Form, useTransition } from "@remix-run/react";
import { BookOpen, Check } from "phosphor-react";

import TextButton from "../ui/text-button";

import { ChannelItemActions } from "~/routes/feeds/item/$channelItemId";

type Props = {
  hasRead: boolean;
  item: ChannelItem;
};

export default function ChannelItemMarkAsReadForm({ hasRead, item }: Props) {
  const transition = useTransition();

  return (
    <Form action={`/feeds/item/${item.id}`} method="post">
      <input
        name="redirectTo"
        type="hidden"
        value={
          typeof document !== "undefined" ? new URL(document.URL).pathname : ""
        }
      />

      <TextButton
        disabled={hasRead}
        isLoading={
          transition.state === "submitting" &&
          transition.submission.formData.get("action") ===
            ChannelItemActions.MARK_AS_READ &&
          transition.submission.formData.get("channelItemId") === item.id
        }
        name="action"
        value={ChannelItemActions.MARK_AS_READ}
        type="submit"
      >
        {hasRead ? <Check weight="bold" /> : <BookOpen weight="bold" />}

        <span>{hasRead ? "Read" : "Mark as read"}</span>
      </TextButton>
    </Form>
  );
}
