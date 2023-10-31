import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateTimeInput from "./DateTimeInput";
import dayjs from "dayjs";
import { CQL } from "cqm-models";

const testDateTime: CQL.DateTimeField = dayjs.utc("2022-04-17T15:30");
const onDateTimeChange = jest.fn();

describe("DateTimeInput Component", () => {
  it("Should render DateTimeInput component with appropriate data", () => {
    render(
      <DateTimeInput
        label="Author Date/Time"
        dateTime={testDateTime}
        onDateTimeChange={onDateTimeChange}
        canEdit={false}
        attributeName="authorDatetime"
      />
    );

    expect(screen.getByTestId("author-date-time")).toBeInTheDocument();
    expect(screen.getByText("Author Date/Time")).toBeInTheDocument();
    expect(screen.getByDisplayValue("04/17/2022 03:30 PM")).toBeInTheDocument();
  });

  it("Should display changed DateTimeInput values when input changes", async () => {
    render(
      <DateTimeInput
        label="Author Date/Time"
        dateTime={testDateTime}
        onDateTimeChange={onDateTimeChange}
        canEdit={false}
        attributeName="authorDatetime"
      />
    );

    expect(screen.getByTestId("author-date-time")).toBeInTheDocument();
    expect(screen.getByText("Author Date/Time")).toBeInTheDocument();
    const inputValue = screen.getByDisplayValue("04/17/2022 03:30 PM");
    expect(inputValue).toBeInTheDocument();

    fireEvent.change(inputValue, { target: { value: "04/17/2023 08:00 AM" } });
    await (() => {
      expect(
        screen.getByDisplayValue("04/17/2023 08:00 AM")
      ).toBeInTheDocument();
    });
  });
});
