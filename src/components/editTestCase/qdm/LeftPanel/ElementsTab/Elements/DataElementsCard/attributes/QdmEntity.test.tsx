import * as React from "react";

import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PatientEntity, CarePartner } from "cqm-models";
import QdmEntity from "./QdmEntity";

describe("QdmEntity Component", () => {
  beforeEach(() => {});

  test("null attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType={undefined}
        attributeValue={undefined}
        setAttributeValue={mockHandleChange}
      />
    );

    expect(
      screen.queryByRole("textbox", {
        name: "Value Set / Direct Reference Code",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", {
        name: "Value",
      })
    ).not.toBeInTheDocument();
    expect(mockHandleChange).not.toHaveBeenCalled();
  });

  test("PatientEntity attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue=""
        setAttributeValue={mockHandleChange}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();
  });

  test("change in attributeType", () => {
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue=""
        setAttributeValue={mockHandleChange}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();

    rerender(
      <QdmEntity
        attributeType="CarePartner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
    expect(
      mockHandleChange.mock.calls[1][0] instanceof CarePartner
    ).toBeTruthy();
  });

  test("setAttributeValue receives updated identifier value on entity", () => {
    const mockHandleChange = jest.fn();
    const patientEntity = new PatientEntity();
    render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue={patientEntity}
        setAttributeValue={mockHandleChange}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();
    userEvent.paste(
      screen.getByRole("textbox", {
        name: "Value Set / Direct Reference Code",
      }),
      "ValueSet"
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
    expect(
      mockHandleChange.mock.calls[1][0] instanceof PatientEntity
    ).toBeTruthy();
    expect(mockHandleChange.mock.calls[1][0]?.identifier?.namingSystem).toEqual(
      "ValueSet"
    );
  });
});
