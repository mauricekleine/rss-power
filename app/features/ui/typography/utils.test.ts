import {
  format,
  subDays,
  subHours,
  subMinutes,
  subSeconds,
  subYears,
} from "date-fns";

import { formatDateToRelative } from "./utils";

describe("formatDateToRelative", () => {
  it("returns the relative date for a given Date object", () => {
    const now = new Date();

    expect(formatDateToRelative(subSeconds(now, 2))).toBe("2s");
    expect(formatDateToRelative(subMinutes(now, 9))).toBe("9m");
    expect(formatDateToRelative(subHours(now, 7))).toBe("7h");
    expect(formatDateToRelative(subDays(now, 15))).toBe(
      format(subDays(now, 15), "MMM d")
    );
    expect(formatDateToRelative(subYears(now, 2))).toBe(
      format(subYears(now, 2), "MMM d, yyyy")
    );
  });
});
