import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemographicsSection from "./DemographicsSection";
import { within } from "@testing-library/dom";

import { QiCoreResourceProvider } from "../../../../../../util/QiCorePatientProvider";

describe("Display Demographics Section", () => {
  it("should display demographics section", () => {
    render(
      <QiCoreResourceProvider>
        <DemographicsSection canEdit={true} />
      </QiCoreResourceProvider>
    );

    expect(screen.getByText("Ethnicity (OMB)")).toBeInTheDocument();
  });

  it("Shows 'Ethnicity (Detailed)' selection when Hispanic is chosen", async () => {
    render(
      <QiCoreResourceProvider>
        <DemographicsSection canEdit={true} />
      </QiCoreResourceProvider>
    );
    const ethnicityOmbSelect = screen.getByTestId(
      "demographics-ethnicity-omb-select-id"
    );
    const selectDropdown = within(ethnicityOmbSelect).getByRole(
      "combobox"
    ) as HTMLInputElement;
    userEvent.click(selectDropdown);
    const selectOption = screen.getByText("Hispanic or Latino");
    expect(selectOption).toBeInTheDocument();

    const options = await screen.findAllByRole("option");

    fireEvent.click(options[1]);
    expect(screen.getByText("Ethnicity (Detailed)")).toBeInTheDocument();
  });
});
