import * as React from "react";

import { render, screen } from "@testing-library/react";

import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { PatientEntity, CarePartner, Location, Practitioner } from "cqm-models";
import QdmEntity from "./QdmEntity";

const valueSets = [
  {
    display_name: "Encounter Inpatient",
    version: "2023-03",
    concepts: [
      {
        code: "183452005",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Snomed Emergency hospital admission (procedure)",
      },
      {
        code: "305686008",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Seen by palliative care physician (finding)",
      },
      {
        code: "Z51.5",
        code_system_name: "ICD10CM",
        code_system_oid: "4.5.6",
        code_system_version: "2023-03",
        display_name: "Encounter for palliative care",
      },
    ],
    oid: "1.2.3.4.5",
  },
  {
    display_name: "Palliative Care Intervention",
    version: "2023-03",
    concepts: [
      {
        code: "443761007",
        code_system_name: "SNOMEDCT",
        code_system_oid: "1.2.3",
        code_system_version: "2023-03",
        display_name: "Anticipatory palliative care (regime/therapy)",
      },
    ],
    oid: "7.8.9.10",
  },
];

describe("QdmEntity Component", () => {
  beforeEach(() => {});

  test("null attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType={undefined}
        attributeValue={undefined}
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
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
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(
      mockHandleChange.mock.calls[0][0] instanceof PatientEntity
    ).toBeTruthy();
  });

  test("Practitioner attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="Practitioner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(
      mockHandleChange.mock.calls[0][0] instanceof Practitioner
    ).toBeTruthy();
  });

  test("Location attributeType", () => {
    const mockHandleChange = jest.fn();
    render(
      <QdmEntity
        attributeType="Location"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange.mock.calls[0][0] instanceof Location).toBeTruthy();
  });

  test("change in attributeType", () => {
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <QdmEntity
        attributeType="PatientEntity"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
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
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
    expect(
      mockHandleChange.mock.calls[1][0] instanceof CarePartner
    ).toBeTruthy();
  });

  test("change in attributeType between location and practitioner", () => {
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <QdmEntity
        attributeType="Location"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange.mock.calls[0][0] instanceof Location).toBeTruthy();

    rerender(
      <QdmEntity
        attributeType="Practitioner"
        attributeValue=""
        setAttributeValue={mockHandleChange}
        valueSets={valueSets}
      />
    );

    expect(mockHandleChange).toHaveBeenCalledTimes(2);
    expect(
      mockHandleChange.mock.calls[1][0] instanceof Practitioner
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
        valueSets={valueSets}
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
