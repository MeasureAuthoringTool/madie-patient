import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ComponentType from "./ComponentType";
import { AssessmentPerformed } from "cqm-models";
import { ApiContextProvider, ServiceConfig } from "../../../api/ServiceContext";
import { FormikContextType, FormikProvider } from "formik";
import { QdmExecutionContextProvider } from "../../routes/qdm/QdmExecutionContext";
import { QdmPatientProvider } from "../../../util/QdmPatientContext";
import { MemoryRouter } from "react-router-dom";
import { MeasureScoring } from "@madie/madie-models";
import { testCaseJson } from "../../../mockdata/qdm/testcase";
import userEvent from "@testing-library/user-event";

const mockOnChange = jest.fn();
const mockOnInputAdd = jest.fn();

export const mockValueSets = [
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

const serviceConfig: ServiceConfig = {
  testCaseService: {
    baseUrl: "base.url",
  },
  measureService: {
    baseUrl: "base.url",
  },
  terminologyService: {
    baseUrl: "http.com",
  },
  elmTranslationService: {
    baseUrl: "base.url",
  },
};
const mockCqmMeasure = {
  id: "id-1",
  title: "Mock Measure",
  measure_scoring: MeasureScoring.COHORT,
  value_sets: [],
};

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

describe("Component Type Component", () => {
  let assessmentPerformed;
  beforeEach(() => {
    assessmentPerformed = new AssessmentPerformed();
  });

  const renderComponentType = () => {
    return render(
      <MemoryRouter>
        <ApiContextProvider value={serviceConfig}>
          <FormikProvider value={mockFormik}>
            <QdmExecutionContextProvider
              value={{
                measureState: [null, jest.fn],
                cqmMeasureState: [mockCqmMeasure, jest.fn],
                executionContextReady: true,
                executing: false,
                setExecuting: jest.fn(),
                contextFailure: false,
              }}
            >
              <QdmPatientProvider>
                <ComponentType
                  onChange={mockOnChange}
                  canEdit={true}
                  valueSets={mockValueSets}
                  selectedDataElement={assessmentPerformed}
                  onInputAdd={mockOnInputAdd}
                />
              </QdmPatientProvider>
            </QdmExecutionContextProvider>
          </FormikProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  };

  it("Should render required types and attributes for component type", async () => {
    renderComponentType();

    const valueSetSelector = screen.getByLabelText(
      "Value Set / Direct Reference Code"
    );
    userEvent.click(valueSetSelector);
    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions.length).toBe(3);
    expect(valueSetOptions[0]).toHaveTextContent("Custom Code");
    expect(valueSetOptions[1]).toHaveTextContent(mockValueSets[0].display_name);
    expect(valueSetOptions[2]).toHaveTextContent(mockValueSets[1].display_name);

    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[1]).toHaveTextContent("Code");
    expect(resultOptions[2]).toHaveTextContent("Quantity");
    expect(resultOptions[3]).toHaveTextContent("Ratio");
  });

  it("Should render appropriate components for selected choice types", async () => {
    renderComponentType();

    const valueSetSelector = screen.getByLabelText(
      "Value Set / Direct Reference Code"
    );
    userEvent.click(valueSetSelector);
    const valueSetOptions = await screen.findAllByRole("option");
    expect(valueSetOptions.length).toBe(3);
    expect(valueSetOptions[1]).toHaveTextContent("Encounter Inpatient");
    expect(valueSetOptions[2]).toHaveTextContent(
      "Palliative Care Intervention"
    );
    userEvent.click(valueSetOptions[1]);

    const codeSystemSelector = await screen.findByLabelText("Code System");
    expect(codeSystemSelector).toBeInTheDocument();

    userEvent.click(codeSystemSelector);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions.length).toBe(2);
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[1]);

    const codeSelector = await screen.findByLabelText("Code");
    expect(codeSelector).toBeInTheDocument();

    userEvent.click(codeSelector);
    const codeOptions = await screen.findAllByRole("option");
    expect(codeOptions.length).toBe(1);
    expect(codeOptions[0]).toHaveTextContent("Encounter for palliative care");

    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[1]).toHaveTextContent("Code");
    expect(resultOptions[2]).toHaveTextContent("Quantity");
    expect(resultOptions[3]).toHaveTextContent("Ratio");

    userEvent.click(resultOptions[1]);
    const valueSetSelectorForResult = await screen.findAllByLabelText(
      "Value Set / Direct Reference Code"
    );
    expect(valueSetSelectorForResult.length).toBe(2);

    userEvent.click(resultSelector);
    const reRenderedResultOptions = await screen.findAllByRole("option");
    expect(reRenderedResultOptions.length).toBe(9);
    expect(reRenderedResultOptions[4]).toHaveTextContent("Integer");
    userEvent.click(reRenderedResultOptions[4]);

    expect(
      await screen.findByTestId("integer-input-field-Integer")
    ).toBeInTheDocument();
  });
});
