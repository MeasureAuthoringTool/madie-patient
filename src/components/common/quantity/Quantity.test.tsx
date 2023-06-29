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
    label: "mho mho",
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

    const quantityValue = screen.getByTestId("quantity-value-field-low");
    expect(quantityValue).toBeInTheDocument();
    const quantityValueInput = screen.getByTestId("quantity-value-input-low");
    expect(quantityValueInput).toBeInTheDocument();

    const quantityUnit = screen.getByTestId("quantity-unit-dropdown-low");
    expect(quantityUnit).toBeInTheDocument();
    const quantityUnitInput = screen.getByRole("combobox");
    expect(quantityUnitInput).toBeInTheDocument();
  });

  test("Test hange of value", () => {
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
        quantityUnit={{
          label: "",
          value: { code: "", guidance: "", name: "", system: "" },
        }}
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

  test("should render No Options when input is invalid", async () => {
    const handleChange = jest.fn();
    render(
      <Quantity
        quantityUnit={{
          label: "",
          value: { code: "", guidance: "", name: "", system: "" },
        }}
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
    fireEvent.change(input, { target: { value: "w" } });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.getByText("No options")).toBeInTheDocument();
  });
});
