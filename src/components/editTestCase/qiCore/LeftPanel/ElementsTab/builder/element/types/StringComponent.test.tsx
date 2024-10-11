import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StringComponent from "./StringComponent";

describe("StringComponent", () => {
  test("Should render StringComponent", () => {
    const handleChange = jest.fn();
    render(
      <StringComponent
        value={`This is a string component`}
        label="String"
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    const stringField = screen.getByTestId("string-field-String");
    expect(stringField).toBeInTheDocument();
    const stringFieldInput = screen.getByTestId("string-field-input-String");
    expect(stringFieldInput).toBeInTheDocument();
    expect(stringFieldInput.value).toBe("This is a string component");
  });

  test("Test StringComponent change of value only allows string values", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <StringComponent
        value={`This is a string component`}
        label="String"
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    const stringField = screen.getByTestId("string-field-String");
    expect(stringField).toBeInTheDocument();
    const stringFieldInput = screen.getByTestId("string-field-input-String");
    expect(stringFieldInput).toBeInTheDocument();
    expect(stringFieldInput.value).toBe("This is a string component");

    fireEvent.change(stringFieldInput, {
      target: { value: "new string-12345,./<>?" },
    });
    rerender(
      <StringComponent
        value={`new string`}
        label="String"
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(stringFieldInput.value).toBe("new string");
  });

  test("Test StringComponent should handle key press change", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <StringComponent
        value={`This is a string component`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );

    const stringField = screen.getByTestId("string-field-VALUE");
    expect(stringField).toBeInTheDocument();
    const stringFieldInput = screen.getByTestId("string-field-input-VALUE");
    expect(stringFieldInput).toBeInTheDocument();
    expect(stringFieldInput.value).toBe("This is a string component");

    fireEvent.keyPress(stringFieldInput, { key: "-", charCode: 173 });
    expect(stringFieldInput.value).toBe("This is a string component");
    fireEvent.keyPress(stringFieldInput, { key: "a", charCode: 97 });
    expect(stringFieldInput.value).toBe("This is a string component");
  });
});
