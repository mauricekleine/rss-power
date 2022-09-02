import classNames from "classnames";
import type { ValueOf } from "type-fest";

export const AvatarSize = {
  EXTRA_SMALL: "xs",
  SMALL: "s",
  MEDIUM: "m",
  LARGE: "l",
} as const;

type Props = {
  size?: ValueOf<typeof AvatarSize>;
  src?: string;
  title: string;
};

export default function Avatar({
  size = AvatarSize.MEDIUM,
  src,
  title,
}: Props) {
  if (typeof src === "string") {
    return (
      <img
        alt={title}
        className={classNames("rounded-full object-cover", {
          "h-6 w-6": size === AvatarSize.EXTRA_SMALL,
          "h-8 w-8": size === AvatarSize.SMALL,
          "h-10 w-10": size === AvatarSize.MEDIUM,
          "h-12 w-12": size === AvatarSize.LARGE,
        })}
        src={src}
      />
    );
  }

  return (
    <div className={classNames("rounded-full bg-gray-500")}>
      <span
        className={classNames(
          "flex items-center justify-center capitalize text-white",
          {
            "h-6 w-6 text-xs font-light": size === AvatarSize.EXTRA_SMALL,
            "h-8 w-8": size === AvatarSize.SMALL,
            "h-10 w-10": size === AvatarSize.MEDIUM,
            "h-12 w-12 text-2xl font-semibold": size === AvatarSize.LARGE,
          }
        )}
      >
        {title.replace(/http(s)?:\/\//, "").charAt(0)}
      </span>
    </div>
  );
}
