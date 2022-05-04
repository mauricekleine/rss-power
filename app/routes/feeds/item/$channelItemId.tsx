import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import {
  markChannelItemAsRead,
  saveChannelItemToReadLater,
} from "~/models/channel-item.server";
import { requireUserId } from "~/session.server";

export const ChannelItemActions = {
  MARK_AS_READ: "mark-as-read",
  READ_LATER: "read-later",
} as const;

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.channelItemId, "channelItemId not found");

  const formData = await request.formData();
  const action = formData.get("action");

  const redirectTo = formData.get("redirectTo");
  invariant(redirectTo, "redirectTo not found");

  if (action === ChannelItemActions.MARK_AS_READ) {
    await markChannelItemAsRead({
      channelItemId: params.channelItemId,
      userId,
    });
  }

  if (action === ChannelItemActions.READ_LATER) {
    await saveChannelItemToReadLater({
      channelItemId: params.channelItemId,
      userId,
    });
  }

  return redirect(redirectTo.toString());
};
