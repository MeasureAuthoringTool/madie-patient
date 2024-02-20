import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Identifier from "./IdentifierInput";
import userEvent from "@testing-library/user-event";

describe("Identifier Component", () => {
  test("Should render Identifier component", () => {
    const onIdentifierChange = jest.fn();
    render(
      <Identifier
        onIdentifierChange={onIdentifierChange}
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
    const onIdentifierChange = jest.fn();
    const { rerender } = render(
      <Identifier
        onIdentifierChange={onIdentifierChange}
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
        onIdentifierChange={onIdentifierChange}
        canEdit={true}
        identifier={{ namingSystem: "ID", value: "10" }}
      />
    );
    expect(identifierFieldInput.value).toBe("10");
  });

  test("Test change of namingSystem", () => {
    const onIdentifierChange = jest.fn();
    const { rerender } = render(
      <Identifier
        onIdentifierChange={onIdentifierChange}
        canEdit={true}
        identifier={{ namingSystem: "ID", value: "123" }}
      />
    );

    const identifierField = screen.getByTestId(
      "identifier-field-Naming System"
    );
    expect(identifierField).toBeInTheDocument();
    const identifierFieldInput = screen.getByTestId(
      "identifier-input-field-Naming System"
    ) as HTMLInputElement;
    expect(identifierFieldInput).toBeInTheDocument();
    expect(identifierFieldInput.value).toBe("ID");
    fireEvent.change(identifierFieldInput, { target: { namingSystem: "ID2" } });
    rerender(
      <Identifier
        onIdentifierChange={onIdentifierChange}
        canEdit={true}
        identifier={{ namingSystem: "ID2", value: "10" }}
      />
    );
    expect(identifierFieldInput.value).toBe("ID2");

    //screen.debug(undefined, 50000);
  });
});
