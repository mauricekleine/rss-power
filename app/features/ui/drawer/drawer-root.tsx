import { Root } from "@radix-ui/react-dialog";
import { useTransition } from "@remix-run/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useState } from "react";

type Props = {
  children: ReactNode | ReactNode[];
};

export default function Drawer({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const transition = useTransition();

  useEffect(() => {
    setIsOpen(false);
  }, [transition.location]);

  return (
    <Root onOpenChange={(open) => setIsOpen(open)} open={isOpen}>
      {children}
    </Root>
  );
}
