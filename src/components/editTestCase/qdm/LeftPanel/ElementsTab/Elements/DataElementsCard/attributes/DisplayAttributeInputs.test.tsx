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
import { mockValueSets } from "../../../../../../../common/componentDataType/ComponentType.test";

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
  value_sets: [...mockValueSets],
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

//@ts-ignore
const mockFormik: FormikContextType<any> = {
  values: {
    json: JSON.stringify(testCaseJson),
  },
};

jest.mock("@madie/madie-util", () => ({
  routeHandlerStore: {
    subscribe: (set) => {
      set();
      return { unsubscribe: () => null };
    },
    updateRouteHandlerState: () => null,
    state: { canTravel: true, pendingPath: "" },
    initialState: { canTravel: true, pendingPath: "" },
  },
}));

describe("DisplayAttributeInputs component", () => {
  let encounterElement;
  let assessmentElement;
  let mockOnInputAdd;
  beforeEach(() => {
    encounterElement = new EncounterOrder();
    assessmentElement = new AssessmentPerformed();
    mockOnInputAdd = jest.fn();
  });

  const renderDisplayAttributeInputs = (attributeType, onInputAdd) => {
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
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("DataElement", onInputAdd);
    const selectorComponent = await findByTestId("data-element-selector");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the String selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("String", onInputAdd);
    const selectorComponent = await findByTestId("string-field-string");
    expect(selectorComponent).toBeInTheDocument();

    const stringInput = (await findByTestId(
      "string-field-string-input"
    )) as HTMLInputElement;
    expect(stringInput).toBeInTheDocument();
    expect(stringInput.value).toBe("");

    fireEvent.change(stringInput, {
      target: { value: "abc" },
    });
    expect(stringInput.value).toBe("abc");
  });

  it("should render the Time selector", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Time", onInputAdd);
    const selectorComponent = await findByTestId("time");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Ratio selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Ratio", onInputAdd);
    const selectorComponent = await findByText("Ratio");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Integer selector and handle changes", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Integer", onInputAdd);
    const selectorComponent = await findByTestId("integer-field-Integer");
    expect(selectorComponent).toBeInTheDocument();

    const integerInput = (await findByTestId(
      "integer-input-field-Integer"
    )) as HTMLInputElement;
    expect(integerInput.value).toBe("");

    fireEvent.change(integerInput, {
      target: { value: "2" },
    });
    expect(integerInput.value).toBe("2");
  });

  it("should render the Quantity selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Quantity", onInputAdd);
    const selectorComponent = await findByText("Quantity");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Decimal selector and handle changes", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Decimal", onInputAdd);
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
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Code", onInputAdd);
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
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Interval<Quantity>", onInputAdd);
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
  });

  it("should render the Organization selector", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Organization", onInputAdd);
    const selectorComponent = await findByText("Identifier");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the DiagnosisComponent selector and handle diagnosis changes", async () => {
    const onInputAdd = jest.fn((value) => {
      expect(value.code.code).toBe(diagnosisValue.code.code);
    });
    renderDisplayAttributeInputs("DiagnosisComponent", onInputAdd);
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
    ) as HTMLInputElement;
    expect(rankInput).toBeInTheDocument();
    expect(rankInput.value).toBe("");

    fireEvent.change(rankInput, { target: { value: "-1" } });
    expect(rankInput.value).toBe("-1");
  });

  it("should render default", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Test", onInputAdd);
    const selectorComponent = await queryByTestId("DiagnosisComponent");
    expect(selectorComponent).not.toBeInTheDocument();
  });

  it("should capture Code input values for Components Attribute", async () => {
    renderDisplayAttributeInputs("Component", mockOnInputAdd);

    // Select a Code input
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
    userEvent.click(codeOptions[0]);

    const addButton = screen.getByRole("button", { name: "Add" });
    userEvent.click(addButton);
    expect(mockOnInputAdd).toHaveBeenCalledTimes(1);
    expect(mockOnInputAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        code: {
          code: "Z51.5",
          display: "Encounter for palliative care",
          system: "4.5.6",
          version: null,
        },
      })
    );
  });

  it("should capture input values for Component type when Result attribute is Integer", async () => {
    renderDisplayAttributeInputs("Component", mockOnInputAdd);

    // Select a choice type & value for Result
    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[4]).toHaveTextContent("Integer");
    userEvent.click(resultOptions[4]);

    const integerInput = (await screen.findByTestId(
      "integer-input-field-Integer"
    )) as HTMLInputElement;
    expect(integerInput.value).toBe("");
    userEvent.type(integerInput, "34");
    expect(integerInput.value).toBe("34");

    const addButton = screen.getByRole("button", { name: "Add" });
    userEvent.click(addButton);
    expect(mockOnInputAdd).toHaveBeenCalledTimes(1);
    expect(mockOnInputAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        result: 34,
      })
    );
  });

  it("should capture input values for Component type when Result attribute is Decimal", async () => {
    renderDisplayAttributeInputs("Component", mockOnInputAdd);

    // Select a choice type & value for Result
    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[5]).toHaveTextContent("Decimal");
    userEvent.click(resultOptions[5]);

    const integerInput = (await screen.findByTestId(
      "decimal-input-field-Decimal"
    )) as HTMLInputElement;
    expect(integerInput.value).toBe("");
    userEvent.type(integerInput, "34.68");
    expect(integerInput.value).toBe("34.68");

    const addButton = screen.getByRole("button", { name: "Add" });
    userEvent.click(addButton);
    expect(mockOnInputAdd).toHaveBeenCalledTimes(1);
    expect(mockOnInputAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        result: 34.68,
      })
    );
  });

  it("should allow user to add FacilityLocation attribute", async () => {
    renderDisplayAttributeInputs("FacilityLocation", mockOnInputAdd);

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
    userEvent.click(codeOptions[0]);

    // Location period
    const locationPeriods = screen.getAllByPlaceholderText(
      "MM/DD/YYYY hh:mm aa"
    ) as HTMLInputElement[];
    expect(locationPeriods.length).toBe(2);
    // start date
    fireEvent.change(locationPeriods[0], {
      target: { value: "08/02/2023 07:49 AM" },
    });
    expect(locationPeriods[0].value).toBe("08/02/2023 07:49 AM");
    // end date
    fireEvent.change(locationPeriods[1], {
      target: { value: "08/04/2023 11:49 AM" },
    });
    expect(locationPeriods[1].value).toBe("08/04/2023 11:49 AM");

    // add attribute
    const addButton = screen.getByRole("button", { name: "Add" });
    userEvent.click(addButton);
    expect(mockOnInputAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "QDM::FacilityLocation",
        code: {
          code: "183452005",
          display: "Snomed Emergency hospital admission (procedure)",
          system: "1.2.3",
          version: null,
        },
      })
    );
  });
});
