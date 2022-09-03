import { Link } from "@remix-run/react";
import classNames from "classnames";

import { Avatar } from "~/features/ui/avatar";
import { Stack } from "~/features/ui/layout";

type Props = {
  imageUrl?: string;
  linkToFeed?: string;
  title: string;
};

export default function ResourceCardHeader({
  imageUrl,
  linkToFeed,
  title,
}: Props) {
  const Base = (
    <Stack gap="gap-2">
      <Avatar size="xs" src={imageUrl} title={title} />

      <span
        className={classNames("truncate text-sm text-gray-700", {
          "underline hover:no-underline": linkToFeed,
        })}
      >
        {title}
      </span>
    </Stack>
  );

  if (linkToFeed) {
    return <Link to={linkToFeed}>{Base}</Link>;
  }

  return Base;
}
