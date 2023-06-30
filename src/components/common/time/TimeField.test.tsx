import * as React from "react";
import { render, screen } from "@testing-library/react";
import TimeField from "./TimeField";

describe("TimeField Component", () => {
  it("Should render time field component with appropriate data", async () => {
    render(
      <TimeField
        label="Result"
        time={"2023-06-30T06:23"}
        handleTimeChange={() => {}}
        canEdit={true}
        required={true}
      />
    );

    expect(screen.getByText("Result")).toBeInTheDocument();
    expect(screen.getByDisplayValue("06:23 AM")).toBeInTheDocument();
    expect(screen.getByTestId("result")).toBeInTheDocument();
  });
});
