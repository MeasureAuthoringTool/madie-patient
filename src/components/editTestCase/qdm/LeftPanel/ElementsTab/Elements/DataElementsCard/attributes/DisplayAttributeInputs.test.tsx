import * as React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { QdmExecutionContextProvider } from "../../../../../../../routes/qdm/QdmExecutionContext";
import { MeasureScoring } from "@madie/madie-models";
import DisplayAttributeInputs from "./DisplayAttributeInputs";
import { testCaseJson } from "../../../../../../../../mockdata/qdm/testcase";
import { FormikProvider, FormikContextType } from "formik";
import { QdmPatientProvider } from "../../../../../../../../util/QdmPatientContext";
import {
  ApiContextProvider,
  ServiceConfig,
} from "../../../../../../../../api/ServiceContext";
import { EncounterOrder, AssessmentPerformed } from "cqm-models";
import userEvent from "@testing-library/user-event";

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
  value_sets: [
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
  ],
};

const diagnosisValue = {
  code: {
    code: "183452005",
    system: "1.2.3",
    version: null,
    display: "Snomed Emergency hospital admission (procedure)",
  },
  presentOnAdmissionIndicator: {
    code: "183452005",
    system: "1.2.3",
    version: null,
    display: "Snomed Emergency hospital admission (procedure)",
  },
  rank: -1,
};

jest.mock("dayjs", () => ({
  extend: jest.fn(),
  utc: jest.fn((...args) => {
    const dayjs = jest.requireActual("dayjs");
    dayjs.extend(jest.requireActual("dayjs/plugin/utc"));

    return dayjs.utc(
      args.filter((arg) => arg).length > 0 ? args : "01/01/2023"
    );
  }),
  startOf: jest.fn().mockReturnThis(),
}));

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

