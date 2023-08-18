import React from "react";
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

    const quantityUnit = screen.getByTestId("quantity-unit-dropdown-low");
    expect(quantityUnit).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();
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

    const quantityUnit = screen.getByTestId("quantity-unit-dropdown-quantity");
    expect(quantityUnit).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();
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

  test("Should render ucum options on click", async () => {
    const handleQuantityChange = jest.fn();
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity2}
        label="test"
        onQuantityChange={handleQuantityChange}
      />
    );
    const autocomplete = screen.getByTestId("quantity-unit-dropdown-test");
    const input = within(autocomplete).getByRole(
      `combobox`
    ) as HTMLInputElement;
    autocomplete.click();
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "wk" } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    fireEvent.click(screen.getAllByRole("option")[1]);
    fireEvent.change(input, { target: { value: "/wk per week" } });
  });

  test("test change unit to empty string", async () => {
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity}
        label="test"
        onQuantityChange={onQuantityChange}
      />
    );
    const autocomplete = screen.getByTestId("quantity-unit-dropdown-test");
    const input = within(autocomplete).getByRole(
      "combobox"
    ) as HTMLInputElement;
    autocomplete.click();
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "" } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(input.value).toEqual("");
  });

  test("should render No Options when input is invalid", async () => {
    render(
      <QuantityInput
        canEdit={true}
        quantity={testQuantity}
        label="test"
        onQuantityChange={onQuantityChange}
      />
    );
    const autocomplete = screen.getByTestId("quantity-unit-dropdown-test");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.click();
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "nooption" } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("No options")).toBeInTheDocument();
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
