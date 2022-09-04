import { render, screen } from "@testing-library/react";
import {
  format,
  subDays,
  subHours,
  subMinutes,
  subSeconds,
  subYears,
} from "date-fns";

import { RelativeDate } from "./index";

describe("<RelativeDate />", () => {
  it("renders a relative date of 2 seconds ago", () => {
    const twoSecondsAgo = subSeconds(new Date(), 2);
    render(<RelativeDate date={twoSecondsAgo} />);

    const rendered = screen.getByText("2s");

    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("datetime", twoSecondsAgo.toISOString());
  });

  it("renders a relative date of 3 minutes ago", () => {
    const threeMinutesAgo = subMinutes(new Date(), 3);
    render(<RelativeDate date={threeMinutesAgo} />);

    const rendered = screen.getByText("3m");

    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("datetime", threeMinutesAgo.toISOString());
  });

  it("renders a relative date of 6 hours ago", () => {
    const sixHoursAgo = subHours(new Date(), 6);
    render(<RelativeDate date={sixHoursAgo} />);

    const rendered = screen.getByText("6h");

    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("datetime", sixHoursAgo.toISOString());
  });

  it("renders a relative date of 15 days ago", () => {
    const fifteenDaysAgo = subDays(new Date(), 15);
    render(<RelativeDate date={fifteenDaysAgo} />);

    const rendered = screen.getByText(format(fifteenDaysAgo, "MMM d"));

    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("datetime", fifteenDaysAgo.toISOString());
  });

  it("renders a relative date of 9 years ago", () => {
    const nineYearsAgo = subYears(new Date(), 9);
    render(<RelativeDate date={nineYearsAgo} />);

    const rendered = screen.getByText(format(nineYearsAgo, "MMM d, yyyy"));

    expect(rendered).toBeInTheDocument();
    expect(rendered).toHaveAttribute("datetime", nineYearsAgo.toISOString());
  });
});
