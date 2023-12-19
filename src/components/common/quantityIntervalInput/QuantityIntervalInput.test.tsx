import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import QuantityIntervalInput from "./QuantityIntervalInput";
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

const quantityInterval: CQL.Interval = {
  low: lowQuantity,
  high: highQuantity,
};

const onQuantityIntervalChange = jest.fn();

describe("QuantityIntervalInput Component", () => {
  it("Should render Quantity Interval component with appropriate data", async () => {
    render(
      <QuantityIntervalInput
        label="Interval<Quantity>"
        quantityInterval={quantityInterval}
        onQuantityIntervalChange={onQuantityIntervalChange}
        canEdit={true}
      />
    );
    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();

    expect(screen.getByTestId("quantity-value-field-low")).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      `quantity-value-input-low`
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("1");

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      `quantity-value-input-high`
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("100");
  });

  it("test change quantity values", async () => {
    render(
      <QuantityIntervalInput
        label="Interval<Quantity>"
        quantityInterval={quantityInterval}
        onQuantityIntervalChange={onQuantityIntervalChange}
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
      target: { value: "2" },
    });

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      "quantity-value-input-high"
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("100");

    userEvent.click(inputHigh);
    fireEvent.change(inputHigh, {
      target: { value: 200 },
    });
  });

  it("test change quantity units", async () => {
    render(
      <QuantityIntervalInput
        label="Interval<Quantity>"
        quantityInterval={quantityInterval}
        onQuantityIntervalChange={onQuantityIntervalChange}
        canEdit={true}
      />
    );
    expect(screen.getByText("Interval<Quantity>")).toBeInTheDocument();
  });
});
