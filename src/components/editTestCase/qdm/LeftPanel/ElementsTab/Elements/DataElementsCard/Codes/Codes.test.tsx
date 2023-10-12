import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Codes from "./Codes";
import { CQL } from "cqm-models";

const cqmMeasure = {
  value_sets: [
    {
      display_name: "Encounter Inpatient",
      oid: "2.16.840.1.113883.3.666.5.307",
      version: "N/A",
      concepts: [
        {
          code: "183452005",
          code_system_name: "SNOMEDCT",
          code_system_oid: "2.16.840.1.113883.6.96",
          code_system_version: "2023-03",
          display_name: "Emergency hospital admission (procedure)",
        },
        {
          code: "32485007",
          code_system_name: "ICD10CM",
          code_system_oid: "2.16.840.1.113883.6.86",
          code_system_version: "2023-03",
          display_name: "Hospital admission (procedure)",
        },
        {
          code: "8715000",
          code_system_name: "ICD9CM",
          code_system_oid: "2.16.840.1.113883.6.76",
          code_system_version: "2023-03",
          display_name: "Hospital admission, elective (procedure)",
        },
      ],
    },
    {
      oid: "drc-bdb8b89536181a411ad034378b7ceef6",
      version: "N/A",
      concepts: [
        {
          code: "71802-3",
          code_system_name: "LOINC",
          code_system_version: "N/A",
          display_name: "Housing status",
        },
      ],
      display_name: "Housing status",
    },
  ],
};

let selectedDataElement = {
  codeListId: "2.16.840.1.113883.3.666.5.307",
};

const handleChange = jest.fn();
const deleteCode = jest.fn();

