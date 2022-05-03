import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { markChannelItemAsRead } from "~/models/channel-item.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.channelId, "channelId not found");
  invariant(params.channelItemId, "channelItemId not found");

  await markChannelItemAsRead({ channelItemId: params.channelItemId, userId });

  return redirect(`/feeds/${params.channelId}`);
};
