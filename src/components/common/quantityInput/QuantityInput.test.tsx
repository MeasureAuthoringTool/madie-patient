import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import QuantityInput from "./QuantityInput";
import { CQL } from "cqm-models";
import userEvent from "@testing-library/user-event";

describe("QuantityInput Component", () => {
  const testValue = {
    label: "mg milligram",
    value: {
      code: "mg",
      guidance: null,
      name: "milligram",
      system: "https://clinicaltables.nlm.nih.gov/",
    },
  };

  const testQuantity: CQL.Quantity = {
    value: 0,
    unit: testValue.value.code,
  };

  const testQuantity2: CQL.Quantity = {
    value: 0,
    unit: "",
  };
  const testQuantity3: CQL.Quantity = {
    value: null,
    unit: testValue.value.code,
  };

  const onQuantityChange = jest.fn();

  test("Should render quantity component", () => {
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity}
        label="low"
        onQuantityChange={onQuantityChange}
      />
    );

    const quantityValue = screen.getByTestId("quantity-value-field-low");
    expect(quantityValue).toBeInTheDocument();
    const quantityValueInput = screen.getByTestId("quantity-value-input-low");
    expect(quantityValueInput).toBeInTheDocument();

    const quantityUnit = screen.getByTestId("quantity-unit-input-low");
    expect(quantityUnit).toBeInTheDocument();
  });

  test("Test change of value", () => {
    const handleQuantityChange = jest.fn();
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity}
        onQuantityChange={handleQuantityChange}
      />
    );

    const quantityValue = screen.getByTestId("quantity-value-field-quantity");
    expect(quantityValue).toBeInTheDocument();
    const quantityValueInput = screen.getByTestId(
      "quantity-value-input-quantity"
    ) as HTMLInputElement;
    expect(quantityValueInput).toBeInTheDocument();
    expect(quantityValueInput.value).toBe("0");
    fireEvent.change(quantityValueInput, { target: { value: "10" } });
  });

  test.skip("Should render quantity unit field with selected option", async () => {
    const handleChange = jest.fn();
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity}
        label="high"
        onQuantityChange={onQuantityChange}
      />
    );
    await act(async () => {
      const quantityAutoComplete = await screen.findByTestId(
        "quantity-unit-dropdown-high"
      );
      const listBox = within(quantityAutoComplete).getByRole("combobox");
      expect(listBox).toHaveValue(
        `${testValue.value.code} ${testValue.value.name}`
      );
    });
  });

  test("should ignore - and non-quantity-valueber keys, number field behavior expexted", async () => {
    const onQuantityChange = jest.fn();
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity3}
        label="test"
        onQuantityChange={onQuantityChange}
      />
    );
    const quantityField = screen.getByTestId("quantity-value-field-test");
    expect(quantityField).toBeInTheDocument();
    const quantityFieldInput = screen.getByTestId(
      "quantity-value-input-test"
    ) as HTMLInputElement;
    expect(quantityFieldInput).toBeInTheDocument();
    expect(quantityFieldInput.value).toBe("");
    expect(onQuantityChange).toBeCalled();
    userEvent.type(quantityFieldInput, "-1-");
    await expect(onQuantityChange).toHaveBeenNthCalledWith(2, {
      unit: "mg",
      value: "-1",
    });
    userEvent.type(quantityFieldInput, "2.5/...-");
    await expect(onQuantityChange).toHaveBeenNthCalledWith(6, {
      unit: "mg",
      value: "2.5",
    });
  });
});
