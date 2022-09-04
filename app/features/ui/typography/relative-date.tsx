import { useMemo } from "react";

import { Tooltip } from "~/features/ui/tooltip";

import { formatDateToRelative } from "./utils";

type Props = {
  date: Date | string;
};

export default function RelativeDate({ date: dateProp }: Props) {
  const date = useMemo(() => {
    return typeof dateProp === "string" ? new Date(dateProp) : dateProp;
  }, [dateProp]);

  const relativeDate = useMemo(() => {
    return formatDateToRelative(date);
  }, [date]);

  return (
    <Tooltip content={date.toLocaleString()}>
      <time
        className="whitespace-nowrap text-sm text-gray-500 hover:underline"
        dateTime={date.toISOString()}
      >
        {relativeDate}
      </time>
    </Tooltip>
  );
}
