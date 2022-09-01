import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import type { Metadata, Scraper } from "metascraper";
import * as React from "react";

import { TextButton } from "~/features/ui/button";
import { Card } from "~/features/ui/card";
import { BookmarkSimple, Link } from "~/features/ui/icon";
import { SectionHeader } from "~/features/ui/typography";

import { createPublisher } from "~/models/publisher.server";
import { createResource, getResourceForLink } from "~/models/resource.server";
import { updateUserResourceForResourceIdAndUserId } from "~/models/user-resource.server";

import { requireUserId } from "~/session.server";

export async function action({ request }: ActionArgs) {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const link = formData.get("link");

  if (typeof link !== "string" || link.length === 0) {
    return json({ errors: { link: "Link is required" } }, { status: 400 });
  }

  const resource = await getResourceForLink({ link });

  if (resource) {
    await updateUserResourceForResourceIdAndUserId({
      isBookmarked: true,
      resourceId: resource.id,
      userId,
    });

    return redirect(`/bookmarks`);
  }

  try {
    const response = await fetch(link);
    const html = await response.text();

    const metascraper: Scraper = require("metascraper")([
      require("metascraper-author")(),
      require("metascraper-date")(),
      require("metascraper-description")(),
      require("metascraper-image")(),
      require("metascraper-logo")(),
      require("metascraper-publisher")(),
      require("metascraper-title")(),
    ]);

    const scraped = (await metascraper({ html, url: link })) as Metadata & {
      logo: string;
    };

    if (!scraped || !scraped.title) {
      return json({ errors: { link: "Link is invalid" } }, { status: 400 });
    }

    const url = new URL(link);
    const website = url.origin;

    const publisher = await createPublisher({
      description: scraped.description,
      image: scraped.logo
        ? {
            link: website,
            title: scraped.title,
            url: scraped.logo,
          }
        : undefined,
      link: website,
      title: scraped.publisher ?? scraped.author ?? website,
    });

    const resource = await createResource({
      description: scraped.description ?? "",
      image: scraped.image
        ? {
            link,
            title: scraped.title,
            url: scraped.image,
          }
        : undefined,
      link,
      publishedAt:
        typeof scraped.date === "string" ? new Date(scraped.date) : undefined,
      publisherId: publisher.id,
      title: scraped.title,
    });

    await updateUserResourceForResourceIdAndUserId({
      isBookmarked: true,
      resourceId: resource.id,
      userId: userId,
    });

    return redirect(`/bookmarks`);
  } catch (e) {
    console.log(e);

    return json({ errors: { link: "Origin is invalid" } }, { status: 400 });
  }
}

export default function NewBookmarkPage() {
  const actionData = useActionData<typeof action>();

  const titleRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.link) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <SectionHeader>Add a new bookmark</SectionHeader>

        <Form method="post">
          <Card>
            <Card.Body>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="link"
                >
                  URL
                </label>

                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Link className="h-5 w-5 text-gray-400" weight="bold" />
                  </div>

                  <input
                    aria-invalid={actionData?.errors?.link ? true : undefined}
                    aria-errormessage={
                      actionData?.errors?.link ? "url-error" : undefined
                    }
                    autoFocus
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-600 sm:text-sm"
                    id="link"
                    name="link"
                    placeholder="https://blog.example.com/article"
                    type="url"
                    ref={titleRef}
                  />

                  {actionData?.errors?.link && (
                    <div className="pt-1 text-red-700" id="link-error">
                      {actionData.errors.link}
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>

            <Card.Footer>
              <div className="flex justify-end">
                <TextButton type="submit">
                  <BookmarkSimple weight="bold" />

                  <span>Save</span>
                </TextButton>
              </div>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </div>
  );
}
