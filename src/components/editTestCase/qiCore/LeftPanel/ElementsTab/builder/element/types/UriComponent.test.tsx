import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UriComponent from "./UriComponent";

describe("BooleanComponent Component", () => {
  test("Should render BooleanComponent component", () => {
    const handleChange = jest.fn();
    render(
      <UriComponent
        value={`urn:oid:2.16.840.1.113883.6.238`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        label="URI"
        structureDefinition={null}
      />
    );

    const uriField = screen.getByTestId("uri-field-URI");
    expect(uriField).toBeInTheDocument();
    const uriFieldInput = screen.getByTestId("uri-input-field-URI");
    expect(uriFieldInput).toBeInTheDocument();
    expect(uriFieldInput.value).toBe("urn:oid:2.16.840.1.113883.6.238");
  });

  test("Test change of value", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <UriComponent
        value={`urn:oid:2.16.840.1.113883.6.238`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        label="URI"
        structureDefinition={null}
      />
    );

    const uriField = screen.getByTestId("uri-field-URI");
    expect(uriField).toBeInTheDocument();
    const uriFieldInput = screen.getByTestId("uri-input-field-URI");
    expect(uriFieldInput).toBeInTheDocument();
    expect(uriFieldInput.value).toBe("urn:oid:2.16.840.1.113883.6.238");
    fireEvent.change(uriFieldInput, {
      target: { value: "urn:oid:2.16.840.1.113883.4.642.3.224" },
    });
    rerender(
      <UriComponent
        value={`urn:oid:2.16.840.1.113883.4.642.3.224`}
        canEdit={true}
        fieldRequired={false}
        onChange={handleChange}
        structureDefinition={null}
      />
    );
    expect(uriFieldInput.value).toBe("urn:oid:2.16.840.1.113883.4.642.3.224");
  });
});
