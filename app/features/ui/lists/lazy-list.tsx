import { useSearchParams, useTransition } from "@remix-run/react";
import classNames from "classnames";
import type { ReactNode } from "react";
import { useState } from "react";
import { useEffect, useRef } from "react";

import { TextButton } from "~/features/ui/button";
import { CircleNotch } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";

import { parsePaginatedSearchParams } from "./utils";

const SCROLL_OFFSET = 750;

type Props<T extends { id: string }[]> = {
  count: number;
  items: T;
  renderItem: (item: T[0]) => ReactNode;
};

export default function LazyList<T extends { id: string }[]>({
  count,
  items: paginatedItems,
  renderItem,
}: Props<T>) {
  const bottomElement = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { limit, offset } = parsePaginatedSearchParams(searchParams);

  const [prevPaginatedItems, setPrevPaginatedItems] =
    useState<T>(paginatedItems);

  const [cache, setCache] = useState<{ [key: string]: T[0] }>(() => {
    const cacheUpdate: { [key: string]: T[0] } = {};

    paginatedItems.forEach((item) => {
      cacheUpdate[item.id] = item;
    });

    return cacheUpdate;
  });

  const [sortedItemIds, setSortedItemIds] = useState<string[]>(() =>
    paginatedItems.map((item) => item.id)
  );

  if (paginatedItems !== prevPaginatedItems) {
    const cacheUpdate: { [key: string]: T[0] } = {};
    const sortedItemIdsUpdate: string[] = [];

    paginatedItems.forEach((item) => {
      cacheUpdate[item.id] = item;

      if (!sortedItemIds.includes(item.id)) {
        sortedItemIdsUpdate.push(item.id);
      }
    });

    setCache((cache) => ({ ...cache, ...cacheUpdate }));
    setSortedItemIds((sortedItemIds) => [
      ...sortedItemIds,
      ...sortedItemIdsUpdate,
    ]);
    setPrevPaginatedItems(paginatedItems);
  }

  const transition = useTransition();
  const bottomReached = offset + limit > count;

  useEffect(() => {
    let bottomObserver: IntersectionObserver | null = null;

    if (!bottomReached && bottomElement.current && !bottomObserver) {
      bottomObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setSearchParams(
              { limit: (limit + 50).toString(), offset: "0" },
              { replace: true, state: { scroll: false } }
            );
          }
        },
        {
          root: null,
          rootMargin: `${SCROLL_OFFSET}px`,
        }
      );

      bottomObserver.observe(bottomElement.current);
    }

    return () => {
      bottomObserver?.disconnect();
    };
  }, [limit, offset, setSearchParams, bottomReached]);

  return (
    <div className="space-y-4">
      {sortedItemIds.map((id, index) => {
        const isBottomElement = index === sortedItemIds.length - 1;

        return (
          <div key={id} ref={isBottomElement ? bottomElement : null}>
            {renderItem(cache[id])}
          </div>
        );
      })}

      {sortedItemIds.length < count ? (
        <Stack justifyContent="center">
          <TextButton isLoading={transition.state === "loading"}>
            <CircleNotch
              className={classNames({
                "animate-spin": transition.state === "loading",
              })}
              weight="bold"
            />

            <span>Load more</span>
          </TextButton>
        </Stack>
      ) : null}
    </div>
  );
}
