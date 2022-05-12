import type { ReactNode } from "react";

import type { Image } from "~/models/image.server";
import type { Nullable } from "~/utils";

type Props = {
  children?: ReactNode;
  image?: Nullable<Image>;
  title: string;
};

export default function Avatar({ children, image, title }: Props) {
  return (
    <div className="flex items-center space-x-2 leading-none">
      <div className="flex-shrink-0">
        {image ? (
          <img
            alt={image.title ?? title}
            className="h-8 w-8 rounded-full object-cover"
            src={image.url}
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-white">
            {title.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{title}</p>

        <div className="text-sm text-gray-500">{children}</div>
      </div>
    </div>
  );
}
