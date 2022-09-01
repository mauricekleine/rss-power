import { Content, Overlay, Portal } from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

import DrawerClose from "./drawer-close";

type Props = {
  children: ReactNode | ReactNode[];
  closeComponent: ReactNode;
};

export default function DrawerContent({ children, closeComponent }: Props) {
  return (
    <Portal>
      <Overlay className="fixed inset-0 bg-gray-600/75 motion-safe:animate-fade-in" />

      <Content onOpenAutoFocus={(event) => event.preventDefault()}>
        <div className="fixed bottom-0 top-0 left-0 z-40 flex w-full max-w-xs flex-1 flex-col bg-gray-100 motion-safe:animate-slide-from-left">
          {children}
        </div>

        <DrawerClose>{closeComponent}</DrawerClose>
      </Content>
    </Portal>
  );
}
