import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";

import { updateUserResourceForResourceIdAndUserId } from "~/models/user-resource.server";

import { requireUserId } from "~/session.server";

export async function action({ request, params }: ActionArgs) {
  const userId = await requireUserId(request);
  invariant(params.resourceId, "resourceId not found");

  const userResource = await updateUserResourceForResourceIdAndUserId({
    isBookmarked: true,
    resourceId: params.resourceId,
    userId,
  });

  return json({ userResource });
}
