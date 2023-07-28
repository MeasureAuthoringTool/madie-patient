import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Quantity from "./Quantity";
import { CQL } from "cqm-models";

describe("Quantity Component", () => {
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

  test("Should render quantity component", () => {
    render(<Quantity canEdit={true} quantity={testQuantity} label="low" />);

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
      <Quantity
        canEdit={true}
        quantity={testQuantity}
        handleQuantityChange={handleQuantityChange}
        label="low"
      />
    );

    const quantityValue = screen.getByTestId("quantity-value-field-low");
    expect(quantityValue).toBeInTheDocument();
    const quantityValueInput = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(quantityValueInput).toBeInTheDocument();
    expect(quantityValueInput.value).toBe("0");
    fireEvent.change(quantityValueInput, { target: { value: "10" } });

    const quantityUnit = screen.getByTestId("quantity-unit-dropdown-low");
    expect(quantityUnit).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();
  });

  test.skip("Should render quantity unit field with selected option", async () => {
    const handleChange = jest.fn();
    render(<Quantity canEdit={true} quantity={testQuantity} label="high" />);
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
      <Quantity
        canEdit={true}
        quantity={testQuantity2}
        label="test"
        handleQuantityChange={handleQuantityChange}
      />
    );
    const autocomplete = screen.getByTestId("quantity-unit-dropdown-test");
    const input = within(autocomplete).getByRole(
      "combobox"
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
    render(<Quantity canEdit={true} quantity={testQuantity} label="test" />);
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
    render(<Quantity canEdit={true} quantity={testQuantity} label="test" />);
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
});
