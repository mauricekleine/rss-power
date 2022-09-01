import classNames from "classnames";
import type { ReactNode } from "react";

import { PageHeader } from "~/features/ui/typography";

import type { Image } from "~/models/image.server";

import type { Nullable } from "~/utils";

type Props = {
  children?: ReactNode;
  image?: Nullable<Image>;
  pageHeader?: boolean;
  title: string;
};

export default function Avatar({ children, image, pageHeader, title }: Props) {
  return (
    <div className="flex items-center space-x-2 leading-none">
      <div className="flex-shrink-0">
        {image ? (
          <img
            alt={image.title ?? title}
            className={classNames("rounded-full object-cover", {
              "h-10 w-10": !pageHeader,
              "h-12 w-12": pageHeader,
            })}
            src={image.url}
          />
        ) : (
          <span
            className={classNames(
              "flex items-center justify-center rounded-full bg-gray-500 capitalize text-white",
              {
                "h-10 w-10": !pageHeader,
                "h-12 w-12 text-2xl font-semibold": pageHeader,
              }
            )}
          >
            {title.replace(/http(s)?:\/\//, "").charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {pageHeader ? (
          <PageHeader>{title}</PageHeader>
        ) : (
          <p className="truncate text-sm font-medium text-gray-900">{title}</p>
        )}

        <div className="text-sm text-gray-500">{children}</div>
      </div>
    </div>
  );
}
