import classNames from "classnames";
import { CircleNotch } from "phosphor-react";
import type { ReactNode } from "react";
import { Fragment } from "react";
import { useEffect, useRef, useState } from "react";

import TextButton from "./ui/text-button";

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

export default function InfiniteScroller<T extends { id: string }>({
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
        if (isDisabled || !ref.current) {
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
  }, [loadMoreItems, isDisabled, items]);

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
        <div className="flex justify-center">
          <TextButton isLoading={isLoading} onClick={handleLoadMore}>
            <CircleNotch
              className={classNames({
                "animate-spin": isLoading,
              })}
              weight="bold"
            />

            <span>Load more</span>
          </TextButton>
        </div>
      ) : null}
    </div>
  );
}
