import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { ResourceActions } from "~/features/resources/types";

import { updateUserResourceForResourceIdAndUserId } from "~/models/user-resource.server";

import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.resourceId, "resourceId not found");

  const formData = await request.formData();
  const action = formData.get("action");

  const redirectTo = formData.get("redirectTo");
  invariant(redirectTo, "redirectTo not found");

  if (action === ResourceActions.BOOKMARK) {
    await updateUserResourceForResourceIdAndUserId({
      isBookmarked: true,
      resourceId: params.resourceId,
      userId,
    });
  }

  if (action === ResourceActions.MARK_AS_READ) {
    await updateUserResourceForResourceIdAndUserId({
      hasRead: true,
      isSnoozed: false,
      resourceId: params.resourceId,
      userId,
    });
  }

  if (action === ResourceActions.SNOOZE) {
    await updateUserResourceForResourceIdAndUserId({
      isSnoozed: true,
      resourceId: params.resourceId,
      userId,
    });
  }

  return redirect(redirectTo.toString());
};
