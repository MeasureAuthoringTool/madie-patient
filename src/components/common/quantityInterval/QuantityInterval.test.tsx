import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import QuantityInterval from "./QuantityInterval";
import { CQL } from "cqm-models";
import userEvent from "@testing-library/user-event";

const ucum1 = {
  code: "mg",
  guidance: null,
  name: "milligram",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const ucum2 = {
  code: "wk",
  guidance: null,
  name: "week",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const lowQuantity: CQL.Quantity = {
  value: 1,
  unit: ucum1.code,
};

const highQuantity: CQL.Quantity = {
  value: 100,
  unit: ucum2.code,
};

describe("QuantityInterval Component", () => {
  it("Should render Quantity Interval component with appropriate data", async () => {
    render(
      <QuantityInterval
        label="Interval<Quantity>"
        lowQuantity={lowQuantity}
        highQuantity={highQuantity}
        canEdit={true}
      />
    );
    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();

    expect(screen.getByTestId("quantity-value-field-low")).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("1");
    const autocomplete1 = screen.getByTestId("quantity-unit-dropdown-low");
    const unitInputLow = within(autocomplete1).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputLow.value).not.toBeNull();

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      "quantity-value-input-high"
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("100");
    const autocomplete2 = screen.getByTestId("quantity-unit-dropdown-high");
    const unitInputHigh = within(autocomplete2).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputHigh.value).not.toBeNull();
  });

  it("test change quantity values", async () => {
    render(
      <QuantityInterval
        label="Interval<Quantity>"
        lowQuantity={lowQuantity}
        highQuantity={highQuantity}
        canEdit={true}
      />
    );

    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    expect(screen.getByTestId("quantity-value-field-low")).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("1");

    userEvent.click(inputLow);
    fireEvent.change(inputLow, {
      target: { value: 2 },
    });
    expect(inputLow.value).toBe("2");

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      "quantity-value-input-high"
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("100");

    userEvent.click(inputHigh);
    fireEvent.change(inputHigh, {
      target: { value: 200 },
    });
    expect(inputHigh.value).toBe("200");
  });

  it("test change quantity units", async () => {
    render(
      <QuantityInterval
        label="Interval<Quantity>"
        lowQuantity={lowQuantity}
        highQuantity={highQuantity}
        canEdit={true}
      />
    );
    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();

    const autocomplete1 = screen.getByTestId("quantity-unit-dropdown-low");
    const unitInputLow = within(autocomplete1).getByRole(
      "combobox"
    ) as HTMLInputElement;
    //expect(unitInputLow.value).toEqual("mg milligram");
    userEvent.click(autocomplete1);
    userEvent.keyboard("wk week");
    fireEvent.mouseDown(autocomplete1);
    expect(unitInputLow.value).toEqual("wk week");

    const autocomplete2 = screen.getByTestId("quantity-unit-dropdown-high");
    const unitInputHigh = within(autocomplete2).getByRole(
      "combobox"
    ) as HTMLInputElement;
    //expect(unitInputHigh.value).toEqual("wk week");
    userEvent.click(autocomplete2);
    userEvent.keyboard("mg milligram");
    fireEvent.mouseDown(autocomplete2);
    expect(unitInputHigh.value).toEqual("mg milligram");
  });
});
