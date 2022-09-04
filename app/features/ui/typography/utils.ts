import { format, formatDistanceStrict, isThisYear } from "date-fns";

export function formatDateToRelative(date: Date) {
  const baseDate = new Date();

  const distance = formatDistanceStrict(new Date(date), baseDate);
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
}
