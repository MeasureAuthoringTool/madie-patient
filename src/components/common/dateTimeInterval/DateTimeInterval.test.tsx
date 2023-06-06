import * as React from "react";
import { render, screen } from "@testing-library/react";
import DateTimeInterval from "./DateTimeInterval";
import dayjs from "dayjs";

describe("DateTimeInterval Field Component", () => {
  it("Should render date time Interval field component with appropriate data", async () => {
    render(
      <DateTimeInterval
        label="Active Period"
        startDateTime={dayjs("2022-04-17T15:30")}
        handleStartDateTimeChange={() => {
          return;
        }}
        endDateTime={dayjs("2022-09-17T15:30")}
        handleEndDateTimeChange={() => {
          return;
        }}
      />
    );

    expect(screen.getByText("Active Period - Start")).toBeInTheDocument();
    expect(screen.getByDisplayValue("04/17/2022 03:30 PM")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-start")).toBeInTheDocument();

    expect(screen.getByText("Active Period - End")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09/17/2022 03:30 PM")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-end")).toBeInTheDocument();
  });
});
