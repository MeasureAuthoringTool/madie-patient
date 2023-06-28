import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Quantity from "./Quantity";

describe("Quantity Component", () => {
  const options = [
    {
      code: "B[V]",
      guidance: "used to express power gain in electrical circuits",
      name: "bel volt",
      system: "https://clinicaltables.nlm.nih.gov/",
    },
    {
      code: "B",
      guidance:
        "Logarithm of the ratio of power- or field-type quantities; usually expressed in decibels ",
      name: "bel",
      system: "https://clinicaltables.nlm.nih.gov/",
    },
    {
      code: "mho",
      guidance:
        "unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1",
      name: "mho",
      system: "https://clinicaltables.nlm.nih.gov/",
    },
  ];
  const testValue = {
    value: {
      code: "mho",
      guidance:
        "unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1",
      name: "mho",
      system: "https://clinicaltables.nlm.nih.gov/",
    },
  };

  test("Should render quantity component", () => {
    const handleChange = jest.fn();
    render(
      <Quantity
        quantityUnit={"Test Option1"}
        handleQuantityUnitChange={handleChange}
        canEdit={true}
        placeholder="test"
        quantityValue={0}
        handleQuantityValueChange={handleChange}
        options={options}
        label="low"
      />
    );
    const quantityUnitLabel = screen.getByTestId(
      "quantity-unit-dropdown-label-low"
    );
    expect(quantityUnitLabel).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();

    const quantityValueLabel = screen.getByTestId("quantity-value-label-low");
    expect(quantityValueLabel).toBeInTheDocument();
    const quantityValueInput = screen.getByRole("textbox");
    expect(quantityValueInput).toBeInTheDocument();
  });

  test("Change of value should render the new value", () => {
    const handleChange = jest.fn();
    render(
      <Quantity
        quantityUnit={"Test Option1"}
        handleQuantityUnitChange={handleChange}
        canEdit={true}
        placeholder="test"
        quantityValue={0}
        handleQuantityValueChange={handleChange}
        options={options}
        label="low"
      />
    );
    const quantityUnitLabel = screen.getByTestId(
      "quantity-unit-dropdown-label-low"
    );
    expect(quantityUnitLabel).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();

    const quantityValueLabel = screen.getByTestId("quantity-value-label-low");
    expect(quantityValueLabel).toBeInTheDocument();
    const quantityValueInput = screen.getByRole("textbox") as HTMLInputElement;
    expect(quantityValueInput).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("0");
    fireEvent.change(inputLow, { target: { value: "10" } });
    expect(inputLow.value).toBe("10");
  });

  test("Should render quantity unit field with selected option", async () => {
    const handleChange = jest.fn();
    render(
      <Quantity
        quantityUnit={testValue}
        handleQuantityUnitChange={handleChange}
        canEdit={true}
        placeholder="test"
        quantityValue={0}
        handleQuantityValueChange={handleChange}
        options={options}
        label="high"
      />
    );
    await act(async () => {
      const quantityUnitLabel = screen.getByTestId(
        "quantity-unit-dropdown-label-high"
      );
      expect(quantityUnitLabel).toBeInTheDocument();
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
    const handleChange = jest.fn();
    render(
      <Quantity
        quantityUnit={null}
        handleQuantityUnitChange={handleChange}
        canEdit={true}
        placeholder="test"
        quantityValue={0}
        handleQuantityValueChange={handleChange}
        options={options}
        label="test"
      />
    );
    const autocomplete = screen.getByTestId("quantity-unit-dropdown-test");
    const input = within(autocomplete).getByRole("combobox");
    autocomplete.click();
    autocomplete.focus();
    fireEvent.change(input, { target: { value: "b" } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    fireEvent.click(screen.getAllByRole("option")[1]);
    expect(input.value).toEqual("B bel");
  });
});
