import classNames from "classnames";
import type { ReactNode } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import { TextButton } from "~/features/ui/button";
import { CircleNotch } from "~/features/ui/icon";
import { Stack } from "~/features/ui/layout";

const SCROLL_OFFSET = 750;

type Props<T> = {
  count: number;
  isDisabled: boolean;
  isLoading: boolean;
  initialItems: T[];
  items?: T[];
  loadMoreItems: (count: number) => void;
  renderItem: (item: T) => ReactNode;
};

export default function LazyList<T extends { id: string }>({
  count,
  isDisabled,
  isLoading,
  initialItems,
  items: moreItems,
  loadMoreItems,
  renderItem,
}: Props<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<T[]>(initialItems);

  const handleLoadMore = () => {
    if (isDisabled) {
      return;
    }

    loadMoreItems(items.length);
  };

  useEffect(() => {
    let debounce: NodeJS.Timer;

    const scrollHandler = () => {
      clearTimeout(debounce);

      debounce = setTimeout(() => {
        if (isDisabled || count === items.length || !ref.current) {
          return;
        }

        if (
          document.documentElement.scrollTop >
          ref.current?.offsetHeight - SCROLL_OFFSET
        ) {
          loadMoreItems(items.length);
        }
      }, 100);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      clearTimeout(debounce);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, [count, loadMoreItems, isDisabled, items]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (Array.isArray(moreItems)) {
      setItems((items) => [...items, ...moreItems]);
    }
  }, [moreItems]);

  return (
    <div className="space-y-4" ref={ref}>
      {items.map((item) => (
        <Fragment key={item.id}>{renderItem(item)}</Fragment>
      ))}

      {items.length < count ? (
        <Stack justifyContent="center">
          <TextButton isLoading={isLoading} onClick={handleLoadMore}>
            <CircleNotch
              className={classNames({
                "animate-spin": isLoading,
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