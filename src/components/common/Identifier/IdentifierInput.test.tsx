import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Identifier from "./IdentifierInput";
import userEvent from "@testing-library/user-event";

describe("Identifier Component", () => {
  test("Should render Identifier component", () => {
    const handleChange = jest.fn();
    render(
      <Identifier
        handleChange={handleChange}
        canEdit={true}
        identifier={{ namingSystem: "ID", value: "123" }}
        namingLabel="Test1"
      />
    );

    const identifierField = screen.getByTestId(
      "identifier-field-Naming System"
    );
    expect(identifierField).toBeInTheDocument();
    const identifierFieldInput = screen.getByTestId(
      "identifier-input-field-Naming System"
    );
    expect(identifierFieldInput).toBeInTheDocument();
  });

  test("Test change of value", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Identifier
        handleChange={handleChange}
        canEdit={true}
        identifier={{ namingSystem: "ID", value: "123" }}
      />
    );

    const identifierField = screen.getByTestId("identifier-value-field-Value");
    expect(identifierField).toBeInTheDocument();
    const identifierFieldInput = screen.getByTestId(
      "identifier-value-input-field-Value"
    ) as HTMLInputElement;
    expect(identifierFieldInput).toBeInTheDocument();
    expect(identifierFieldInput.value).toBe("123");
    fireEvent.change(identifierFieldInput, { target: { value: "10" } });
    rerender(
      <Identifier
        handleChange={handleChange}
        canEdit={true}
        identifier={{ namingSystem: "ID", value: "10" }}
      />
    );
    expect(identifierFieldInput.value).toBe("10");
  });
});
