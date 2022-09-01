import { format, formatDistanceStrict, isThisYear } from "date-fns";
import { useMemo } from "react";

import { Tooltip } from "~/features/ui/tooltip";

type Props = {
  date: Date | string;
};

export default function RelativeDate({ date: dateProp }: Props) {
  const date = useMemo(() => {
    return typeof dateProp === "string" ? new Date(dateProp) : dateProp;
  }, [dateProp]);

  const relativeDate = useMemo(() => {
    const baseDate = new Date();

    const distance = `${formatDistanceStrict(new Date(date), baseDate)}`;
    const [number, unit] = distance.split(" ");

    if (unit === "seconds") {
      return `${number}s`;
    }

    if (unit === "minutes") {
      return `${number}m`;
    }

    if (unit === "hours") {
      return `${number}h`;
    }

    if (isThisYear(date)) {
      return format(date, "MMM d");
    }

    return format(date, "MMM d, yyyy");
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
