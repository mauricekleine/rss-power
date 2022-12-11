import { Content, Overlay, Portal } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function DialogContent({ children }: Props) {
  return (
    <Portal>
      <Overlay className="fixed inset-0 bg-gray-600/50 motion-safe:animate-fade-in" />

      <Content
        className="fixed top-1/2 left-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 divide-y divide-gray-200 rounded-lg bg-white shadow-xl motion-safe:animate-fade-in"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {children}
      </Content>
    </Portal>
  );
}
