import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BooleanComponent from "./BooleanComponent";

describe("BooleanComponent Component", () => {
  test("Should render BooleanComponent component", () => {
    const handleChange = jest.fn();
    render(
      <BooleanComponent
        value={`True`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        label="MyBoolean"
        structureDefinition={null}
      />
    );

    const booleanField = screen.getByTestId("boolean-field-MyBoolean");
    expect(booleanField).toBeInTheDocument();
    const booleanFieldInput = screen.getByTestId(
      "boolean-input-field-MyBoolean"
    );
    expect(booleanFieldInput).toBeInTheDocument();
  });

  test("Test change of value", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <BooleanComponent
        canEdit={true}
        value={`False`}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
        label="BodyStructure.active"
      />
    );

    const booleanField = screen.getByTestId(
      "boolean-field-BodyStructure.active"
    );
    expect(booleanField).toBeInTheDocument();
    const booleanFieldInput = screen.getByTestId(
      "boolean-input-field-BodyStructure.active"
    ) as HTMLInputElement;
    expect(booleanFieldInput).toBeInTheDocument();
    expect(booleanFieldInput.value).toBe("False");
    fireEvent.change(booleanFieldInput, { target: { value: "True" } });
    rerender(
      <BooleanComponent
        value={`True`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(booleanFieldInput.value).toBe("True");
  });
});
