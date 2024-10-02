import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateTimeComponent from "./DateTimeComponent";
import userEvent from "@testing-library/user-event";

describe("DateTimeComponent", () => {
  test("Should render DateTimeComponent", () => {
    const handleChange = jest.fn();
    render(
      <DateTimeComponent
        canEdit={true}
        fieldRequired={false}
        value={`2024-09-26T08:33:33.000-05:00`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    const dateField = screen.getByTestId("date-field");
    expect(dateField).toBeInTheDocument();

    const inputDate = screen.getByTestId("date-field-input");
    expect(inputDate).toBeInTheDocument();

    const inputTime = screen.getByPlaceholderText("hh:mm:ss aa");
    expect(inputTime).toBeInTheDocument();

    const inputZone = screen.getByTestId("timezone-input-field-DateTime");
    expect(inputZone).toBeInTheDocument();
  });

  test("Should handle change", () => {
    const handleChange = jest.fn();
    render(
      <DateTimeComponent
        canEdit={true}
        fieldRequired={false}
        value={`2024-09-26T08:33:33.000-05:00`}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    const dateField = screen.getByTestId("date-field");
    expect(dateField).toBeInTheDocument();

    const inputDate = screen.getByTestId("date-field-input");
    expect(inputDate).toBeInTheDocument();
    userEvent.type(inputDate, "09/27/2024");
    expect(screen.getByDisplayValue("09/27/2024")).toBeInTheDocument();

    const inputTime = screen.getByPlaceholderText("hh:mm:ss aa");
    expect(inputTime).toBeInTheDocument();
    userEvent.type(inputTime, "07:33:33 PM");
    expect(screen.getByDisplayValue("07:33:33 PM")).toBeInTheDocument();

    const timeZone = screen.getByTestId("timezone-input-field-DateTime");
    expect(timeZone).toBeInTheDocument();
    fireEvent.change(timeZone, { target: { value: "America/New_York - EST" } });
    expect(
      screen.getByDisplayValue("America/New_York - EST")
    ).toBeInTheDocument();
  });
});
