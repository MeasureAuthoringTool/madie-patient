import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import QuantityInterval from "./QuantityInterval";

const ucum1 = {
  code: "mg",
  guidance: null,
  name: "milligram",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const testValue1 = {
  label: "mg milligram",
  value: ucum1,
};

const ucum2 = {
  code: "wk",
  guidance: null,
  name: "week",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const testValue2 = {
  label: "wk week",
  value: ucum2,
};

describe("QuantityInterval Component", () => {
  it("Should render Quantity Interval component with appropriate data", async () => {
    render(
      <QuantityInterval
        label="Interval<Quantity>"
        lowQuantity={1}
        handleLowQuantityChange={() => {}}
        lowQuantityUnit={testValue1}
        handleLowQuantityUnitChange={() => {}}
        highQuantity={100}
        handleHighQuantityChange={() => {}}
        highQuantityUnit={testValue2}
        handleHighQuantityUnitChange={() => {}}
        canEdit={true}
      />
    );
    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();
    expect(screen.getAllByText("Value").length).toBe(2);
    expect(screen.getAllByText("Unit").length).toBe(2);

    expect(screen.getByTestId("quantity-value-field-low")).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("1");
    const autocomplete1 = screen.getByTestId("quantity-unit-dropdown-low");
    const unitInputLow = within(autocomplete1).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputLow.value).toEqual("mg milligram");

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      "quantity-value-input-high"
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("100");
    const autocomplete2 = screen.getByTestId("quantity-unit-dropdown-high");
    const unitInputHigh = within(autocomplete2).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputHigh.value).toEqual("wk week");
  });
});
