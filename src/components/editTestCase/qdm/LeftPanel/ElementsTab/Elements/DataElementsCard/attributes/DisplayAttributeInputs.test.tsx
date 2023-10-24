import * as React from "react";
import { render, screen } from "@testing-library/react";
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

  const { findByTestId } = screen;

  it("should render the data-element selector", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("DataElement", onInputAdd);
    const selectorComponent = await findByTestId("data-element-selector");
    expect(selectorComponent).toBeInTheDocument();
  });
  it("should render the String selector", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("String", onInputAdd);
    const selectorComponent = await findByTestId("string-field-string");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Time selector", async () => {
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Time", onInputAdd);
    const selectorComponent = await findByTestId("time");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render inputs for Components Attribute", async () => {
    const mockOnInputAdd = jest.fn();
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

    // Select a choice type & value for Result
    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[1]).toHaveTextContent("Code");
    expect(resultOptions[2]).toHaveTextContent("Quantity");
    userEvent.click(resultOptions[2]);

    const quantityInput = (await screen.findByTestId(
      "quantity-value-input-quantity"
    )) as HTMLInputElement;
    expect(quantityInput.value).toBe("");
    userEvent.type(quantityInput, "34");
    expect(quantityInput.value).toBe("34");

    const unitInput = screen.getByTestId(
      "quantity-unit-dropdown-quantity"
    ) as HTMLInputElement;
    expect(unitInput.value).toBe("");
    userEvent.type(unitInput, "m meter");
    expect(unitInput.value).toBe("m meter");

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
        result: null,
      })
    );
  });

  it("should capture input values for Component type when Result attribute is Integer", async () => {
    const mockOnInputAdd = jest.fn();
    renderDisplayAttributeInputs("Component", mockOnInputAdd);

    // Select a choice type & value for Result
    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");;
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
    const mockOnInputAdd = jest.fn();
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

  it("should capture input values for Component type when Result attribute is Date", async () => {
    const mockOnInputAdd = jest.fn();
    renderDisplayAttributeInputs("Component", mockOnInputAdd);

    // Select a choice type & value for Result
    const resultSelector = screen.getByLabelText("Result");
    userEvent.click(resultSelector);
    const resultOptions = await screen.findAllByRole("option");
    expect(resultOptions.length).toBe(9);
    expect(resultOptions[0]).toHaveTextContent("-");
    expect(resultOptions[6]).toHaveTextContent("Date");
    userEvent.click(resultOptions[6]);

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
});
