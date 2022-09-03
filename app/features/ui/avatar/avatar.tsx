import classNames from "classnames";
import type { ValueOf } from "type-fest";

import { Sizes } from "../tokens";

export const AvatarSize = {
  ...Sizes.XS,
  ...Sizes.SM,
  ...Sizes.MD,
  ...Sizes.LG,
} as const;

type Props = {
  size?: ValueOf<typeof AvatarSize>;
  src?: string;
  title: string;
};

export default function Avatar({ size = AvatarSize.MD, src, title }: Props) {
  if (typeof src === "string") {
    return (
      <img
        alt={title}
        className={classNames("rounded-full object-cover", {
          "h-6 w-6": size === AvatarSize.XS,
          "h-8 w-8": size === AvatarSize.SM,
          "h-10 w-10": size === AvatarSize.MD,
          "h-12 w-12": size === AvatarSize.LG,
        })}
        src={src}
      />
    );
  }

  return (
    <p
      className={classNames(
        "flex shrink-0 items-center justify-center rounded-full bg-gray-500 capitalize text-white",
        {
          "h-6 w-6 text-xs font-light": size === AvatarSize.XS,
          "h-8 w-8 text-sm": size === AvatarSize.SM,
          "h-10 w-10": size === AvatarSize.MD,
          "h-12 w-12 text-2xl font-medium": size === AvatarSize.LG,
        }
      )}
    >
      {title.replace(/http(s)?:\/\//, "").charAt(0)}
    </p>
  );
}
