import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import RssParser from "rss-parser";

import {
  addUserToChannel,
  createChannel,
  getChannelForOrigin,
} from "~/models/channel.server";
import { requireUserId } from "~/session.server";

const parser = new RssParser();

type ActionData = {
  errors?: {
    origin?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const origin = formData.get("origin");

  if (typeof origin !== "string" || origin.length === 0) {
    return json<ActionData>(
      { errors: { origin: "Origin is required" } },
      { status: 400 }
    );
  }

  const existingChannel = await getChannelForOrigin({ origin });

  if (existingChannel) {
    try {
      await addUserToChannel({ id: existingChannel.id, userId });
      return redirect(`/feeds/${existingChannel.id}`);
    } catch (e) {
      console.log(e);

      return json<ActionData>(
        { errors: { origin: "Origin is invalid" } },
        { status: 400 }
      );
    }
  }

  try {
    const parsed = await parser.parseURL(origin);

    if (!parsed || !parsed.link || !parsed.title) {
      return json<ActionData>(
        { errors: { origin: "Origin is invalid" } },
        { status: 400 }
      );
    }

    const channel = await createChannel({
      description: parsed.description ?? "",
      image: parsed.image?.url
        ? {
            link: parsed.image?.link || parsed.link,
            title: parsed.image?.title || parsed.title,
            url: parsed.image.url,
          }
        : undefined,
      items: parsed.items.map((item) => ({
        description: item.summary ?? item.content ?? "",
        link: item.link ?? "",
        pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
        title: item.title ?? "",
      })),
      link: parsed.link,
      origin,
      title: parsed.title,
      userId,
    });

    return redirect(`/feeds/${channel.id}`);
  } catch (e) {
    console.log(e);

    return json<ActionData>(
      { errors: { origin: "Origin is invalid" } },
      { status: 400 }
    );
  }
};

export default function NewNotePage() {
  const actionData = useActionData() as ActionData;

  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.origin) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>URL: </span>

          <input
            ref={titleRef}
            name="origin"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.origin ? true : undefined}
            aria-errormessage={
              actionData?.errors?.origin ? "url-error" : undefined
            }
          />
        </label>

        {actionData?.errors?.origin && (
          <div className="pt-1 text-red-700" id="origin-error">
            {actionData.errors.origin}
          </div>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
