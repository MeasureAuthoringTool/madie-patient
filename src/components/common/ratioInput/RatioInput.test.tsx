import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import RatioInput from "./RatioInput";
import userEvent from "@testing-library/user-event";
import { CQL } from "cqm-models";

const ucum1 = {
  code: "mg",
  guidance: null,
  name: "milligram",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const numerator: CQL.Quantity = {
  value: 1,
  unit: ucum1.code,
};

const ucum2 = {
  code: "wk",
  guidance: null,
  name: "week",
  system: "https://clinicaltables.nlm.nih.gov/",
};

const denominator: CQL.Quantity = {
  value: 100,
  unit: ucum2.code,
};

const ratio: CQL.Ratio = {
  numerator: numerator,
  denominator: denominator,
};

const onRatioChange = jest.fn();

describe("RatioInput Component", () => {
  it("Should render Ratio component with appropriate data", async () => {
    render(
      <RatioInput
        label="Ratio"
        ratio={ratio}
        onRatioChange={onRatioChange}
        canEdit={true}
      />
    );

    expect(screen.getByText("Numerator")).toBeInTheDocument();
    expect(screen.getByText("Denominator")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valuefieldDiv = screen.getAllByTestId(
      "quantity-value-input-numerator"
    );
    valuefieldDiv.push(
      ...screen.getAllByTestId("quantity-value-input-denominator")
    );
    expect(valuefieldDiv.length).toBe(2);
    const valueInputNumerator = screen.getAllByTestId(
      "quantity-value-input-numerator"
    ) as HTMLInputElement[];
    const valueInputDenominator = screen.getAllByTestId(
      "quantity-value-input-denominator"
    ) as HTMLInputElement[];
    expect(valueInputNumerator[0].value).toBe("1");
    expect(valueInputDenominator[0].value).toBe("100");
  });

  it("test change quantity values", async () => {
    render(
      <RatioInput
        label="Ratio"
        ratio={ratio}
        onRatioChange={onRatioChange}
        canEdit={true}
      />
    );

    expect(screen.getByText("Numerator")).toBeInTheDocument();
    expect(screen.getByText("Denominator")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valueInput = screen.getAllByTestId(
      "quantity-value-input-numerator"
    ) as HTMLInputElement[];
    valueInput.push(
      ...(screen.getAllByTestId(
        "quantity-value-input-denominator"
      ) as HTMLInputElement[])
    );
    expect(valueInput.length).toBe(2);
    expect(valueInput[0].value).toBe("1");
    expect(valueInput[1].value).toBe("100");

    userEvent.click(valueInput[0]);
    fireEvent.change(valueInput[0], {
      target: { value: 2 },
    });

    userEvent.click(valueInput[1]);
    fireEvent.change(valueInput[1], {
      target: { value: 200 },
    });
  });

  it("test change quantity unit values", async () => {
    render(
      <RatioInput
        label="Ratio"
        ratio={ratio}
        onRatioChange={onRatioChange}
        canEdit={true}
      />
    );

    expect(screen.getByText("Numerator")).toBeInTheDocument();
    expect(screen.getByText("Denominator")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("value").length).toBe(2);
    expect(screen.getAllByPlaceholderText("unit").length).toBe(2);

    const valueInputNumerator = screen.getAllByTestId(
      "quantity-value-input-numerator"
    ) as HTMLInputElement[];
    const valueInputDenominator = screen.getAllByTestId(
      "quantity-value-input-denominator"
    ) as HTMLInputElement[];
    expect(valueInputNumerator[0].value).toBe("1");
    expect(valueInputDenominator[0].value).toBe("100");
  });
});
