import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateTimeInterval from "./DateTimeInterval";
import dayjs from "dayjs";
import { CQL } from "cqm-models";

const startDateTime: CQL.DateTimeField = dayjs.utc("2022-04-17T15:30");
const endDateTime: CQL.DateTimeField = dayjs.utc("2022-09-17T15:30");
const testDateTimeInterval: CQL.DateTimeInterval = {
  low: startDateTime,
  high: endDateTime,
};
const onDateTimeIntervalChange = jest.fn();

jest.mock("dayjs", () => ({
  extend: jest.fn(),
  utc: jest.fn((...args) => {
    const dayjs = jest.requireActual("dayjs");
    dayjs.extend(jest.requireActual("dayjs/plugin/utc"));

    return dayjs.utc(
      args.filter((arg) => arg).length > 0 ? args : "08/03/2023"
    );
  }),
}));

describe("DateTimeInterval Field Component", () => {
  it("Should render DateTimeInterval component with appropriate data", () => {
    render(
      <DateTimeInterval
        label="Active Period"
        dateTimeInterval={testDateTimeInterval}
        onDateTimeIntervalChange={onDateTimeIntervalChange}
        canEdit={false}
        attributeName="relevantPeriod"
      />
    );

    expect(screen.getByText("Active Period - Start")).toBeInTheDocument();
    expect(screen.getByDisplayValue("04/17/2022 03:30 PM")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-start")).toBeInTheDocument();

    expect(screen.getByText("Active Period - End")).toBeInTheDocument();
    expect(screen.getByDisplayValue("09/17/2022 03:30 PM")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-end")).toBeInTheDocument();
  });

  it("Should display changed DateTimeInterval values when input changes", async () => {
    render(
      <DateTimeInterval
        label="Active Period"
        dateTimeInterval={testDateTimeInterval}
        onDateTimeIntervalChange={onDateTimeIntervalChange}
        canEdit={false}
        attributeName="relevantPeriod"
      />
    );

    expect(screen.getByText("Active Period - Start")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-start")).toBeInTheDocument();
    const inputStart = screen.getByDisplayValue("04/17/2022 03:30 PM");
    expect(inputStart).toBeInTheDocument();

    expect(screen.getByText("Active Period - End")).toBeInTheDocument();
    expect(screen.getByTestId("active-period-end")).toBeInTheDocument();
    const inputEnd = screen.getByDisplayValue("09/17/2022 03:30 PM");
    expect(inputEnd).toBeInTheDocument();

    fireEvent.change(inputStart, { target: { value: "04/17/2023 08:00 AM" } });
    fireEvent.change(inputEnd, { target: { value: "09/17/2022 05:30 PM" } });
    await (() => {
      expect(
        screen.getByDisplayValue("04/17/2023 08:00 AM")
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("09/17/2022 05:30 PM")
      ).toBeInTheDocument();
    });
  });
});
