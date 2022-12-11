import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { ResourcesPage } from "~/features/resources";
import { Microphone } from "~/features/ui/icon";
import { parsePaginatedSearchParams } from "~/features/ui/lists";

import {
  ResourceType,
  getPaginatedResourcesForUserId,
} from "~/models/resource.server";

import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);

  const url = new URL(request.url);
  const { limit, offset } = parsePaginatedSearchParams(url.searchParams);

  try {
    const [count, resources] = await getPaginatedResourcesForUserId({
      filter: { type: ResourceType.PODCAST },
      limit,
      offset,
      userId,
    });

    return json({ count, resources });
  } catch (e) {
    console.log(e);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function PodcastsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <ResourcesPage
      count={data.count}
      description="Podcasts"
      icon={Microphone}
      resources={data.resources}
      title="Podcasts"
    />
  );
}
