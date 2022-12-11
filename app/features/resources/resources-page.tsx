import type { ForwardRefExoticComponent } from "react";

import { ResourceCard } from "~/features/resources";
import type { IconProps } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";
import { LazyList } from "~/features/ui/lists";
import { PageHeader } from "~/features/ui/typography";

import type { PaginatedResourcesForUserId } from "~/models/resource.server";

type Props = {
  count: number;
  description: string;
  icon: ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  resources: PaginatedResourcesForUserId;
  title: string;
};

export default function ResourcePage({
  count,
  description,
  icon: Icon,
  resources,
  title,
}: Props) {
  return (
    <div>
      <div className="mb-5 border-b border-gray-200 pb-5">
        <Stack alignItems="center" gap="gap-1">
          <Icon className="h-6 w-6 text-black" weight="bold" />

          <PageHeader>{title}</PageHeader>
        </Stack>

        <p className="mt-2 max-w-4xl text-sm text-gray-600">{description}</p>
      </div>

      <LazyList
        count={count}
        items={resources}
        renderItem={(item) => (
          <ResourceCard
            resource={item}
            showPublisherInformation
            userResource={item.userResources[0]}
          />
        )}
      />
    </div>
  );
}
