import { X } from "phosphor-react";

import { Stack } from "../layout";

import DialogClose from "./dialog-close";

type Props = {
  children: string;
};

export default function DialogHeader({ children }: Props) {
  return (
    <div className="px-4 py-4 sm:px-6">
      <Stack justifyContent="between">
        <h4 className="text-xl leading-none tracking-tight text-gray-900">
          {children}
        </h4>

        <DialogClose>
          <button type="button">
            <X />
          </button>
        </DialogClose>
      </Stack>
    </div>
  );
}
