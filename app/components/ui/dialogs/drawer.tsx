import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useTransition } from "@remix-run/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";

type DrawerProps = {
  children: ReactNode | ReactNode[];
};

function Drawer({ children }: DrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const transition = useTransition();

  useEffect(() => {
    setIsOpen(false);
  }, [transition.location]);

  return (
    <DialogPrimitive.Root
      onOpenChange={(open) => setIsOpen(open)}
      open={isOpen}
    >
      {children}
    </DialogPrimitive.Root>
  );
}

type DrawerCloseProps = {
  children: ReactNode | ReactNode[];
};

function DrawerClose({ children }: DrawerCloseProps) {
  return (
    <DialogPrimitive.Close className="fixed right-2 bottom-2 z-10 animate-fade-in rounded-full bg-slate-400 p-2">
      {children}
    </DialogPrimitive.Close>
  );
}

type DrawerContentProps = {
  children: ReactNode | ReactNode[];
  closeComponent: ReactNode;
};

function DrawerContent({ children, closeComponent }: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-gray-600/75 motion-safe:animate-fade-in" />

      <DialogPrimitive.Content
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="fixed bottom-0 top-0 left-0 z-40 flex w-full max-w-xs flex-1 flex-col bg-white motion-safe:animate-slide-from-left">
          {children}
        </div>

        <DrawerClose>{closeComponent}</DrawerClose>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

type DrawerTriggerProps = {
  children: ReactNode | ReactNode[];
};

function DrawerTrigger({ children }: DrawerTriggerProps) {
  return (
    <DialogPrimitive.Trigger className="fixed right-2 bottom-2 z-10 rounded-full bg-slate-400/75 p-2 md:hidden">
      {children}
    </DialogPrimitive.Trigger>
  );
}

Drawer.Close = DrawerClose;
Drawer.Content = DrawerContent;
Drawer.Trigger = DrawerTrigger;

export default Drawer;
