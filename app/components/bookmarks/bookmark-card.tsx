import type { Image, Resource, UserResource } from "@prisma/client";
import { useMemo } from "react";

import Avatar from "../ui/avatars/avatar";
import SanitizedText from "../ui/typography/sanitized-text";

import Card from "~/components/ui/cards/card";

import type { Nullable } from "~/utils";

type Props = {
  userResource: UserResource & {
    resource: Resource & {
      image?: Nullable<Image>;
    };
  };
};

export default function BookmarkCard({ userResource }: Props) {
  const { resource } = userResource;

  const host = useMemo(() => {
    const url = new URL(resource.link);

    return url.hostname;
  }, [resource.link]);

  return (
    <Card>
      <Card.Header>
        <Avatar image={resource.image} title={resource.title}>
          {host}
        </Avatar>
      </Card.Header>

      <Card.LinkableBody href={resource.link}>
        <div className="flex justify-between space-x-3">
          <div className="mt-1 text-sm text-gray-600 line-clamp-4">
            <SanitizedText text={resource.description} />
          </div>
        </div>
      </Card.LinkableBody>

      <Card.Footer>
        <div className="flex justify-between">What's up</div>
      </Card.Footer>
    </Card>
  );
}
