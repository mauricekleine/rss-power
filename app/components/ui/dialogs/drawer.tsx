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
    <div className="absolute top-0 right-0 -mr-12 pt-2">
      <DialogPrimitive.Close className="fixed right-2 bottom-2 z-10 rounded-full bg-slate-400 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
        {children}
      </DialogPrimitive.Close>
    </div>
  );
}

type DrawerContentProps = {
  children: ReactNode | ReactNode[];
};

function DrawerContent({ children }: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="motion-safe:e-fade-in fixed inset-0 bg-gray-600/75" />

      <DialogPrimitive.Content className="fixed bottom-0 top-0 left-0 z-40 flex w-full max-w-xs flex-1 flex-col bg-white motion-safe:animate-slide-from-left">
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

type DrawerTriggerProps = {
  children: ReactNode | ReactNode[];
};

function DrawerTrigger({ children }: DrawerTriggerProps) {
  return (
    <DialogPrimitive.Trigger className="fixed right-2 bottom-2 z-10 rounded-full bg-slate-400/75 p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden">
      {children}
    </DialogPrimitive.Trigger>
  );
}

Drawer.Close = DrawerClose;
Drawer.Content = DrawerContent;
Drawer.Trigger = DrawerTrigger;

export default Drawer;
