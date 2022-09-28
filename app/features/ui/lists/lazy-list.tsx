import { useSearchParams, useTransition } from "@remix-run/react";
import type { ReactNode } from "react";

import { TextButton } from "~/features/ui/button";
import { CaretLeft, CaretRight, CircleNotch } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";

import { parsePaginatedSearchParams } from "./utils";

type Props<T extends { id: string }[]> = {
  count: number;
  items: T;
  renderItem: (item: T[0]) => ReactNode;
};

export default function LazyList<T extends { id: string }[]>({
  count,
  items,
  renderItem,
}: Props<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { limit, offset } = parsePaginatedSearchParams(searchParams);
  const transition = useTransition();

  const hasNewerPages = offset > 0;
  const hasOlderPages = count > offset + limit;

  return (
    <div className="space-y-4">
      {hasNewerPages ? (
        <Stack justifyContent="center">
          <TextButton
            isLoading={transition.state === "loading"}
            onClick={() => {
              setSearchParams({
                offset: (offset - limit).toString(),
              });
            }}
          >
            <div className="h-3 w-3">
              {transition.state === "loading" ? (
                <CircleNotch className="animate-spin" weight="bold" />
              ) : (
                <CaretLeft weight="bold" />
              )}
            </div>

            <span> Newer</span>
          </TextButton>
        </Stack>
      ) : null}

      {items.map((item) => {
        return <div key={item.id}>{renderItem(item)}</div>;
      })}

      {hasOlderPages ? (
        <Stack justifyContent="center">
          <TextButton
            isLoading={transition.state === "loading"}
            onClick={() => {
              setSearchParams({
                offset: (offset + limit).toString(),
              });
            }}
          >
            <span> Older</span>

            <div className="h-3 w-3">
              {transition.state === "loading" ? (
                <CircleNotch className="animate-spin" weight="bold" />
              ) : (
                <CaretRight />
              )}
            </div>
          </TextButton>
        </Stack>
      ) : null}
    </div>
  );
}
