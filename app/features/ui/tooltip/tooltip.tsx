import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
  content: string;
  delayDuration?: ComponentProps<
    typeof TooltipPrimitive.Provider
  >["delayDuration"];
};

function Tooltip({ children, content, delayDuration = 700 }: Props) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

        <TooltipPrimitive.Content
          className="rounded-lg bg-gray-900/90 px-2 py-1 text-xs text-gray-50"
          sideOffset={2}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default Tooltip;
