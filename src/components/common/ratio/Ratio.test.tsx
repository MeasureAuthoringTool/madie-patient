import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Ratio from "./Ratio";
import userEvent from "@testing-library/user-event";

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

describe("Ratio Component", () => {
  it("Should render Ratio component with appropriate data", async () => {
    render(
      <Ratio
        label="Ratio"
        lowQuantity={1}
        lowQuantityUnit={testValue1}
        highQuantity={100}
        highQuantityUnit={testValue2}
        canEdit={true}
      />
    );

    expect(screen.getByText("Ratio")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valuefieldDiv = screen.getAllByTestId("quantity-value-input-Ratio");
    expect(valuefieldDiv.length).toBe(2);
    const valueInput = screen.getAllByTestId(
      "quantity-value-input-Ratio"
    ) as HTMLInputElement[];
    expect(valueInput[0].value).toBe("1");
    expect(valueInput[1].value).toBe("100");

    const autocomplete = screen.getAllByTestId("quantity-unit-dropdown-Ratio");
    expect(autocomplete.length).toBe(2);
    const unitInputLow = within(autocomplete[0]).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputLow.value).toEqual("mg milligram");
    const unitInputHigh = within(autocomplete[1]).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputHigh.value).toEqual("wk week");
  });

  it("test change quantity values", async () => {
    render(
      <Ratio
        label="Ratio"
        lowQuantity={1}
        lowQuantityUnit={testValue1}
        highQuantity={100}
        highQuantityUnit={testValue2}
        canEdit={true}
      />
    );

    expect(screen.getByText("Ratio")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valueInput = screen.getAllByTestId(
      "quantity-value-input-Ratio"
    ) as HTMLInputElement[];
    expect(valueInput.length).toBe(2);
    expect(valueInput[0].value).toBe("1");
    expect(valueInput[1].value).toBe("100");

    userEvent.click(valueInput[0]);
    fireEvent.change(valueInput[0], {
      target: { value: 2 },
    });
    expect(valueInput[0].value).toBe("2");

    userEvent.click(valueInput[1]);
    fireEvent.change(valueInput[1], {
      target: { value: 200 },
    });
    expect(valueInput[1].value).toBe("200");
  });

  it("test change quantity unit values", async () => {
    render(
      <Ratio
        label="Ratio"
        lowQuantity={1}
        lowQuantityUnit={testValue1}
        highQuantity={100}
        highQuantityUnit={testValue2}
        canEdit={true}
      />
    );

    expect(screen.getByText("Ratio")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valueInput = screen.getAllByTestId(
      "quantity-value-input-Ratio"
    ) as HTMLInputElement[];
    expect(valueInput.length).toBe(2);
    expect(valueInput[0].value).toBe("1");
    expect(valueInput[1].value).toBe("100");

    const autocomplete = screen.getAllByTestId("quantity-unit-dropdown-Ratio");
    expect(autocomplete.length).toBe(2);
    const unitInputLow = within(autocomplete[0]).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputLow.value).toEqual("mg milligram");
    const unitInputHigh = within(autocomplete[1]).getByRole(
      "combobox"
    ) as HTMLInputElement;
    expect(unitInputHigh.value).toEqual("wk week");

    userEvent.click(autocomplete[0]);
    userEvent.keyboard("wk week");
    fireEvent.mouseDown(autocomplete[0]);
    expect(unitInputLow.value).toEqual("wk week");

    userEvent.click(autocomplete[1]);
    userEvent.keyboard("a year");
    fireEvent.mouseDown(autocomplete[1]);
    expect(unitInputHigh.value).toEqual("a year");
  });
});