describe("Codes section", () => {
  it("Should render Codes component with provided props", async () => {
    render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");

    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const optionsList = await screen.findAllByTestId(/code-system-option/i);
    expect(optionsList).toHaveLength(4);
    expect(optionsList[0]).toHaveTextContent("Custom");
    expect(optionsList[1]).toHaveTextContent("SNOMEDCT");
    expect(optionsList[2]).toHaveTextContent("ICD10CM");

    expect(screen.queryByTestId("code-selector")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code-system")).not.toBeInTheDocument();
    expect(screen.queryByTestId("custom-code")).not.toBeInTheDocument();
  });

  it("Should add code system and code succesfully and display chips", async () => {
    const { rerender } = render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();

    // select the code system
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByTestId(
      /code-system-option/i
    );
    expect(codeSystemOptions).toHaveLength(4);
    userEvent.click(codeSystemOptions[1]);
    expect(codeSystemSelectInput.value).toBe("SNOMEDCT");

    // select the code
    const codeSelectInput = screen.getByTestId(
      "code-selector-input"
    ) as HTMLInputElement;
    expect(codeSelectInput.value).toBe("");
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("button");
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByTestId(/code-option/i);
    expect(codeOptions).toHaveLength(1);
    expect(codeOptions[0]).toHaveTextContent(
      "183452005 - Emergency hospital admission (procedure)"
    );
    userEvent.click(codeOptions[0]);
    expect(codeSelectInput.value).toBe("183452005");

    userEvent.click(screen.getByTestId("add-code-concept-button"));
    const expectedConcept = cqmMeasure.value_sets[0].concepts[0];
    const cqlCode = new CQL.Code(
      expectedConcept.code,
      expectedConcept.code_system_oid,
      null,
      expectedConcept.display_name
    );
    expect(handleChange).toHaveBeenCalledWith(cqlCode);

    const updatedDataElement = {
      ...selectedDataElement,
      dataElementCodes: [cqlCode],
    };

    rerender(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={updatedDataElement}
        deleteCode={deleteCode}
      />
    );
    // verify chips is added
    expect(await screen.findByTestId("SNOMEDCT_183452005")).toBeInTheDocument();
  });

  it("Should add a custom code concept and display chips", async () => {
    const customCodeSystem = "X.12.34.1";
    const customCode = "X-11";
    const { rerender } = render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();

    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const optionsList = await screen.findAllByTestId(/code-system-option/i);
    expect(optionsList).toHaveLength(4);
    expect(optionsList[0]).toHaveTextContent("Custom");
    userEvent.click(optionsList[0]);

    expect(screen.queryByTestId("code-selector")).not.toBeInTheDocument();
    expect(screen.getByTestId("custom-code-system")).toBeInTheDocument();
    expect(screen.getByTestId("custom-code")).toBeInTheDocument();

    const customCodeSystemInput = screen.getByTestId(
      "custom-code-system-input"
    );
    userEvent.type(customCodeSystemInput, customCodeSystem);
    const customCodeInput = screen.getByTestId("custom-code-input");
    userEvent.type(customCodeInput, customCode);

    userEvent.click(screen.getByTestId("add-code-concept-button"));
    const cqlCode = new CQL.Code(
      customCode,
      customCodeSystem,
      null,
      customCode
    );
    expect(handleChange).toHaveBeenCalledWith(cqlCode);

    const updatedDataElement = {
      ...selectedDataElement,
      dataElementCodes: [cqlCode],
    };

    rerender(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={updatedDataElement}
        deleteCode={deleteCode}
      />
    );
    // verify chips is added
    expect(
      await screen.findByTestId(`${customCodeSystem}_${customCode}`)
    ).toBeInTheDocument();
  });

  it("Should delete a newly added code system and code", async () => {
    const { rerender } = render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();

    // select the code system
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByTestId(
      /code-system-option/i
    );
    expect(codeSystemOptions).toHaveLength(4);
    userEvent.click(codeSystemOptions[1]);
    expect(codeSystemSelectInput.value).toBe("SNOMEDCT");

    // select the code
    const codeSelectInput = screen.getByTestId(
      "code-selector-input"
    ) as HTMLInputElement;
    expect(codeSelectInput.value).toBe("");
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("button");
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByTestId(/code-option/i);
    expect(codeOptions).toHaveLength(1);
    expect(codeOptions[0]).toHaveTextContent(
      "183452005 - Emergency hospital admission (procedure)"
    );
    userEvent.click(codeOptions[0]);
    expect(codeSelectInput.value).toBe("183452005");

    userEvent.click(screen.getByTestId("add-code-concept-button"));
    const expectedConcept = cqmMeasure.value_sets[0].concepts[0];
    const cqlCode = new CQL.Code(
      expectedConcept.code,
      expectedConcept.code_system_oid,
      null,
      expectedConcept.display_name
    );
    expect(handleChange).toHaveBeenCalledWith(cqlCode);

    const updatedDataElement = {
      ...selectedDataElement,
      dataElementCodes: [cqlCode],
    };

    rerender(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={updatedDataElement}
        deleteCode={deleteCode}
      />
    );
    // verify chips is added
    expect(await screen.findByTestId("SNOMEDCT_183452005")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("CancelIcon"));

    rerender(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(await screen.queryByTestId("SNOMEDCT_183452005")).toBeNull();
  });

  it("Should render Codes for DRCs", async () => {
    const selectedDataElementForDrc = {
      codeListId: "drc-bdb8b89536181a411ad034378b7ceef6",
    };
    render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElementForDrc}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");

    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const optionsList = await screen.findAllByTestId(/code-system-option/i);
    expect(optionsList).toHaveLength(2);
    expect(optionsList[0]).toHaveTextContent("Custom");
    expect(optionsList[1]).toHaveTextContent("LOINC");
  });
  it("No valueset found", async () => {
    const testSelectedDataElement = {
      codeListId: "testCodeListId",
    };
    render(
      <Codes
        cqmMeasure={cqmMeasure}
        handleChange={handleChange}
        selectedDataElement={testSelectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");

    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const optionsList = await screen.queryAllByTestId(/code-system-option/i);
    expect(optionsList).toHaveLength(0);
  });
  it("No concepts", async () => {
    const testCqmMeasure = {
      value_sets: [
        {
          display_name: "Encounter Inpatient",
          oid: "2.16.840.1.113883.3.666.5.307",
          version: "N/A",
        },
      ],
    };
    render(
      <Codes
        cqmMeasure={testCqmMeasure}
        handleChange={handleChange}
        selectedDataElement={selectedDataElement}
        deleteCode={deleteCode}
      />
    );
    expect(screen.getByTestId("codes-section")).toBeInTheDocument();
    const codeSystemSelectInput = screen.getByTestId(
      "code-system-selector-input"
    ) as HTMLInputElement;
    expect(codeSystemSelectInput.value).toBe("");

    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const optionsList = await screen.getAllByTestId(/code-system-option/i);
    expect(optionsList).toHaveLength(1);
  });
});
