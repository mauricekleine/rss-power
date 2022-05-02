import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import { formatDistance } from "date-fns";
import { BellSimpleSlash } from "phosphor-react";
import invariant from "tiny-invariant";

import {
  getChannel,
  getChannelItems,
  removeUserFromChannel,
} from "~/models/channel.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  channel: NonNullable<Awaited<ReturnType<typeof getChannel>>>;
  items: Awaited<ReturnType<typeof getChannelItems>>;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.channelId, "channelId not found");

  try {
    const [channel, items] = await Promise.all([
      getChannel({ id: params.channelId }),
      getChannelItems({ channelId: params.channelId }),
    ]);

    if (!channel) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({ channel, items });
  } catch (e) {
    throw new Response("Not Found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.channelId, "channelId not found");

  await removeUserFromChannel({ id: params.channelId, userId });

  return redirect("/feeds");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {data.channel.image ? (
              <img
                alt={data.channel.image.title ?? data.channel.title}
                className="h-12 w-12 rounded-lg"
                src={data.channel?.image?.url}
              />
            ) : null}

            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {data.channel.title}
              </h3>

              <a
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
                href={data.channel.link}
                rel="noreferrer"
                target="_blank"
              >
                {data.channel.link}
              </a>
            </div>
          </div>

          <Form method="post">
            <button
              type="submit"
              className="flex items-center space-x-2 rounded py-2 px-4 text-sm text-gray-600 underline hover:text-gray-800"
            >
              <BellSimpleSlash weight="bold" />

              <span>Unsubscribe</span>
            </button>
          </Form>
        </div>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">
          {data.channel.description}
        </p>
      </div>

      <div className="space-y-4">
        {data.items.map((item) => (
          <a
            className="block"
            href={item.link}
            key={item.id}
            rel="noreferrer"
            target="_blank"
          >
            <div className="overflow-hidden rounded-lg bg-white shadow hover:bg-gray-50">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between space-x-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                  </div>

                  <time
                    className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                    dateTime={
                      item.pubDate
                        ? new Date(item.pubDate).toISOString()
                        : undefined
                    }
                  >
                    {item.pubDate
                      ? `${formatDistance(
                          new Date(item.pubDate),
                          new Date()
                        )} ago`
                      : null}
                  </time>
                </div>

                <div className="mt-1">
                  <p
                    className="line-clamp-2 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Channel not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
