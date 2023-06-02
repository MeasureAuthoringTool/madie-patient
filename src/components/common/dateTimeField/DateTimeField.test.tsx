import * as React from "react";
import { render, screen } from "@testing-library/react";
import DateTimeField from "./DateTimeField";
import dayjs from "dayjs";

describe("DateTimeField Component", () => {
  it("Should render date time field components with appropriate data", async () => {
    render(
      <DateTimeField
        label="Active"
        dateValue={dayjs("2022-04-17")}
        dateOnChange={() => {return;}}
        timeOnChange={() => {return;}}
        timeValue={dayjs("2022-04-17T15:30")}
      />
    );

    expect(screen.getByText("Active Date/Time")).toBeInTheDocument();
    expect(screen.getByDisplayValue("04/17/2022")).toBeInTheDocument();
    expect(screen.getByDisplayValue("03:30 PM")).toBeInTheDocument();
    expect(screen.getByTestId("active-date/time")).toBeInTheDocument();
  });
});
