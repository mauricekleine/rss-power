import type { ChannelItem } from "@prisma/client";
import { Form, useTransition } from "@remix-run/react";
import { BookmarkSimple, CheckCircle } from "phosphor-react";

import TextButton from "../ui/text-button";

import { ChannelItemActions } from "~/routes/feeds/item/$channelItemId";

type Props = {
  isReadLater: boolean;
  item: ChannelItem;
};

export default function ChannelItemReadLaterForm({ isReadLater, item }: Props) {
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
        disabled={isReadLater}
        isLoading={
          transition.state === "submitting" &&
          transition.submission.formData.get("action") ===
            ChannelItemActions.READ_LATER &&
          transition.submission.formData.get("channelItemId") === item.id
        }
        name="action"
        value={ChannelItemActions.READ_LATER}
        type="submit"
      >
        {isReadLater ? (
          <CheckCircle weight="bold" />
        ) : (
          <BookmarkSimple weight="bold" />
        )}

        <span>{isReadLater ? "Added to read later" : "Read later"}</span>
      </TextButton>
    </Form>
  );
}