describe("DisplayAttributeInputs component", () => {
  let encounterElement;
  let assessmentElement;
  beforeEach(() => {
    encounterElement = new EncounterOrder();
    assessmentElement = new AssessmentPerformed();
  });

  const renderDisplayAttributeInputs = (
    attributeType,
    onChange,
    onInputAdd
  ) => {
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
                <DisplayAttributeInputs
                  attributeType={attributeType}
                  onInputAdd={onInputAdd}
                  selectedDataElement={encounterElement}
                />
              </QdmPatientProvider>
            </QdmExecutionContextProvider>
          </FormikProvider>
        </ApiContextProvider>
      </MemoryRouter>
    );
  };

  const { findByTestId, queryByTestId, findByText } = screen;

  it("should render the data-element selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("DataElement", onChange, onInputAdd);
    const selectorComponent = await findByTestId("data-element-selector");
    expect(selectorComponent).toBeInTheDocument();
  });
  it("should render the String selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("String", onChange, onInputAdd);
    const selectorComponent = await findByTestId("string-field-string");
    expect(selectorComponent).toBeInTheDocument();

    const stringInput = await findByTestId("string-field-string-input");
    expect(stringInput).toBeInTheDocument();
    expect(stringInput.value).toBe("");

    fireEvent.change(stringInput, {
      target: { value: "abc" },
    });
    expect(stringInput.value).toBe("abc");
  });

  it("should render the Time selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Time", onChange, onInputAdd);
    const selectorComponent = await findByTestId("time");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Ratio selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Ratio", onChange, onInputAdd);
    const selectorComponent = await findByText("Ratio");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Integer selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Integer", onChange, onInputAdd);
    const selectorComponent = await findByTestId("integer-field-Integer");
    expect(selectorComponent).toBeInTheDocument();

    const integerInput = await findByTestId("integer-input-field-Integer");
    expect(integerInput.value).toBe("");

    fireEvent.change(integerInput, {
      target: { value: "2" },
    });
    expect(integerInput.value).toBe("2");
  });

  it("should render the Quantity selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Quantity", onChange, onInputAdd);
    const selectorComponent = await findByText("Quantity");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Decimal selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Decimal", onChange, onInputAdd);
    const selectorComponent = await findByText("Decimal");
    expect(selectorComponent).toBeInTheDocument();

    const DecimalFieldInput = screen.getByTestId(
      "decimal-input-field-Decimal"
    ) as HTMLInputElement;
    expect(DecimalFieldInput).toBeInTheDocument();
    expect(DecimalFieldInput.value).toBe("");
    userEvent.type(DecimalFieldInput, "1");
    expect(DecimalFieldInput.value).toBe("1");
  });

  it("should render the Code selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Code", onChange, onInputAdd);
    const selectorComponent = await findByTestId("value-set-selector");
    expect(selectorComponent).toBeInTheDocument();

    // select the value set
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("button");
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByRole("option");
    expect(codeOptions).toHaveLength(2);
    expect(codeOptions[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions[0]);
  });

  it("should render the Interval<Quantity> selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Interval<Quantity>", onChange, onInputAdd);
    const selectorComponent = await findByText("Quantity Interval");
    expect(selectorComponent).toBeInTheDocument();

    expect(screen.getByTestId("quantity-value-field-low")).toBeInTheDocument();
    const inputLow = screen.getByTestId(
      "quantity-value-input-low"
    ) as HTMLInputElement;
    expect(inputLow.value).toBe("");

    userEvent.click(inputLow);
    fireEvent.change(inputLow, {
      target: { value: "2" },
    });
    expect(inputLow.value).toBe("2");

    expect(screen.getByTestId("quantity-value-field-high")).toBeInTheDocument();
    const inputHigh = screen.getByTestId(
      "quantity-value-input-high"
    ) as HTMLInputElement;
    expect(inputHigh.value).toBe("");

    userEvent.click(inputHigh);
    fireEvent.change(inputHigh, {
      target: { value: 200 },
    });
    expect(inputHigh.value).toBe("200");

    const autocomplete1 = screen.getByTestId("quantity-unit-dropdown-low");
    const unitInputLow = within(autocomplete1).getByRole(
      "combobox"
    ) as HTMLInputElement;

    userEvent.click(autocomplete1);
    userEvent.keyboard("wk week");
    fireEvent.mouseDown(autocomplete1);
    expect(unitInputLow.value).toEqual("wk week");

    const autocomplete2 = screen.getByTestId("quantity-unit-dropdown-high");
    const unitInputHigh = within(autocomplete2).getByRole(
      "combobox"
    ) as HTMLInputElement;

    userEvent.click(autocomplete2);
    userEvent.keyboard("mg milligram");
    fireEvent.mouseDown(autocomplete2);
    expect(unitInputHigh.value).toEqual("mg milligram");
  });

  it("should render the Organization selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Organization", onChange, onInputAdd);
    const selectorComponent = await findByText("Identifier");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the DiagnosisComponent selector and handle diagnosis changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn((value) => {
      expect(value.code.code).toBe(diagnosisValue.code.code);
    });
    renderDisplayAttributeInputs("DiagnosisComponent", onChange, onInputAdd);
    const selectorComponent = await findByTestId("DiagnosisComponent");
    expect(selectorComponent).toBeInTheDocument();

    // select the value set
    const valueSetSelector = screen.getByTestId("value-set-selector");
    const valueSetDropdown = within(valueSetSelector).getByRole(
      "button"
    ) as HTMLInputElement;
    userEvent.click(valueSetDropdown);
    const valueSetOptions = await screen.findAllByRole("option");
    userEvent.click(valueSetOptions[1]);

    // select the code system
    const codeSystemSelector = screen.getByTestId("code-system-selector");
    const codeSystemDropdown = within(codeSystemSelector).getByRole("button");
    userEvent.click(codeSystemDropdown);
    const codeSystemOptions = await screen.findAllByRole("option");
    expect(codeSystemOptions[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptions[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptions[0]);

    // select the code
    const codeSelector = screen.getByTestId("code-selector");
    const codeDropdown = within(codeSelector).getByRole("button");
    userEvent.click(codeDropdown);
    const codeOptions = await screen.findAllByRole("option");
    expect(codeOptions).toHaveLength(2);
    expect(codeOptions[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptions[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptions[0]);

    //Present On Admission Indicator
    const presentOnAdmissionIndicatorInput = screen.getByTestId(
      "value-set-selector-input-present-on-admission-indicator"
    ) as HTMLInputElement;
    expect(presentOnAdmissionIndicatorInput.value).toBe("");
    const presentOnAdmissionIndicatorSelector = screen.getByTestId(
      "value-set-selector-present-on-admission-indicator"
    );
    const presentOnAdmissionIndicatorDropdown = within(
      presentOnAdmissionIndicatorSelector
    ).getByRole("button") as HTMLInputElement;
    userEvent.click(presentOnAdmissionIndicatorDropdown);

    const presentOnAdmissionIndicatorOptions = await screen.findAllByRole(
      "option"
    );
    expect(presentOnAdmissionIndicatorOptions).toHaveLength(3);
    //select value set
    userEvent.click(presentOnAdmissionIndicatorOptions[1]);

    // select the code system
    const codeSystemSelectorPOAI = screen.getByTestId(
      "code-system-selector-present-on-admission-indicator"
    );
    const codeSystemDropdownPOAI = within(codeSystemSelectorPOAI).getByRole(
      "button"
    );
    userEvent.click(codeSystemDropdownPOAI);
    const codeSystemOptionsPOAI = await screen.findAllByRole("option");
    expect(codeSystemOptionsPOAI[0]).toHaveTextContent("SNOMEDCT");
    expect(codeSystemOptionsPOAI[1]).toHaveTextContent("ICD10CM");
    userEvent.click(codeSystemOptionsPOAI[0]);

    // select the code
    const codeSelectorPOAI = screen.getByTestId(
      "code-selector-present-on-admission-indicator"
    );
    const codeDropdownPOAI = within(codeSelectorPOAI).getByRole("button");
    userEvent.click(codeDropdownPOAI);
    const codeOptionsPOAI = await screen.findAllByRole("option");
    expect(codeOptionsPOAI).toHaveLength(2);
    expect(codeOptionsPOAI[0]).toHaveTextContent(
      "183452005 - Snomed Emergency hospital admission (procedure)"
    );
    expect(codeOptionsPOAI[1]).toHaveTextContent(
      "305686008 - Seen by palliative care physician (finding)"
    );
    userEvent.click(codeOptionsPOAI[0]);

    //Rank
    const rankInput = screen.getByTestId(
      "integer-input-field-Rank"
    ) as HTMLElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "-1" } });
    expect(rankInput.value).toBe("-1");
  });

  it("should render default", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Test", onChange, onInputAdd);
    const selectorComponent = await queryByTestId("DiagnosisComponent");
    expect(selectorComponent).not.toBeInTheDocument();
  });
});
