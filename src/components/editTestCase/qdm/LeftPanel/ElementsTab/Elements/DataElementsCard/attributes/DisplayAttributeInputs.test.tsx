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

  const { findByTestId } = screen;

  it("should render the data-element selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("DataElement", onChange, onInputAdd);
    const selectorComponent = await findByTestId("data-element-selector");
    expect(selectorComponent).toBeInTheDocument();
  });
  it("should render the String selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("String", onChange, onInputAdd);
    const selectorComponent = await findByTestId("string-field-string");
    expect(selectorComponent).toBeInTheDocument();
  });

  it("should render the Time selector", async () => {
    const onChange = jest.fn;
    const onInputAdd = jest.fn;
    renderDisplayAttributeInputs("Time", onChange, onInputAdd);
    const selectorComponent = await findByTestId("time");
    expect(selectorComponent).toBeInTheDocument();
  });
});
