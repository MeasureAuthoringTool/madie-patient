import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DemographicsSection from "./DemographicsSection";

describe("Display Demographics Section", () => {
  it("should display demographics section", () => {
    render(<DemographicsSection canEdit={true} />);

    expect(screen.getByText("Ethnicity (OMB)")).toBeInTheDocument();
  });
});
