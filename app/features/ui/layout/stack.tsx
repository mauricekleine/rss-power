import classNames from "classnames";
import type { ReactNode } from "react";
import { Children } from "react";
import type { ValueOf } from "type-fest";

export const StackAlignItems = {
  CENTER: "center",
  NONE: "none",
} as const;

export const StackDirection = {
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
} as const;

export const StackGap = {
  GAP0: "gap-0",
  GAP1: "gap-1",
  GAP2: "gap-2",
  GAP4: "gap-4",
  GAP6: "gap-6",
} as const;

export const StackJustifyContent = {
  BETWEEN: "between",
  CENTER: "center",
  END: "end",
  NONE: "none",
} as const;

function Divider({ direction }: Pick<Props, "direction">) {
  return (
    <div
      aria-orientation={
        direction === StackDirection.VERTICAL ? "horizontal" : "vertical"
      }
      className={classNames("border-gray-200", {
        "w-full border-t": direction === StackDirection.VERTICAL,
        "before:absolute before:top-0 before:h-full before:border-l after:absolute after:top-0 after:h-full after:border-l":
          direction === StackDirection.HORIZONTAL,
      })}
      role="separator"
    />
  );
}

function joinChildren(
  children: ReactNode[],
  direction: ValueOf<typeof StackDirection>
) {
  const childrenArray = Children.toArray(children).filter(Boolean);

  return childrenArray.reduce<ReactNode[]>((output, child, index) => {
    output.push(child);

    if (index < childrenArray.length - 1) {
      output.push(<Divider direction={direction} key={`divider-${index}`} />);
    }

    return output;
  }, []);
}

type Props = {
  alignItems?: ValueOf<typeof StackAlignItems>;
  children: ReactNode | ReactNode[];
  direction?: ValueOf<typeof StackDirection>;
  gap?: ValueOf<typeof StackGap>;
  hasDivider?: boolean;
  justifyContent?: ValueOf<typeof StackJustifyContent>;
};

export default function Stack({
  alignItems = StackAlignItems.CENTER,
  children,
  direction = StackDirection.HORIZONTAL,
  gap,
  hasDivider = false,
  justifyContent,
}: Props) {
  return (
    <div
      className={classNames("relative flex", {
        "flex-col": direction === StackDirection.VERTICAL,
        "flex-row": direction === StackDirection.HORIZONTAL,
        "items-center":
          direction === StackDirection.HORIZONTAL &&
          alignItems === StackAlignItems.CENTER,
        "justify-between": justifyContent === StackJustifyContent.BETWEEN,
        "justify-center": justifyContent === StackJustifyContent.CENTER,
        "justify-end": justifyContent === StackJustifyContent.END,
        "gap-x-1":
          direction === StackDirection.HORIZONTAL && gap === StackGap.GAP1,
        "gap-x-2":
          direction === StackDirection.HORIZONTAL && gap === StackGap.GAP2,
        "gap-x-4":
          direction === StackDirection.HORIZONTAL && gap === StackGap.GAP4,
        "gap-x-6":
          direction === StackDirection.HORIZONTAL && gap === StackGap.GAP6,
        "gap-y-1":
          direction === StackDirection.VERTICAL && gap === StackGap.GAP1,
        "gap-y-2":
          direction === StackDirection.VERTICAL && gap === StackGap.GAP2,
        "gap-y-4":
          direction === StackDirection.VERTICAL && gap === StackGap.GAP4,
        "gap-y-6":
          direction === StackDirection.VERTICAL && gap === StackGap.GAP6,
      })}
    >
      {hasDivider && Array.isArray(children)
        ? joinChildren(children, direction)
        : children}
    </div>
  );
}
